import { useEffect, useRef, useState } from "react";
import DIALOGFLOW_CONFIG from "../config/dialogflow";

const Chatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your car service assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToDialogflow = async (message) => {
    try {
      const response = await fetch(DIALOGFLOW_CONFIG.URL, {
        method: "POST",
        headers: DIALOGFLOW_CONFIG.getHeaders(),
        body: JSON.stringify(DIALOGFLOW_CONFIG.getRequestBody(message)),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.queryResult?.fulfillmentText ||
        "I'm sorry, I didn't understand that. Could you please rephrase?"
      );
    } catch (error) {
      console.error("Dialogflow API error:", error);
      throw new Error("Failed to get response from chatbot. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const botResponse = await sendMessageToDialogflow(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setError(error.message);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="w-full h-full flex flex-col bg-white rounded shadow-md overflow-hidden">
        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 p-2 text-sm text-center">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs ${
                    message.sender === "user"
                      ? "bg-blue-600 order-2"
                      : "bg-gray-500 order-1"
                  }`}
                >
                  {message.sender === "user" ? "👤" : "🤖"}
                </div>

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white order-1"
                      : "bg-gray-100 text-gray-800 order-2"
                  }`}
                >
                  <div>{message.text}</div>
                  <div className="text-[0.65rem] text-right opacity-60 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white text-xs">
                  🤖
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="animate-pulse w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <textarea
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
