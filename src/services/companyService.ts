import type { CompanyInfo } from '../types';

// Mock function to simulate company data retrieval
export async function getCompanyInfo(companyName: string): Promise<CompanyInfo> {
  try {
    // Step 1: Retrieve company data
    console.log(`Fetching company data for: ${companyName}`);
    const searchResponse = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(companyName)}`);
    
    console.log("Search Response Status:", searchResponse.status);
    console.log("Search Response Headers:", searchResponse.headers);
    
    if (!searchResponse.ok) {
      throw new Error(`Failed to retrieve company data: ${searchResponse.statusText}`);
    }

    const companyData = await searchResponse.json();
    console.log("Raw Company Data:", companyData);

    if (!companyData || Object.keys(companyData).length === 0) {
      console.warn("Warning: Retrieved company data is empty.");
    }

    // Step 2: Format company data
    console.log("Formatting company data...");
    const formatResponse = await fetch(`http://localhost:5000/format?query=${encodeURIComponent(JSON.stringify(companyData))}`);

    console.log("Format Response Status:", formatResponse.status);
    console.log("Format Response Headers:", formatResponse.headers);

    if (!formatResponse.ok) {
      throw new Error(`Failed to format company data: ${formatResponse.statusText}`);
    }

    const formattedData = await formatResponse.json();
    console.log("Raw Formatted Data:", formattedData);

    // Step 3: Parse the JSON result
    console.log("Parsing formatted data...");
    let parsedResult: any;

    if (formattedData.result) {
      if (typeof formattedData.result === "object") {
        parsedResult = formattedData.result;
      } else if (typeof formattedData.result === "string") {
        try {
          const resultRegex = /```json\n([\s\S]+?)\n```/;
          const match = formattedData.result.match(resultRegex);

          if (match && match[1]) {
            parsedResult = JSON.parse(match[1]);
          } else {
            parsedResult = JSON.parse(formattedData.result);
          }
        } catch (parsingError) {
          console.error("Parsing error:", parsingError);
          throw new Error("Failed to parse formatted data: " + parsingError);
        }
      } else {
        throw new Error("Unexpected result format: result is neither an object nor a string");
      }
    } else {
      console.error("No 'result' field found in formatted data.");
      throw new Error("No result found in formatted data");
    }

    console.log("Parsed Result:", parsedResult); 
    // ["{\"result\": {\n  \"missionStatement\": \"To be Earth's most customer-centric company, guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and ownership.\",\n  \"values\": [\n    \"Customer obsession\",\n    \"Ownership\",\n    \"Invent and simplify\",\n    \"Hire and nurture the best\",\n    \"Go for the highest standards\",\n    \"Think big\"\n  ],\n  \"culture\": \"A fast-paced and dynamic work environment with a strong emphasis on innovation, customer satisfaction, and building a diverse and inclusive workplace.\"\n}}"]

    // Convert the parsed JSON into the CompanyInfo format
    const companyInfo: CompanyInfo = {
      missionStatement: parsedResult.missionStatement || "",
      values: parsedResult.values || [],
      culture: parsedResult.culture || "",
    };

    console.log("Parsed CompanyInfo:", companyInfo);

    // if missionstatement is an empty string
    if (!companyInfo.missionStatement) {
      console.log("Mission statement is empty. Attempting to parse again...");
      const newCompanyInfo: CompanyInfo = {
        missionStatement: parsedResult.find((item: any) => item.key === "missionStatement")?.value || "",
        values: parsedResult.find((item: any) => item.key === "values")?.value || [],
        culture: parsedResult.find((item: any) => item.key === "culture")?.value || "",
      };
      console.log("New Parsed CompanyInfo (hopefully not blank):", newCompanyInfo);
      return newCompanyInfo;
    }

    // Return the parsed CompanyInfo object
    return companyInfo;
  } catch (error) {
    console.error(`Error in getCompanyInfo: ${error}`);
    throw error;
  }
}
