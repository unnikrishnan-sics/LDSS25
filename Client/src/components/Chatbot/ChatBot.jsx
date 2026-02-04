import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ChatBotHistory from "./ChatBotHistory";
import ChatBotLoading from "./ChatBotLoading";

function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatHistoryRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const messageToSend = userInput;
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: "user", message: messageToSend },
    ]);
    setUserInput("");

    setIsLoading(true);
    try {
      const result = await model.generateContent(messageToSend);
      const response = await result.response;
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", message: response.text() },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", message: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever chat history or loading state changes
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory, isLoading]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '500px', // Set a minimum height
      }}
    >
      <Card
        raised
        sx={{
          flexGrow: 1,
          borderRadius: 4,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // Ensure card takes full height
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            pb: 1,
            height: '100%', // Ensure CardContent takes full height
            boxSizing: 'border-box', // Include padding in height calculation
          }}
        >
          <Box
            ref={chatHistoryRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              pr: 1,
              mb: 2,
              maxHeight: 'calc(100% - 96px)', // Reserve space for input and buttons
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <ChatBotHistory chatHistory={chatHistory} />
            <ChatBotLoading isLoading={isLoading} />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleUserInput}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              sx={{ borderRadius: 4, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 4 } }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{ borderRadius: 4, backgroundColor: "#1967D2" }}
            >
              Send
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="secondary"
            onClick={clearChat}
            fullWidth
            sx={{ mt: 1.5, borderRadius: 4 }}
          >
            Clear Chat
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChatBot;