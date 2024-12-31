# Create a simple API endpoint that uses phidata agent to search / scrape data from the web
# API should be passed a business name, and return the business:
# Mission Statement, values, and culture

from flask import Flask, request, jsonify
from phi.agent import Agent
#from phi.model.openai import OpenAIChat
from phi.model.ollama import Ollama
from phi.tools.duckduckgo import DuckDuckGo
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)


web_agent = Agent(
    #model=OpenAIChat(id="gpt-4o"),
    model=Ollama(id="llama3.2:3b"),
    tools=[DuckDuckGo()],
    instructions=["Your job is to find the mission statement, values, and culture of the business provided. Think carefully and slowly to provide the best results. Use the tools provided to search the web for more information. If no information is found, just create a realistic response of what you think the business would have for this information."],
    #show_tool_calls=True,
    #markdown=True,
)

formatter_agent = Agent(
    model=Ollama(id="llama3.2:3b"),
    instructions=["""
                  Your job is to format the data provided. Return a JSON object that looks like the following keys and value types. Attached below is an example of the expected output: 
                    {
                      "missionStatement" -> str : "To revolutionize the industry through innovative solutions while maintaining the highest standards of excellence.",
                      "values" -> object : [
                        "Innovation and Creativity",
                        "Customer Success",
                        "Integrity and Trust",
                        "Collaborative Spirit",
                        "Continuous Learning"
                      ],
                      "culture"-> str : "We foster an inclusive, dynamic environment where creativity thrives and every team member is empowered to make a difference.
                    }
                  NOTE: Reply only with this JSON object. No preface or additional information is needed. Start with { and end with }.
                """],
)


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    print(f"Searching for: {query}")
    if not query:
        return jsonify({'error': 'Query is required'}), 400

    results = web_agent.run(f"Tell me about {query}. Their Mission statement, their values, and their culture. Search the web for more information.")
    
    agent_responses = []

    # Ensure we parse the results correctly
    for message in results.messages:
        #print(f"Message From: {message.role}")
        if message.role == "assistant":
            #return jsonify({'result': message.content})
            agent_responses.append(message.content)
    if agent_responses:
        print(f"Search Response Complete")
        return jsonify({'result': agent_responses})
    else:
        return jsonify({'error': 'No results found'}),

@app.route('/format', methods=['GET'])
def format(query=None, depth=0):
    query = request.args.get('query')
    #print(f"Formatting: {query}")
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    results = formatter_agent.run(f"""Format the following: {query}. missionStatement:str, values:object, culture:str. Only reply back with the formatted JSON object. No preface or additional information is needed.""")
    agent_responses = []
    # Ensure we parse the results correctly
    for message in results.messages:
        #print(f"Message From: {message.role}")
        if message.role == "assistant":
            #return jsonify({'result': message.content})
            agent_responses.append(message.content)

    # For message in agent_responses, make sure atleast one of the values contains a valid JSON object
    for message in agent_responses:
        try:
            json_object = json.loads(message)
            if isinstance(json_object, dict) and all(k in json_object for k in ("missionStatement", "values", "culture")):
                # If the JSON object is valid, return it
                return jsonify({'result': json_object})
        except:
            print(f"Invalid JSON, not formatted correctly: {message}")
            # Call format function recursively to try and format the response again
            response = format(query=message)
            return response

            




    if agent_responses:
        print(f"❤️ Formatted Response: {agent_responses}")
        return jsonify({'result': agent_responses})
    else:
        return jsonify({'error': 'No results found'}),


if __name__ == '__main__':
    app.run(debug=True)
    #pass
