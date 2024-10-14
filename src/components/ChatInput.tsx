import React, { FC } from "react";
import { Box, Input, Button } from "@mui/joy";

interface ChatInputProps {
    messageContent: string;
    setMessageContent: (content: string) => void;
    handleSendMessage: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ messageContent, setMessageContent, handleSendMessage }) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                p: 2,
                borderTop: "1px solid #ccc",
            }}
        >
            <Input
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                multiline
            />
            <Button onClick={handleSendMessage} variant="solid">
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;