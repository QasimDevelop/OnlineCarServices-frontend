// Dialogflow Configuration
export const DIALOGFLOW_CONFIG = {
  // Base URL for Dialogflow API
  BASE_URL: "https://dialogflow.googleapis.com/v2",
  
  // Project ID from your curl command
  PROJECT_ID: "onlinecarservices-379bb",
  
  // Session ID (you can generate this dynamically or use a fixed one)
  SESSION_ID: "e72feb28-f3e9-73b3-48ea-2dfb8a489091",
  
  // Access Token from your curl command
  ACCESS_TOKEN: "ya29.a0AS3H6NwoQryOw2CL4fVj8HuC0PdkcWPC05908a8F5zx-F2Sg8fOWvdpuLHNYXDOcqjwJniSXk3A7qbMnU7HK7gBVVgILOu_DgRJuYQ7cMIIvKY3kYLWivVf8rJtQubZ-38EqksNR7ZoonoCe_39IKqpqg0ThjvJw0PMol7tFquT3zKWkqiAQaqBnReTwWRuL6_iWs8zlutg0AsWQTLLkSHGBFO0PC35JLwxtAOpxMhRVAexKGAciKLsZGZYVpt1ujvZj-y447dMyfPYtqR1VSlYjBk_w6xSSN2XVzN7CGBZXERBRdLvjXFHOcr7dskQVXm7KV22DDnv55l0aCgYKAQ0SARUSFQHGX2Mi6DI7_CNlokiuZZJ_C1WWpQ0342",
  
  // Language code
  LANGUAGE_CODE: "en",
  
  // Timezone
  TIMEZONE: "Asia/Karachi",
  
  // Get the full detect intent URL
  getDetectIntentUrl: () => {
    return `${DIALOGFLOW_CONFIG.BASE_URL}/projects/${DIALOGFLOW_CONFIG.PROJECT_ID}/agent/sessions/${DIALOGFLOW_CONFIG.SESSION_ID}:detectIntent`;
  },
  
  // Get headers for API requests
  getHeaders: () => {
    return {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${DIALOGFLOW_CONFIG.ACCESS_TOKEN}`,
    };
  },
  
  // Get request body template
  getRequestBody: (message) => {
    return {
      queryInput: {
        text: {
          text: message,
          languageCode: DIALOGFLOW_CONFIG.LANGUAGE_CODE,
        },
      },
      queryParams: {
        source: "DIALOGFLOW_CONSOLE",
        timeZone: DIALOGFLOW_CONFIG.TIMEZONE,
      },
    };
  },
};

export default DIALOGFLOW_CONFIG; 