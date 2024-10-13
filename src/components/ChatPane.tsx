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
import ChatAPI, { Chat,  User } from "../store/ChatAPI";
import SliderWithInput from "./SliderWithInput";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import STTForm from "./Settings/STTForm";
import LLMForm from "./Settings/LLMForm";
import AsteriskForm from "./Settings/AsteriskForm";

interface Settings {
    whisper_beam_size: number;
    whisper_beam_size_enabled: boolean;
    whisper_best_of: number;
    whisper_best_of_enabled: boolean;
    whisper_patience: number;
    whisper_patience_enabled: boolean;
    whisper_no_speech_threshold: number;
    whisper_no_speech_threshold_enabled: boolean;
    whisper_temperature: number;
    whisper_temperature_enabled: boolean;
    whisper_hallucination_silence_threshold: number;
    whisper_hallucination_silence_threshold_enabled: boolean;
    llm_system_prompt: string;
    llm_system_prompt_enabled: boolean;
    llm_mirostat: number;
    llm_mirostat_enabled: boolean;
    llm_mirostat_eta: number;
    llm_mirostat_eta_enabled: boolean;
    llm_mirostat_tau: number;
    llm_mirostat_tau_enabled: boolean;
    llm_num_ctx: number;
    llm_num_ctx_enabled: boolean;
    llm_repeat_last_n: number;
    llm_repeat_last_n_enabled: boolean;
    llm_repeat_penalty: number;
    llm_repeat_penalty_enabled: boolean;
    llm_temperature: number;
    llm_temperature_enabled: boolean;
    llm_tfs_z: number;
    llm_tfs_z_enabled: boolean;
    llm_num_predict: number;
    llm_num_predict_enabled: boolean;
    llm_top_k: number;
    llm_top_k_enabled: boolean;
    llm_top_p: number;
    llm_top_p_enabled: boolean;
    llm_min_p: number;
    llm_min_p_enabled: boolean;
    asterisk_min_audio_length: number;
    asterisk_min_audio_length_enabled: boolean;
    asterisk_silence_threshold: number;
    asterisk_silence_threshold_enabled: boolean;
    asterisk_host: string;
    asterisk_host_enabled: boolean;
    asterisk_number: string;
    asterisk_number_enabled: boolean;
    model: string;
    model_enabled: boolean;
}

const ChatApp: FC = () => {
    const [defaultUser, setDefaultUser] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageContent, setMessageContent] = useState<string>("");
    const [currentChatId, setCurrentChatId] = useState<string>("");
    const [settings, setSettings] = useState<Settings>({
        whisper_beam_size: 1,
        whisper_beam_size_enabled: true,
        whisper_best_of: 1,
        whisper_best_of_enabled: true,
        whisper_patience: 1,
        whisper_patience_enabled: true,
        whisper_no_speech_threshold: 1,
        whisper_no_speech_threshold_enabled: true,
        whisper_temperature: 1,
        whisper_temperature_enabled: true,
        whisper_hallucination_silence_threshold: 1,
        whisper_hallucination_silence_threshold_enabled: true,
        llm_system_prompt: "",
        llm_system_prompt_enabled: true,
        llm_mirostat: 1,
        llm_mirostat_enabled: true,
        llm_mirostat_eta: 0.2,
        llm_mirostat_eta_enabled: true,
        llm_mirostat_tau: 0.2,
        llm_mirostat_tau_enabled: true,
        llm_num_ctx: 4096,
        llm_num_ctx_enabled: true,
        llm_repeat_last_n: 64,
        llm_repeat_last_n_enabled: true,
        llm_repeat_penalty: 1.2,
        llm_repeat_penalty_enabled: true,
        llm_temperature: 0.7,
        llm_temperature_enabled: true,
        llm_tfs_z: 0.1,
        llm_tfs_z_enabled: true,
        llm_num_predict: 60,
        llm_num_predict_enabled: true,
        llm_top_k: 50,
        llm_top_k_enabled: true,
        llm_top_p: 0.85,
        llm_top_p_enabled: true,
        llm_min_p: 0.05,
        llm_min_p_enabled: true,
        asterisk_min_audio_length: 0.5,
        asterisk_min_audio_length_enabled: true,
        asterisk_silence_threshold: 5,
        asterisk_silence_threshold_enabled: true,
        asterisk_host: "",
        asterisk_host_enabled: true,
        asterisk_number: "",
        asterisk_number_enabled: true,
        model: "gemma2:9b",
        model_enabled: true,
    });

    // Initialize API Client
    const apiClient = new ChatAPI("http://localhost:8009");

    // Load default user and chats on mount
    useEffect(() => {
        const loadDefaultUser = async () => {
            try {
                const users = await apiClient.listUsers();
                const user =
                    users.find((u) => u.email === "default@example.com") ||
                    null;
                setDefaultUser(user);
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
                    { content: settings.llm_system_prompt, role: "system" },
                    ...msgs.map(({ content, sender }) => ({
                        content,
                        role: sender,
                    })),
                ];

                // Extract only enabled settings
                const ollamaSettings: Record<string, number | string> = {};

                Object.keys(settings).forEach((key) => {
                    if (key.endsWith("_enabled") && (settings as any)[key]) {
                        const settingKey = key.replace("_enabled", "");
                        if (
                            settingKey !== "model" &&
                            (settings as any)[settingKey] !== undefined
                        ) {
                            const skey = settingKey.replace(/^llm_/, "");
                            ollamaSettings[skey] =
                                (settings as any)[settingKey];
                        }
                    }
                });

                console.log("Enabled Settings:", ollamaSettings);
                console.log("Selected Model:", settings.model);

                const response = await fetch(
                    "http://82.200.169.182:11434/api/chat",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: settings.model,
                            messages: userMessages,
                            stream: false,
                            options: ollamaSettings,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch from API");
                }

                const assistantResponse = await response.json();
                console.log("Assistant Response:", assistantResponse);

                const newMessage = await apiClient.sendMessage(
                    currentChatId,
                    "LLM",
                    assistantResponse.message.content
                );
                setMessages((prev) => [...prev, newMessage]);
            } catch (error) {
                console.error("Failed to generate response:", error);
            }
        },
        [currentChatId, settings, apiClient]
    );

    const handleSendMessage = useCallback(async () => {
        if (!currentChatId.trim() || !messageContent.trim()) return;

        try {
            const newMessage = await apiClient.sendMessage(
                currentChatId,
                "User",
                messageContent.trim()
            );
            setMessages((prev) => [...prev, newMessage]);
            setMessageContent("");
            await handleGeneration([...messages, newMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [currentChatId, messageContent, messages, apiClient, handleGeneration]);

    

    const handleAddChat = useCallback(async () => {
        if (!defaultUser) return;

        try {
            const chat = await apiClient.startChat(defaultUser.id);
            setChats((prev) => [...prev, chat]);
            setCurrentChatId(chat.id);
            setMessages([]);
        } catch (error) {
            console.error("Failed to add chat:", error);
        }
    }, []);
    const loadSettings = async (chatId: string) => {
            try {
                const chat = await apiClient.getChat(chatId);
                console.log("Settings:", chat.settings);
                if (chat.settings) {
                    setSettings(chat.settings);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        }
        
    

    const loadMessages =  async (chatId: string) => {
            try {
                const fetchedMessages = await apiClient.getMessages(chatId);
                setMessages(fetchedMessages);
                await loadSettings(chatId);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        }
        
       
  

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
        [chats, currentChatId]
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
                await handleUpdateChat(chatID, { settings });
            } catch (error) {
                console.error("Failed to save settings:", error);
            }
        },
        [handleUpdateChat, settings]
    );

  
    const handleSettingsChange = useCallback(
        (name: string, value: number | string | boolean) => {
            setSettings((prev) => ({
                ...prev,
                [name]: value,
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
                        <Tab>TTS</Tab>
                        <Tab>LLM</Tab>
                        <Tab>CON</Tab>
                        <Tab>RAG</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <STTForm
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                        />
                    </TabPanel>
                    <TabPanel value={2}>
                        <LLMForm
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                        />
                    </TabPanel>
                    <TabPanel value={3}>
                        <AsteriskForm
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                        />
                    </TabPanel>
                </Tabs>
            </Sheet>
        </Box>
    );
};

export default React.memo(ChatApp);