from flask import Flask, request, jsonify
from flask_cors import CORS
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.model.ollama import Ollama
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.googlesearch import GoogleSearch
import os
import json
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)

# Enable CORS with specific configurations
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Replace '*' with specific domains in production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("No OpenAI API Key Found. Defaulting to Ollama.")

# Agent configuration instructions
search_instructions = (
    "Your job is to find the mission statement, values, and culture of the provided business. "
    "Search the web using the tools provided, or create a realistic response if no data is available."
)

format_instructions = (
    "Format the following information into JSON with the following keys and types:\n"
    "{\n"
    "  'missionStatement': str,\n"
    "  'values': list of str,\n"
    "  'culture': str\n"
    "}.\n"
    "Reply only with the JSON object."
)

# Define agents for OpenAI and Ollama
openai_web_agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini", api_key=openai_api_key),
    tools=[DuckDuckGo()],
    instructions=[search_instructions]
)

openai_formatter_agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini", api_key=openai_api_key),
    instructions=[format_instructions]
)

llama_web_agent = Agent(
    model=Ollama(id="llama3.2:3b"),
    #tools=[DuckDuckGo()],
    tools=[GoogleSearch()],
    instructions=[search_instructions]
)

llama_formatter_agent = Agent(
    model=Ollama(id="llama3.2:3b"),
    instructions=[format_instructions]
)

# Choose agents based on available API key
if openai_api_key:
    web_agent = llama_web_agent
    formatter_agent = llama_formatter_agent
else:
    web_agent = llama_web_agent
    formatter_agent = llama_formatter_agent

# Endpoint: Search for business information
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    print(f"Searching for: {query}")
    try:
        results = web_agent.run(f"Tell me about {query}. Their mission statement, values, and culture.")
    except Exception as e:
        #print(f"Error during DuckDuckGo search: {e}")
        return jsonify({'error': 'An error occurred while searching for information.'}), 500

    # Extract assistant responses
    responses = [msg.content for msg in results.messages if msg.role == "assistant" and msg.content] # Response: ['', "Based on the avai..."]
    if responses:
        print("Search completed successfully.")
        print(f"Response: {responses}")
        return jsonify({'result': responses})
        #return responses
    else:
        return jsonify({'error': 'No results found'}), 404

# Endpoint: Format business information
@app.route('/format', methods=['GET'])
def format_data():
    query_param = request.args.get('query')
    if not query_param:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        # Parse the JSON string from the query parameter
        request_data = json.loads(query_param)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in query parameter'}), 400

    # Ensure 'result' key exists and is a list
    if 'result' not in request_data or not isinstance(request_data['result'], list):
        return jsonify({'error': "'result' key is missing or is not a list in the query parameter"}), 400

    # Extract the first item from the 'result' list
    data = request_data['result'][0] if request_data['result'] else ""
    print(f"Formatting data: {data}")

    # If data is an empty string, return an error
    if data == "":
        return jsonify({'error': 'Empty String'}), 400

    max_retries = 3
    for attempt in range(max_retries):
        try:
            results = formatter_agent.run(f"Format the following: {data}")
        except Exception as e:
            print(f"Attempt {attempt + 1}: Error during formatting: {e}")
            continue

        # Parse responses for JSON validity
        for message in results.messages:
            if message.role == "assistant" and message.content:
                try:
                    json_object = json.loads(message.content)
                    if all(k in json_object for k in ("missionStatement", "values", "culture")):
                        return jsonify({'result': json_object})
                except json.JSONDecodeError:
                    print(f"Attempt {attempt + 1}: Invalid JSON format received.")
                    data = message.content  # Retry with the latest response
                    break
        else:
            # If no valid JSON found in messages, continue to next attempt
            continue

    return jsonify({'error': 'Failed to format data after multiple attempts'}), 500

# Endpoint: Test the API with a sample company
@app.route('/test', methods=['GET'])
def test():
    company = "Fruit of the Loom"
    print(f"Testing with company: {company}")

    # Call the /search endpoint using Flask's test client
    with app.test_client() as client:
        search_response = client.get('/search', query_string={'query': company})
        if search_response.status_code != 200:
            return search_response

        # Extract data from the search response
        search_data = search_response.get_json().get('result')
        if not search_data:
            return jsonify({'error': 'No search data returned'}), 404

        # Call the /format endpoint using the test client
        format_response = client.post('/format', json={'data': search_data[0]})
        if format_response.status_code != 200:
            return format_response

        # Return the final formatted result
        return format_response


# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
