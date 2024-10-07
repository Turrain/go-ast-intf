import React, { useState, useEffect } from "react";
import useChatStore from "../store/ChatStore";

import {
    Avatar,
    Box,
    Button,
    Input,
    List,
    ListItem,
    ListItemButton,
    Stack,
    TextField,
    Typography,
} from "@mui/joy";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
const ChatApp = () => {
    const {
        sessions,
        currentSessionId,
        addSession,
        setInput,
        sendMessage,
        switchSession,
        loading,
    } = useChatStore();

    const currentSession = sessions.find(session => session.id === currentSessionId);

    useEffect(() => {
        if (sessions.length === 0) {
            addSession(); // Create an initial session on mount if none exists
        }
    }, [sessions, addSession]);

    const handleSendMessage = () => {
        if (currentSession?.input.trim()) {
            sendMessage(currentSession.input);
        }
    };

    const handleNewChat = () => {
        addSession();
    };

    return (
        <Box display="flex" height="100vh">
            {/* Sidebar for switching between sessions */}
            <Box width="200px" p={2} borderRight="1px solid #ccc">
            <Button onClick={handleNewChat} variant="solid" fullWidth>
                    New Chat
                </Button>
                <List>
                    {sessions.map((session) => (
                        <ListItem
                            key={session.id}
                            onClick={() => switchSession(session.id)}
                            component="li"
                            sx={{ backgroundColor: session.id === currentSessionId ? 'background.surface' : 'inherit' }}
                        >
                            <ListItemButton>
                                <Typography  > {`Chat ${session.title}`} </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
               
            </Box>

            {/* Chat window */}

            <Box flex={1} p={1} display="flex" flexDirection="column">



                <Box flex={1} p={2} overflow="auto" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {currentSession?.messages.map((message) => (

                            <Box key={message.id} mb={2} sx={{ alignSelf: message.role === "user" ? "end" : "start" }}>
                                <Typography level="body-md">
                                    {message.role === "user" ? "You" : "Assistant"}:
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor: message.role === "user" ? "rgb(43,43,43)" : "rgb(43,43,43)",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        minWidth: 'fit-content',
                                        maxWidth: "60%",
                                        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                                        color: "#FFF",
                                    }}
                                >
                                    <Typography level="body-md">
                                        <Markdown components={{
                                            code(props) {
                                                const { children, className, node, ...rest } = props
                                                const match = /language-(\w+)/.exec(className || '')
                                                return match ? (
                                                    <SyntaxHighlighter
                                                        {...rest}
                                                        PreTag="div"
                                                        children={String(children).replace(/\n$/, '')}
                                                        language={match[1]}
                                                        style={darcula}
                                                    />
                                                ) : (
                                                    <code {...rest} className={className}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}>{message.content}</Markdown>

                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Input box for the current chat session */}
                <Box p={2} borderTop="1px solid #ccc" display="flex" alignItems="center">
                    <Input

                        value={currentSession?.input || ""}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={loading}
                        fullWidth
                    />
                    <Button onClick={handleSendMessage} disabled={loading || !currentSession?.input} variant="contained" sx={{ ml: 2 }}>
                        Send
                    </Button>
                </Box>

                {loading && <Typography p={2}>Loading assistant response...</Typography>}
            </Box>
        </Box>
    );
};

export default ChatApp;