import React, { useEffect, useCallback, FC } from "react";
import {
    Box,
    Sheet,
    Button,
    List,
    IconButton,
    Typography,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Stack,
    ListItemButton,
    ListItem,
    ListItemContent,
} from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { useStore } from "../store/ChatStore";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import STTForm from "./Settings/STTForm";
import LLMForm from "./Settings/LLMForm";
import AsteriskForm from "./Settings/AsteriskForm";
import { Chat } from "../types/types";

const ChatPane: FC = () => {
    const chats = useStore((state) => state.chats);
    const messages = useStore((state) => state.messages);
    const settings = useStore((state) => state.settings);
    const addChat = useStore((state) => state.addChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const selectChat = useStore((state) => state.selectChat);
    const sendMessage = useStore((state) => state.sendMessage);
    const updateSettings = useStore((state) => state.updateSettings);
    const initialize = useStore((state) => state.initialize);
    const saveSettingsChat = useStore((state) => state.saveSettingsChat);
    const error = useStore((state) => state.error);
    const currentChat = useStore((state) => state.currentChat);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleSendMessage = useCallback(async (content: string) => {
        await sendMessage(content);
    }, [sendMessage]);

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                minHeight: '100vh',
                gap: 1,
            }}
        >
            <Sheet
                sx={{
                    minWidth: '250px',
                    height: '100vh',
                    overflowY: 'auto',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    onClick={() => addChat()}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    New Chat
                </Button>
                <List>
                    {chats.map((chat: Chat) => (
                        <ListItem key={chat.id}>
                            <ListItemButton
                                onClick={() => selectChat(chat.id)}
                                selected={chat.id === currentChat}
                            >
                                <ListItemContent>
                                    <Typography level="body-xs">
                                        {chat.id}
                                    </Typography>
                                </ListItemContent>
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    color="neutral"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Sheet>
            <Stack sx={{ flex: 1, width: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <Box 
                    sx={{ flex: 1, p: 2, width: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
                    ref={(el) => {
                        if (el) {
                            // Ensure el is of type HTMLElement
                            const boxElement = el as HTMLElement;
                            boxElement.scrollTop = boxElement.scrollHeight;
                        }
                    }}
                >
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                </Box>
                <ChatInput
                    onSend={handleSendMessage}
                />
            </Stack>
            <Sheet
                id="Settings"
                sx={{
                    height: "100vh",
                    minWidth: "350px",
                    scrollSnapAlign: "start",
                    p: 2,
                }}
            >
                <Button
                    onClick={() => saveSettingsChat(getCurrentChatId(chats))}
                    variant="solid"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Save Settings
                </Button>
                <Tabs aria-label="Settings Tabs" size="sm" defaultValue={0}>
                    <TabList tabFlex="auto">
                        <Tab>STT</Tab>
                        <Tab>LLM</Tab>
                        <Tab>TTS</Tab>
                        <Tab>Asterisk</Tab>
                        {/* Add more tabs if necessary */}
                    </TabList>
                    <TabPanel value={0}>
                        <STTForm
                            settings={settings.sttSettings}
                            onSettingsChange={(name, value) => updateSettings('sttSettings', name, value)}
                        />
                    </TabPanel>
                    <TabPanel value={1}>
                        <LLMForm
                            settings={settings.llmSettings}
                            onSettingsChange={(name, value) => updateSettings('llmSettings', name, value)}
                        />
                    </TabPanel>
                    {/* <TabPanel value={2}>
                        <TTSForm
                            settings={settings.ttsSettings}
                            onSettingsChange={(name, value) => updateSettings('ttsSettings', name, value)}
                        />
                    </TabPanel> */}
                    <TabPanel value={3}>
                        <AsteriskForm
                            settings={settings.asteriskSettings}
                            onSettingsChange={(name, value) => updateSettings('asteriskSettings', name, value)}
                            chatId={getCurrentChatId(chats)}
                        />
                    </TabPanel>
                </Tabs>
            </Sheet>
        </Box>
    );
};

// Utility function to get the current chat ID
const getCurrentChatId = (chats: Chat[]): string => {
    if (chats.length === 0) return "";
    return chats[0].id;
};

export default React.memo(ChatPane);