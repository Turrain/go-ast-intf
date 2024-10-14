import React, { useState, FC, FormEvent } from 'react';
import { Box, Textarea, Button } from '@mui/joy';

interface ChatInputProps {
    onSend: (content: string) => Promise<void>;
}

const ChatInput: FC<ChatInputProps> = ({ onSend }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (content.trim() === '') return;
        await onSend(content.trim());
        setContent('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                minRows={2}
                maxRows={6}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="solid" fullWidth>
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;