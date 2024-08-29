'use client'
import {Box, Stack, Button, TextField} from '@mui/material'
import {useState} from 'react'

const colors = {
  deepGreen: '#4CAF50',
  darkerGreen: '#2C6B2F',
  lightBeige: '#F5F5F5',
  mediumBrown: '#A1887F',
  textOnLightBackground: '#333333'
};

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi!, I'm the Plantify Support Agent, how can I assist you today?`
    }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return; 
    
    const userMessage = message;
    setMessage('');
    
    setMessages((messages) => [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: ' ' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: colors.lightBeige, // Background color
        padding: '16px'
      }}
    >  
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border={`1px solid ${colors.mediumBrown}`} // Border color
        p={2}
        spacing={3}
      >
        <Stack 
          direction="column" 
          spacing={2}
          flexGrow={1} 
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? colors.deepGreen
                    : colors.mediumBrown
                }
                color={colors.textOnLightBackground}
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="Message" 
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: colors.textOnLightBackground
              },
              '& .MuiFormLabel-root': {
                color: colors.textOnLightBackground
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              backgroundColor: colors.deepGreen,
              color: colors.textOnLightBackground,
              border: `1px solid ${colors.deepGreen}`,
              '&:hover': {
                backgroundColor: colors.darkerGreen
              }
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
