import React, { useState, useEffect, useRef } from "react";

// 📅🚀 ChatApp Component with Single User
const ChatApp = () => {
  const [messages, setMessages] = useState([]); // 🌟 Store all messages
  const [inputMessage, setInputMessage] = useState(""); // 🛠️ Input for sending message
  const socketRef = useRef(null); // 🔄 WebSocket reference

  // 🚀 On component mount, set up WebSocket connection
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080"); // Replace with your WebSocket server URL

    // 🛠️ Handle receiving messages from WebSocket
    socketRef.current.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Append new message to chat
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  // 🛠️ Function to send message to backend (WebSocket)
  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = `User: ${inputMessage}`;
      socketRef.current.send(message); // Send message to WebSocket server
      setMessages((prevMessages) => [...prevMessages, message]); // Update the message list locally
      setInputMessage(""); // Clear the input field
    }
  };

  return (
    <div className="h-[90%] flex flex-col bg-blue-100">
      {/* 🌟 Chat Window (Single Screen for User 1) */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-1 bg-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-700">Chat Screen</h2>
          <div className="mt-4 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white p-2 rounded-md w-max self-start"
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔄 Input Section at the Bottom */}
      <div className="p-4 bg-white flex justify-center items-center">
        {/* ✏️ Input for Sending Messages */}
        <div className="flex items-center flex-1 max-w-xl">
          <input
            type="text"
            className="flex-1 border border-gray-400 p-2 rounded-md"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-blue-500 text-white p-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;