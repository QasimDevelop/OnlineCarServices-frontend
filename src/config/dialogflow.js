// Dialogflow configuration using environment variables
const DIALOGFLOW_CONFIG = {
  URL: import.meta.env.VITE_DIALOGFLOW_URL,
  TOKEN: import.meta.env.VITE_DIALOGFLOW_TOKEN,
  LANGUAGE_CODE: "en",
  TIMEZONE: "Asia/Karachi",
  getHeaders() {
    return {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${this.TOKEN}`,
    };
  },
  getRequestBody(message) {
    return {
      queryInput: {
        text: {
          text: message,
          languageCode: this.LANGUAGE_CODE,
        },
      },
      queryParams: {
        source: "DIALOGFLOW_CONSOLE",
        timeZone: this.TIMEZONE,
      },
    };
  },
};

export default DIALOGFLOW_CONFIG; 