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
    tabClasses,
} from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { useStore } from "../store/ChatStore";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import STTForm from "./Settings/STTForm";
import LLMForm from "./Settings/LLMForm";
import AsteriskForm from "./Settings/AsteriskForm";
import { Chat } from "../types/types";
import ColorSchemeToggle from "./ColorSchemeToggle";

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
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                gap: 1,
            }}
        >
            <Sheet
                sx={{
                    minWidth: { xs: '100dvw', md: '350px' },
                    width: { xs: '100dvw', md: '350px' },
                    height: '100vh',
                    scrollSnapAlign: 'start',
                  
                    overflowY: 'auto',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ px: 2, display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Button
                        onClick={() => addChat()}
                        fullWidth
                        color="primary"
                        variant="plain"
                        sx={{ mt: 2, mb: 1, backgroundColor: 'background.level1', borderRadius: '18px', boxShadow: 'sm'}}
                    >
                        New Chat
                    </Button>
                    <ColorSchemeToggle sx={{ mt: 2, mb: 1, borderRadius: '50%', px: 1.25, boxShadow: 'sm' }} />
                </Box>

                <List sx={{ px: 2, gap: 1 }}>
                    {chats.map((chat: Chat) => (
                        <ListItem key={chat.id}>
                            <ListItemButton
                                sx={{
                                    backgroundColor: 'background.surface',
                                    borderRadius: '18px',
                                }}
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
            <Stack sx={{
                flex: 1,
                scrollSnapAlign: 'start',
                minWidth: {xs: '100dvw', md: 'unset'},
                width: {xs: '100dvw', md: '100%'},
                px: 4,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        width: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        '&::-webkit-scrollbar': {
                            width: '3px', // Set the scrollbar width
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888', // Set the scrollbar thumb color
                            borderRadius: '10px', // Optional: round the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555', // Change color on hover
                        },
                    }}
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
                    scrollSnapAlign: 'start',
                    width: {xs: '100dvw', md: '350px'},
                    minWidth: {xs: '100dvw', md: '350px'},
                  
                    px: 2,
                }}
            >
                {/* <Button
                    onClick={() => saveSettingsChat(getCurrentChatId(chats))}
                    variant="solid"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Save Settings
                </Button> */}
                <Tabs aria-label="Settings Tabs" size="sm" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
                    <TabList disableUnderline={true} tabFlex="auto" sx={{
                        mt:2,   
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'xl',
                        bgcolor: 'background.level1',
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            boxShadow: 'sm',
            bgcolor: 'background.surface',
          },
        }}>
                        <Tab disableIndicator>STT</Tab>
                        <Tab disableIndicator>LLM</Tab>
                        <Tab disableIndicator>TTS</Tab>
                        <Tab disableIndicator>Asterisk</Tab>
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