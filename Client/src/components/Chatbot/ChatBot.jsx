import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import ChatBotHistory from "./ChatBotHistory";
import ChatBotLoading from "./ChatBotLoading";

function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatHistoryRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
        minHeight: '450px',
        background: 'transparent',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          ref={chatHistoryRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            pr: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '10px',
              '&:hover': {
                background: 'rgba(0,0,0,0.2)',
              },
            },
          }}
        >
          {chatHistory.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              opacity: 0.6,
              textAlign: 'center',
              px: 3
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Hello! I'm your LearnHub Assistant. How can I help you today?
              </Typography>
            </Box>
          )}
          <ChatBotHistory chatHistory={chatHistory} />
          <ChatBotLoading isLoading={isLoading} />
        </Box>

        <Box 
          sx={{ 
            display: "flex", 
            gap: 1,
            p: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Ask anything..."
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputProps={{
              disableUnderline: true,
              sx: { 
                px: 2, 
                fontSize: '0.95rem',
                '& input::placeholder': {
                  color: 'text.secondary',
                  opacity: 0.8,
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading || !userInput.trim()}
            sx={{ 
              borderRadius: '18px', 
              minWidth: '45px',
              width: '45px',
              height: '45px',
              p: 0,
              background: 'linear-gradient(135deg, #1967D2 0%, #1565C0 100%)',
              boxShadow: '0 4px 12px rgba(25, 103, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                boxShadow: '0 6px 16px rgba(25, 103, 210, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0,0,0,0.12)',
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
            </svg>
          </Button>
        </Box>

        <Button
          size="small"
          onClick={clearChat}
          sx={{ 
            alignSelf: 'center', 
            textTransform: 'none',
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.7,
            '&:hover': { opacity: 1, bgcolor: 'transparent', textDecoration: 'underline' }
          }}
        >
          Clear conversation
        </Button>
      </Box>
    </Box>
  );
}

export default ChatBot;