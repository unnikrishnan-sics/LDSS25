import React from "react";
import ReactMarkdown from "react-markdown";

import { Box, Paper } from "@mui/material"; 

function ChatBotHistory({ chatHistory }) {
  return (
    <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}> 
      {chatHistory.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: message.type === "user" ? "flex-end" : "flex-start",
            width: '100%',
          }}
        >
          <Paper
            elevation={0} 
            sx={{
              p: 2, 
              borderRadius: message.type === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", 
              maxWidth: "85%", 
              wordBreak: "break-word",
              background: message.type === "user" 
                ? "linear-gradient(135deg, #1967D2 0%, #1565C0 100%)" 
                : "#FFFFFF",
              color: message.type === "user" ? "white" : "#333333",
              boxShadow: message.type === "user"
                ? "0 4px 12px rgba(25, 103, 210, 0.2)"
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: message.type === "user" ? "none" : "1px solid rgba(0,0,0,0.05)",
              position: 'relative',
              '& .markdown-body': {
                fontSize: '0.925rem',
                lineHeight: 1.5,
                '& p': { m: 0 },
                '& ul, & ol': { pl: 2, m: 0 },
                '& code': {
                  bgcolor: message.type === "user" ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                  px: 0.5,
                  borderRadius: 1,
                  fontFamily: 'monospace'
                }
              }
            }}
          >
            <Box className="markdown-body">
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

export default ChatBotHistory;