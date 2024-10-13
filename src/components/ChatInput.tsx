import React, { FC } from "react";
import { Sheet, Textarea, Button } from "@mui/joy";
import { Send } from "@mui/icons-material";
import VadTest from "./VadTest";

interface ChatInputProps {
    messageContent: string;
    setMessageContent: (content: string) => void;
    handleSendMessage: () => void;
}

const ChatInput: FC<ChatInputProps> = React.memo(
    ({ messageContent, setMessageContent, handleSendMessage }) => (
        <Sheet sx={{ display: "flex", p: 1 }}>
            <Textarea
                variant="soft"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                sx={{ flex: 1, mr: 1 }}
            />
            <VadTest
                onTranscribe={(message, audioURL) =>
                    console.log(message, audioURL)
                }
            />
            <Button
                onClick={handleSendMessage}
                color="primary"
                variant="plain"
            >
                <Send />
            </Button>
        </Sheet>
    )
);

export default ChatInput;