import React, { FC } from "react";
import { Box, Typography } from "@mui/joy";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomAudioPlayer from "./CustomAudioPlayer";
interface Message {
    id: string;
    sender: "User" | "LLM";
    content: string;
    audioURL?: string;
}

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: FC<ChatMessageProps> = React.memo(({ message }) => {
    return (
        <Box
            mb={2}
            sx={{
                alignSelf: message.sender === "User" ? "end" : "start",
            }}
        >
            <Typography
                level="body-xs"
                sx={{
                    mb: 0.325,
                    textAlign: message.sender === "User" ? "end" : "start",
                }}
            >
                {message.sender}
            </Typography>
            <Box
                sx={{
                    backgroundColor: "rgb(43,43,43)",
                    borderRadius: "10px",
                    padding: "10px",
                    maxWidth: { xs: "100%", md: "90%" },
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                    color: "#FFF",
                }}
            >
                <Typography level="body-md">
                    <Markdown
                        components={{
                            code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                            }) {
                                const match = /language-(\w+)/.exec(
                                    className || ""
                                );
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        {...props}
                                        language={match[1]}
                                        style={darcula}
                                        PreTag="div"
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code
                                        className={className}
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {message.content}
                    </Markdown>
                    {message.audioURL && (
                        <CustomAudioPlayer src={message.audioURL} />
                    )}
                </Typography>
            </Box>
        </Box>
    );
});

export default ChatMessage;