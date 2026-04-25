import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function ChatBotLoading({ isLoading }) {
  if (!isLoading) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, my: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 0.6, 
        bgcolor: '#FFFFFF', 
        p: '10px 16px', 
        borderRadius: '16px 16px 16px 4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4] 
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            style={{
              width: 6,
              height: 6,
              backgroundColor: '#1967D2',
              borderRadius: '50%',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ChatBotLoading;