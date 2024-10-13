import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    FC,
    ChangeEvent,
} from "react";
import useChatStore from "../store/ChatStore";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemButton,
    Select,
    Sheet,
    Slider,
    Stack,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Textarea,
    Option,
    TextField,
    Typography,
    Switch,
} from "@mui/joy";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    ArrowDropDown,
    Delete,
    Mic,
    Pause,
    PlayArrow,
    Send,
} from "@mui/icons-material";
import VadTest from "./VadTest";
import SelectLLMModel from "./SelectLLMModel";
import ChatAPI, { Chat, Message, User } from "../store/ChatAPI";

const SliderWithInput: FC<SliderWithInputProps> = React.memo(
    ({
        label,
        inputWidth = "110px",
        inputVariant = "plain",
        inputSize = "sm",
        inputType = "number",
        inputStep = 0.01,
        inputName,
        sliderStep = 0.1,
        sliderMarks = true,
        sliderMin = -1,
        sliderMax = 1,
        sliderValueLabelDisplay = "auto",
        stackDirection = "row",
        stackGap = 1,
        value,
        enabled,
        onChange,
        onToggleEnabled,
    }) => {
        const [expanded, setExpanded] = useState<boolean>(false);

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newValue =
                    inputType === "number"
                        ? parseFloat(event.target.value)
                        : event.target.value;
                if (!isNaN(newValue)) {
                    onChange(inputName, newValue);
                }
            },
            [onChange, inputName, inputType]
        );

        const handleSliderChange = useCallback(
            (event: Event, newValue: number | number[]) => {
                if (typeof newValue === "number") {
                    onChange(inputName, newValue);
                }
            },
            [onChange, inputName]
        );

        const toggleExpanded = useCallback(() => {
            setExpanded((prev) => !prev);
        }, []);

        const handleToggleEnabled = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                onToggleEnabled(inputName, event.target.checked);
                toggleExpanded()
            },

            [onToggleEnabled, inputName]
        );

        return (
            <>
                <Stack
                    direction="row"
                    gap={1}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ height: "20px", my: 0.75 }}
                >
                    <Typography level="body-xs">{label}</Typography>
                    <Stack direction="row" gap={0.5} alignItems="center">
                        
                        <Switch
                            checked={enabled}
                            onChange={handleToggleEnabled}
                            size="sm"
                        />
                       
                    </Stack>
                </Stack>
                {expanded && enabled && (
                    <Stack
                        direction={stackDirection}
                        gap={stackGap}
                        sx={{ px: 1, height: "30px" }}
                    >
                        <Input
                            sx={{ width: inputWidth }}
                            variant={inputVariant}
                            size={inputSize}
                            type={inputType}
                            value={value}
                            step={inputStep}
                            name={inputName}
                            onChange={handleInputChange}
                        />
                        <Slider
                            size="sm"
                            aria-label="Slider"
                            value={value}
                            step={sliderStep}
                            marks={sliderMarks}
                            min={sliderMin}
                            max={sliderMax}
                            valueLabelDisplay={sliderValueLabelDisplay}
                            onChange={handleSliderChange}
                        />
                    </Stack>
                )}
            </>
        );
    }
);

// Custom Audio Player Component
interface CustomAudioPlayerProps {
    src: string;
}

const CustomAudioPlayer: FC<CustomAudioPlayerProps> = React.memo(
    ({ src }) => {
        const audioRef = useRef<HTMLAudioElement>(null);
        const [isPlaying, setIsPlaying] = useState<boolean>(false);
        const [currentTime, setCurrentTime] = useState<number>(0);
        const [duration, setDuration] = useState<number>(0);

        const togglePlayPause = useCallback(() => {
            if (!audioRef.current) return;
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying((prev) => !prev);
        }, [isPlaying]);

        const handleTimeUpdate = useCallback(() => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        }, []);

        const handleLoadedMetadata = useCallback(() => {
            if (audioRef.current) {
                setDuration(audioRef.current.duration);
            }
        }, []);

        const handleSliderChange = useCallback(
            (event: Event, newValue: number | number[]) => {
                if (
                    audioRef.current &&
                    typeof newValue === "number"
                ) {
                    audioRef.current.currentTime = newValue;
                    setCurrentTime(newValue);
                }
            },
            []
        );

        return (
            <Stack direction="row" sx={{ px: 1, gap: 1 }}>
                <audio
                    ref={audioRef}
                    src={src}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    style={{ display: "none" }}
                />
                <IconButton onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <Slider
                    sx={{ minWidth: "100px" }}
                    size="sm"
                    variant="solid"
                    value={currentTime}
                    max={duration}
                    onChange={handleSliderChange}
                    aria-labelledby="audio-slider"
                />
            </Stack>
        );
    }
);

// Initialize API Client
const apiClient = new ChatAPI("http://localhost:8009");

// Form Components

interface FormProps {
    settings: Settings;
    onSettingsChange: (name: string, value: number | string) => void;
}

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

const STTForm: FC<FormProps> = ({ settings, onSettingsChange }) => (
    <>
        <Typography color="warning" level="body-sm" fontWeight="bold">
            FASTER-WHISPER-LARGE-V3
        </Typography>
        {[
            "whisper_beam_size",
            "whisper_best_of",
            "whisper_patience",
            "whisper_no_speech_threshold",
            "whisper_temperature",
            "whisper_hallucination_silence_threshold",
        ].map((setting) => (
            <SliderWithInput
                key={setting}
                label={setting.replace("whisper_", "").replace("_", " ")}
                inputName={setting}
                value={settings[setting]}
                enabled={settings[`${setting}_enabled`]}
                sliderMin={1}
                sliderMax={10}
                sliderStep={1}
                onChange={onSettingsChange}
                onToggleEnabled={(name, enabled) =>
                    onSettingsChange(`${name}_enabled`, enabled)
                }
            />
        ))}
    </>
);

const LLMForm: FC<FormProps> = ({ settings, onSettingsChange }) => (
    <form>
        {settings.model}
        <SelectLLMModel selectedModel={settings.model} onModelChange={(val ) => onSettingsChange("model", val)}/>
        <Typography level="body-xs">Системный промпт</Typography>
        <Textarea
            minRows={4}
            size="sm"
            placeholder="Напишите здесь системный промпт"
            variant="outlined"
            value={settings.llm_system_prompt}
            onChange={(e) =>
                onSettingsChange("llm_system_prompt", e.target.value)
            }
        />
        <SliderWithInput
            label="Mirostat"
            inputName="llm_mirostat"
            value={settings.llm_mirostat}
            enabled={settings.llm_mirostat_enabled}
            onChange={onSettingsChange}
            onToggleEnabled={(name, enabled) =>
                onSettingsChange(`${name}_enabled`, enabled)
            }
            sliderMin={0}
            sliderMax={2}
            sliderStep={1}
        />
        <Select
            value={settings.llm_mirostat}
            size="sm"
            onChange={(e) =>
                onSettingsChange("llm_mirostat", parseInt(e.target.value, 10))
            }
        >
            <Option value={0}>Disabled</Option>
            <Option value={1}>Mirostat</Option>
            <Option value={2}>Mirostat 2.0</Option>
        </Select>
        {[
            "llm_mirostat_eta",
            "llm_mirostat_tau",
            "llm_num_ctx",
            "llm_repeat_last_n",
            "llm_repeat_penalty",
            "llm_temperature",
            "llm_tfs_z",
            "llm_num_predict",
            "llm_top_k",
            "llm_top_p",
            "llm_min_p",
        ].map((setting) => (
            <SliderWithInput
                key={setting}
                label={setting.replace("llm_", "").replace("_", " ")}
                inputName={setting}
                value={settings[setting]}
                enabled={settings[`${setting}_enabled`]}
                onChange={onSettingsChange}
                onToggleEnabled={(name, enabled) =>
                    onSettingsChange(`${name}_enabled`, enabled)
                }
            />
        ))}
    </form>
);

const AsteriskForm: FC<FormProps> = ({
    settings,
    onSettingsChange,
}) => (
    <>
        <Typography color="warning" level="body-sm" fontWeight="bold">
            ASTERISK ONLY
        </Typography>
        {["asterisk_min_audio_length", "asterisk_silence_threshold"].map(
            (setting) => (
                <SliderWithInput
                    key={setting}
                    label={setting
                        .replace("asterisk_", "")
                        .replace("_", " ")}
                    inputName={setting}
                    value={settings[setting]}
                    enabled={settings[`${setting}_enabled`]}
                    sliderMin={
                        setting === "asterisk_min_audio_length"
                            ? 0.1
                            : 1
                    }
                    sliderMax={
                        setting === "asterisk_silence_threshold"
                            ? 20
                            : undefined
                    }
                    sliderStep={1}
                    onChange={onSettingsChange}
                    onToggleEnabled={(name, enabled) =>
                        onSettingsChange(`${name}_enabled`, enabled)
                    }
                />
            )
        )}
        <Sheet
            color="primary"
            variant="soft"
            sx={{ p: 1, borderRadius: 2 }}
        >
            <Typography level="body-xs" sx={{ mb: 0.5 }}>
                Asterisk Host
            </Typography>
            <Input
                fullWidth
                size="sm"
                variant="soft"
                sx={{ mb: 1 }}
                placeholder="Enter Asterisk host"
                value={settings.asterisk_host}
                onChange={(e) =>
                    onSettingsChange("asterisk_host", e.target.value)
                }
            />
            <Typography level="body-xs" sx={{ mb: 0.5 }}>
                Number
            </Typography>
            <Input
                sx={{ mb: 1 }}
                variant="soft"
                fullWidth
                size="sm"
                placeholder="Enter number"
                value={settings.asterisk_number}
                onChange={(e) =>
                    onSettingsChange("asterisk_number", e.target.value)
                }
            />
            <Button variant="solid" color="primary" fullWidth>
                Call
            </Button>
        </Sheet>
    </>
);


// Main ChatApp Component
const ChatApp: FC = () => {
    const [defaultUser, setDefaultUser] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
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
    }, [currentChatId, messageContent, messages]);

    const handleGeneration = useCallback(async (msgs: Message[]) => {
        try {
            const userMessages = [
                { content: settings.llm_system_prompt, role: "system" },
                ...msgs.map(({ content, sender }) => ({
                    content,
                    role: sender,
                })),
            ];
    
            // Extract only enabled ollama settings
            const ollamaSettings: Record<string, number | string> = {};
    
            Object.keys(settings).forEach((key) => {
                if (key.endsWith("_enabled") && (settings as any)[key]) {
                    const settingKey = key.replace("_enabled", "");
                    // Ensure the setting exists and is not the 'model'
                    if (settingKey !== "model" && (settings as any)[settingKey] !== undefined) {
                        var skey = settingKey.replace(/^llm_/, "");
                        ollamaSettings[skey] = (settings as any)[settingKey];
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
                        model: settings.model, // Use model from settings
                        messages: userMessages,
                        stream: false,
                        options: ollamaSettings, // Include only enabled settings
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
    }, [currentChatId, settings]);
    

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
    }, [defaultUser]);

    const handleDeleteChat = useCallback(
        async (chatId: string) => {
            try {
                await apiClient.deleteChat(chatId);
                setChats((prev) => prev.filter((chat) => chat.id !== chatId));

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

    const loadSettings = useCallback(
        async (chatId: string) => {
            try {
                const chat = await apiClient.getChat(chatId);
                console.log("Settings:",chat.settings);
                if (chat.settings) {
                    setSettings(chat.settings);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        },
        []
    );

    const loadMessages = useCallback(
        async (chatId: string) => {
            try {
                
                const fetchedMessages = await apiClient.getMessages(chatId);
                setMessages(fetchedMessages);
                await loadSettings(chatId);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        },
        [loadSettings]
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
                            onClick={() => {setCurrentChatId(session.id);loadMessages(session.id)}}
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
                            <ListItemButton>
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
                            <Box
                                key={message.id}
                                mb={2}
                                sx={{
                                    alignSelf:
                                        message.sender === "User"
                                            ? "end"
                                            : "start",
                                }}
                            >
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        mb: 0.325,
                                        textAlign:
                                            message.sender === "User"
                                                ? "end"
                                                : "start",
                                    }}
                                >
                                    {message.sender}
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            "rgb(43,43,43)",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        maxWidth: {
                                            xs: "100%",
                                            md: "90%",
                                        },
                                        boxShadow:
                                            "0 1px 1px rgba(0, 0, 0, 0.2)",
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
                                                    return !inline &&
                                                        match ? (
                                                        <SyntaxHighlighter
                                                            {...props}
                                                            language={
                                                                match[1]
                                                            }
                                                            style={darcula}
                                                            PreTag="div"
                                                        >
                                                            {String(
                                                                children
                                                            ).replace(
                                                                /\n$/,
                                                                ""
                                                            )}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code
                                                            className={
                                                                className
                                                            }
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
                                        {/* Uncomment if audioURL is available
                                        {message.audioURL && (
                                            <CustomAudioPlayer
                                                src={message.audioURL}
                                            />
                                        )} */}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Input box for the current chat session */}
                <Sheet sx={{ display: "flex", p: 1 }}>
                    <Textarea
                        variant="soft"
                        value={messageContent}
                        onChange={(e) =>
                            setMessageContent(e.target.value)
                        }
                        placeholder="Type a message..."
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