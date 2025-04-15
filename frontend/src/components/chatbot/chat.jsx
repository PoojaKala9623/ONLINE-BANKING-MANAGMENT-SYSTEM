import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessage = { text: userInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3.2",
        prompt: userInput,
      });

      const jsonStrings = response.data.trim().split("\n");
      const jsonObjects = jsonStrings.map((line) => JSON.parse(line));
      const fullResponse = jsonObjects.map((obj) => obj.response).join("");

      const aiMessage = { text: fullResponse, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Chatbot Button */}
      <button className="chatbot-button" onClick={toggleChat}>
        💬 Chat
      </button>

      {/* Chatbox Popup */}
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chat-header">
            <h2>Chatbot</h2>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && <div className="loading">Typing...</div>}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="input-field"
            />
            <button onClick={sendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
