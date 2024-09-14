import React, { useState, useEffect } from "react";

// 📅🚀 ChatApp Component with Single User
const ChatApp = () => {
  const [messages, setMessages] = useState([]); // 🌟 Store all messages
  const [inputMessage, setInputMessage] = useState(""); // 🛠️ Input for sending message
  const [socket, setSocket] = useState();
  const [currID, setCurrID] = useState(); // Current user's ID
  const [targetID, setTargetID] = useState(); // Selected client's ID
  const [clients, setClients] = useState([]); // List of clients

  // 🚀 On component mount, set up WebSocket connection
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000");

    newSocket.onopen = () => {
      console.log("Connection established");
    };

    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
      const parsedData = JSON.parse(message.data);
      const { text, id, flag, clients } = parsedData;
      if (flag) {
        const newClients = clients.filter((client) => client.id !== id);
        setCurrID(id);
        setClients(newClients);
    } else {
          console.log({id,text})
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
  }, []);

  // 🛠️ Function to send message to backend (WebSocket)
  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = inputMessage;
      socket.send(JSON.stringify({ targetID, text: message })); // Send message to WebSocket server
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: currID, text: message },
      ]); // Update the message list locally
      setInputMessage(""); // Clear the input field
    }
  };

  // Filter messages based on selected target client
  const filteredMessages = targetID
    ? messages.filter((message) => message.id === targetID)
    : messages;

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
              onClick={() => {
                alert(`target id is : ${client.id} and currID is ${currID}`);
                setTargetID(client.id);
              }}
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
              style={{
                alignSelf: message.id === currID ? "flex-end" : "flex-start",
              }}
            >
              User ID-{message.id} :: {message.text}
            </div>
          ))}
        </div>

        {/* 🔄 Input Section at the Bottom */}
        <div className="mt-4 bg-white flex justify-center items-center p-4">
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
    </div>
  );
};

export default ChatApp;
