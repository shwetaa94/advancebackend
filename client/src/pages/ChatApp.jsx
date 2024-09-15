import React, { useState, useEffect } from "react";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [currID, setCurrID] = useState(null);
  const [targetID, setTargetID] = useState(null);
  const [clients, setClients] = useState([]);

  // 🚀 On component mount, set up WebSocket connection
  useEffect(() => {
    const storedID = localStorage.getItem("clientID");
    const newSocket = new WebSocket("ws://localhost:8000");

    newSocket.onopen = () => {
      console.log("Connection established");
      if (storedID) {
        // Reuse the stored client ID if available
        setCurrID(storedID);
      }
    };

    newSocket.onmessage = (message) => {
      const parsedData = JSON.parse(message.data);
      const { text, id, flag, clients } = parsedData;

      if (flag) {
        // Update the clients list
        setClients(clients);
        // If this client has no stored ID, assign the current ID
        if (!currID) {
          setCurrID(id);
          localStorage.setItem("clientID", id); // Save the ID in localStorage
        }
      } else {
        // Append the message to the list
        setMessages((prevMessages) => [...prevMessages, { id, text }]);
      }
    };

    newSocket.onclose = () => {
      console.log("Connection closed");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [currID]);

  // 🛠️ Function to send message to backend (WebSocket)
  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = inputMessage;
      socket.send(JSON.stringify({ targetID, text: message }));
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: currID, text: message },
      ]);
      setInputMessage("");
    }
  };

  // Filter messages based on selected target client
  // Filter messages based on both the current user's ID and the target ID
const filteredMessages = messages.filter(
    (message) => 
      (message.id === currID && targetID === currID) || // Display current user's messages only when target is self
      (message.id === targetID) // Display target user's messages when selected
  );
  
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-[25%] bg-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-700">Clients</h2>
        <div className="mt-4 space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="text-lg font-bold text-blue-400 cursor-pointer"
              onClick={() => setTargetID(client.id)}
            >
              {client.id}
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Chat Window */}
      <div className="flex-1 bg-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-700">Chat Screen</h2>
        <div className="flex-1 overflow-y-auto mt-4">
          {/* Display all messages */}
          {filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-md w-max ${
                message.id === currID
                  ? "bg-green-500 text-white self-end"
                  : "bg-blue-500 text-white"
              }`}
            >
              User ID-{message.id} :: {message.text}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="mt-4 bg-white flex justify-center items-center p-4">
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
    </div>
  );
};

export default ChatApp;
