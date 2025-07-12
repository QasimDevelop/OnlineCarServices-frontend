import {
    SmartToy as BotIcon,
    Chat as ChatIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    Send as SendIcon,
  } from "@mui/icons-material";
  import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useRef, useState } from "react";
  
  // Dialogflow configuration
  const DIALOGFLOW_URL = import.meta.env.VITE_DIALOGFLOW_URL;
  const DIALOGFLOW_TOKEN = import.meta.env.VITE_DIALOGFLOW_TOKEN;

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
        const response = await fetch(DIALOGFLOW_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${DIALOGFLOW_TOKEN}`,
          },
          body: JSON.stringify({
            queryInput: {
              text: {
                text: message,
                languageCode: "en",
              },
            },
            queryParams: {
              source: "DIALOGFLOW_CONSOLE",
              timeZone: "Asia/Karachi",
            },
          }),
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
        {/* Floating Chat Button */}
        {!open && (
          <Fab
            color="primary"
            aria-label="chat"
            onClick={onClose}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <ChatIcon />
          </Fab>
        )}
  
        {/* Chat Dialog */}
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              height: "70vh",
              maxHeight: "600px",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BotIcon />
              <Typography variant="h6">Car Service Assistant</Typography>
            </Box>
            <IconButton onClick={onClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
  
          <DialogContent
            sx={{ flex: 1, p: 0, display: "flex", flexDirection: "column" }}
          >
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            )}
  
            {/* Messages */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              <List sx={{ p: 0 }}>
                {messages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      px: 0,
                      py: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection:
                          message.sender === "user" ? "row-reverse" : "row",
                        alignItems: "flex-end",
                        gap: 1,
                        maxWidth: "80%",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            message.sender === "user"
                              ? "primary.main"
                              : "secondary.main",
                        }}
                      >
                        {message.sender === "user" ? <PersonIcon /> : <BotIcon />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor:
                            message.sender === "user"
                              ? "primary.main"
                              : "grey.100",
                          color:
                            message.sender === "user" ? "white" : "text.primary",
                          borderRadius: 2,
                          maxWidth: "100%",
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            opacity: 0.7,
                            fontSize: "0.7rem",
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                ))}
                {isLoading && (
                  <ListItem sx={{ justifyContent: "flex-start", px: 0, py: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                      >
                        <BotIcon />
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}
                      >
                        <CircularProgress size={16} />
                      </Paper>
                    </Box>
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>
  
            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  size="small"
                  multiline
                  maxRows={3}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  sx={{ alignSelf: "flex-end" }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default Chatbot;
  