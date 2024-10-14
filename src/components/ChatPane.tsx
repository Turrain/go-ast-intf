import React, { useState, useEffect, useCallback, FC } from "react";
import {
    Box,
    Sheet,
    Button,
    List,
    ListItem,
    ListItemButton,
    IconButton,
    Typography,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Stack,
} from "@mui/joy";
import { Delete } from "@mui/icons-material";
import ChatAPI, { Chat, User, Sender, Message, LLMSettings, STTSettings } from "../store/ChatAPI";
import SliderWithInput from "./SliderWithInput";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import STTForm from "./Settings/STTForm";
import LLMForm from "./Settings/LLMForm";
import AsteriskForm from "./Settings/AsteriskForm";
import OllamaAPI from "../store/OllamaAPI";

interface Settings {
    sttSettings: STTSettings;
    llmSettings: LLMSettings;
    ttsSettings: {};
    // Add other global settings if necessary
}

const ChatApp: FC = () => {
    const [defaultUser, setDefaultUser] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState<string>("");
    const [currentChatId, setCurrentChatId] = useState<string>("");
    const [settings, setSettings] = useState<any>({
        sttSettings: {},
        llmSettings: {},
        ttsSettings: {},
        // Initialize other settings as needed
    });
    
    // Initialize API Client
    const apiClient = new ChatAPI("http://localhost:8009/api");
    const ollamaClient = new OllamaAPI("http://localhost:8009/api");

    // Load default user and chats on mount
    useEffect(() => {
        const loadDefaultUser = async () => {
            try {
                const users = await apiClient.listUsers();
                console.log(users);

                const user = users.find((u) => u.email === "default@example.com") || null;
                console.log("User:", user);
                setDefaultUser(user);
                console.log("Default user:", user);
            } catch (error) {
                console.error("Failed to load default user:", error);
            }
        };

        const loadChats = async () => {
            try {
                const fetchedChats = await apiClient.listChats();
                setChats(fetchedChats);

                if (fetchedChats.length > 0) {
                    const firstChatId = fetchedChats[0].id;
                    setCurrentChatId(firstChatId);
                    await loadMessages(firstChatId);
                }
            } catch (error) {
                console.error("Failed to load chats:", error);
            }
        };

        loadDefaultUser();
        loadChats();
    }, []);

    const handleGeneration = useCallback(
        async (msgs: Message[]) => {
            try {
                const userMessages = [
                    { content: settings.llmSettings.system_prompt || "", role: "system" as Sender },
                    ...msgs.map(({ content, role }) => ({
                        content,
                        role,
                    })),
                ];

                // Extract only enabled settings
                const ollamaSettings: Record<string, number | string> = {};

                Object.keys(settings.llmSettings).forEach((key) => {
                    if (key.endsWith("_enabled") && (settings.llmSettings as any)[key]) {
                        const settingKey = key.replace("_enabled", "");
                        if ((settings.llmSettings as any)[settingKey] !== undefined) {
                            ollamaSettings[settingKey] = (settings.llmSettings as any)[settingKey];
                        }
                    }
                });

                console.log("Enabled Settings:", ollamaSettings);
                console.log("Selected Model:", settings.llmSettings.model || "default-model");

                const response = await ollamaClient.chat({
                    model: settings.llmSettings.model || "gemma2:9b",
                    messages: userMessages,
                    stream: false,
                    options: ollamaSettings,
                });

                console.log("Response from Ollama Client:", response);
                const assistantResponse = {
                    model: response.model,
                    created_at: response.created_at,
                    message: response.message,
                    done_reason: response.done_reason,
                    done: response.done,
                    total_duration: response.total_duration,
                    load_duration: response.load_duration,
                    prompt_eval_count: response.prompt_eval_count,
                    prompt_eval_duration: response.prompt_eval_duration,
                    eval_count: response.eval_count,
                    eval_duration: response.eval_duration
                };
                console.log("Assistant Response:", assistantResponse);

                const newMessage = await apiClient.sendMessage(
                    currentChatId,
                    Sender.Assistant,
                    assistantResponse.message.content
                );
                setMessages((prev) => [...prev, newMessage]);
            } catch (error) {
                console.error("Failed to generate response:", error);
            }
        },
        [currentChatId, settings, ollamaClient]
    );

    const handleSendMessage = useCallback(async () => {
        if (!currentChatId.trim() || !messageContent.trim()) return;

        try {
            const newMessage = await apiClient.sendMessage(
                currentChatId,
                Sender.User,
                messageContent.trim()
            );
            setMessages((prev) => [...prev, newMessage]);
            setMessageContent("");
            await handleGeneration([...messages, newMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [currentChatId, messageContent, messages, handleGeneration]);

    const handleAddChat = useCallback(async () => {
        console.log("Adding chat");
        console.log("Default user:", defaultUser);
        if (!defaultUser) return;

        try {
            const chat = await apiClient.startChat(defaultUser.id);
            console.log(chat);
            setChats((prev) => [...prev, chat]);
            setCurrentChatId(chat.id);
            setMessages([]);
        } catch (error) {
            console.error("Failed to add chat:", error);
        }
    }, [defaultUser]);

    const loadSettings = async (chatId: string) => {
        try {
            const chat = await apiClient.getChat(chatId);
            console.log("Settings:", chat.settings);
            if (chat.settings) {
                setSettings({
                    sttSettings: chat.sttSettings || {},
                    llmSettings: chat.llmSettings || {},
                    ttsSettings: chat.ttsSettings || {},
                });
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    };

    const loadMessages = async (chatId: string) => {
        try {
            const fetchedMessages = await apiClient.getMessages(chatId);
            setMessages(fetchedMessages);
            await loadSettings(chatId);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const handleDeleteChat = useCallback(
        async (chatId: string) => {
            try {
                await apiClient.deleteChat(chatId);
                setChats((prev) =>
                    prev.filter((chat) => chat.id !== chatId)
                );

                if (currentChatId === chatId) {
                    if (chats.length > 1) {
                        const newCurrentChat = chats.find(
                            (chat) => chat.id !== chatId
                        );
                        if (newCurrentChat) {
                            setCurrentChatId(newCurrentChat.id);
                            await loadMessages(newCurrentChat.id);
                        }
                    } else {
                        setCurrentChatId("");
                        setMessages([]);
                    }
                }
            } catch (error) {
                console.error("Failed to delete chat:", error);
            }
        },
        [ chats, currentChatId]
    );

    const handleUpdateChat = useCallback(
        async (chatId: string, data: Partial<Chat>) => {
            try {
                const updatedChat = await apiClient.updateChat(chatId, data);
                setChats((prev) =>
                    prev.map((chat) =>
                        chat.id === chatId ? updatedChat : chat
                    )
                );
            } catch (error) {
                console.error("Failed to update chat:", error);
            }
        },
        []
    );

    const saveSettingsChat = useCallback(
        async (chatID: string) => {
            try {
                console.log(settings);
                await handleUpdateChat(chatID, {
                    sttSettings: settings.sttSettings,
                    llmSettings: settings.llmSettings,
                    ttsSettings: settings.ttsSettings,
                });
            } catch (error) {
                console.error("Failed to save settings:", error);
            }
        },
        [handleUpdateChat, settings]
    );

    const handleSettingsChange = useCallback(
        (category: keyof Settings, name: string, value: number | string | boolean) => {
            setSettings((prev) => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [name]: value,
                },
            }));
        },
        []
    );

    return (
        <Box
            display="flex"
            height="100vh"
            sx={{
                scrollSnapType: "x mandatory",
                overflowX: "auto",
                scrollBehavior: "smooth",
            }}
        >
            {/* Sidebar for switching between sessions */}
            <Sheet
                sx={{
                    p: 2,
                    scrollSnapAlign: "start",
                    width: "250px",
                    minWidth: { xs: "100vw", md: "250px" },
                }}
            >
                <Button
                    onClick={handleAddChat}
                    variant="solid"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    New Chat
                </Button>
                <List>
                    {chats.map((session) => (
                        <ListItem
                            key={session.id}
                            component="li"
                            sx={{
                                borderRadius: "8px",
                                mb: 1,
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "grey.100",
                                },
                            }}
                        >
                            <ListItemButton
                                onClick={() => {
                                    setCurrentChatId(session.id);
                                    loadMessages(session.id);
                                }}
                            >
                                <Stack gap={0}>
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            fontSize: "8px",
                                        }}
                                    >
                                        {session.id}
                                    </Typography>
                                    <Typography>
                                        {`Chat ${session.title}`}
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                            <IconButton
                                onClick={() => handleDeleteChat(session.id)}
                                color="error"
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Sheet>

            {/* Chat window */}
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                sx={{
                    scrollSnapAlign: "start",
                    minWidth: { xs: "100vw", md: "250px" },
                }}
            >
                <Box
                    flex={1}
                    p={2}
                    overflow="auto"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                    </Box>
                </Box>

                {/* Input box for the current chat session */}
                <ChatInput
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    handleSendMessage={handleSendMessage}
                />
            </Box>

            {/* Settings Sidebar */}
            <Sheet
                sx={{
                    height: "100vh",
                    width: "350px",
                    scrollSnapAlign: "start",
                    minWidth: { xs: "100vw", md: "350px" },
                    p: 2,
                }}
            >
                <Button
                    onClick={() => saveSettingsChat(currentChatId)}
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
                        {/* Add more tabs if necessary */}
                    </TabList>
                    <TabPanel value={0}>
                        <STTForm
                            settings={settings.sttSettings}
                            onSettingsChange={(name, value) => handleSettingsChange('sttSettings', name, value)}
                        />
                    </TabPanel>
                    <TabPanel value={1}>
                        <LLMForm
                            settings={settings.llmSettings}
                            onSettingsChange={(name, value) => handleSettingsChange('llmSettings', name, value)}
                        />
                    </TabPanel>
                    <TabPanel value={2}>
                        <AsteriskForm
                            settings={settings.ttsSettings}
                            onSettingsChange={(name, value) => handleSettingsChange('ttsSettings', name, value)}
                            chatId={currentChatId}
                        />
                    </TabPanel>
                </Tabs>
            </Sheet>
        </Box>
    );
};

export default React.memo(ChatApp);