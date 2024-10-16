import React, { useState, FC, FormEvent } from 'react';
import { Box, Textarea, Button, Stack, IconButton } from '@mui/joy';
import { Clear, Send } from '@mui/icons-material';

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
        <Box component="form" onSubmit={handleSubmit} sx={{ px: {xs: 2 , lg: 12, } }}>
            <Stack direction="row" sx={{ alignItems: 'center', mb: 2, gap: 2 }}>
           
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    minRows={1}
                    maxRows={6}
                    variant="plain"
                    fullWidth
                    sx={{ flex: 1, borderRadius: '18px', backgroundColor: 'background.surface' }}

                />
                <Button type="submit" variant="solid" sx={{ p: 0, m: 0, px: 1, borderRadius: '50%' }} >
                    <Send fontSize="small" />
                </Button>
            </Stack>

        </Box>
    );
};

export default ChatInput;