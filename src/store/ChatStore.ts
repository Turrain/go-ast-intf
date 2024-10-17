import  { StateCreator, create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { Chat, Sender, Settings } from '../types/types';
import ChatAPI from './ChatAPI';
import { useAuthStore } from './AuthStore';
import { useSettingsStore } from './SettingsStore';
import OllamaAPI from './OllamaAPI';
import { useMessageStore } from './MessageStore';

interface ChatState {
    chats: Chat[];
    currentChat: string | null;
    loading: boolean;
    error: string | null;
    // Actions
    initialize: () => Promise<void>;
    addChat: () => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string) => Promise<void>;
    renameChat: (chatId: string, newTitle: string | null) => Promise<void>;
    getChats: () => Promise<void>;
}

type MyPersist = (
    config: StateCreator<ChatState>,
    options: PersistOptions<ChatState>
) => StateCreator<ChatState>;

export const useChatStore = create<ChatState>(
    (persist as MyPersist)(
        (set, get) => {
            const apiClient = ChatAPI.getInstance(import.meta.env.VITE_BASE_API_URL || "zero");
            apiClient.connect();

            // Real-time event listeners can be managed here or in another store
            return {
                chats: [],
                currentChat: null,
                loading: false,
                error: null,
                initialize: async () => {
                    const { token } = useAuthStore.getState();
                    if (token) {
                        apiClient.setToken(token);
                    }
                    set({ loading: true, error: null });
                    try {
                        const user = await apiClient.getCurrentUser();
                        // Assume user is handled in AuthStore
                        const chats = await apiClient.listChats();
                        set({ chats });
                        if (chats.length > 0) {
                            const firstChatId = chats[0].id;
                            await useChatStore.getState().selectChat(firstChatId);
                            apiClient.joinChat(firstChatId);
                        }
                        set({ loading: false });
                    } catch (error: any) {
                        set({ error: error.message, loading: false });
                        console.error("Initialization Error:", error);
                    }
                },
                getChats: async () => {
                    const chats = await apiClient.listChats();
                    set({ chats });
                },
                addChat: async () => {
                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    try {
                        const chat = await apiClient.startChat(user.id);
                        if (chat) {
                            set((state) => ({
                                chats: [chat, ...state.chats],
                                currentChat: chat.id,
                            }));
                            await useChatStore.getState().selectChat(chat.id);
                        }
                    } catch (error: any) {
                        set({ error: error.message });
                        console.error("Add Chat Error:", error);
                    }
                },
              

                deleteChat: async (chatId: string) => {
                    try {
                        await apiClient.deleteChat(chatId);
                        set((state) => ({
                            chats: state.chats.filter((chat) => chat.id !== chatId),
                        }));
                        apiClient.leaveChat(chatId);

                        const remainingChats = get().chats.filter(chat => chat.id !== chatId);
                        if (remainingChats.length > 0) {
                            const newChat = remainingChats[0];
                            await useChatStore.getState().selectChat(newChat.id);
                            apiClient.joinChat(newChat.id);
                        } else {
                            // Clear current chat in other stores if necessary
                            set({ currentChat: null });
                            useSettingsStore.getState().resetSettings();
                            // Similarly, clear messages in MessageStore
                        }
                    } catch (error: any) {
                        set({ error: error.message });
                        console.error("Delete Chat Error:", error);
                    }
                },
                selectChat: async (chatId: string) => {
                    const previousChatId = get().currentChat;
                    if (previousChatId) {
                        apiClient.leaveChat(previousChatId);
                    }

                    try {
                        const messages = await apiClient.getMessages(chatId);
                        const chat = await apiClient.getChat(chatId);
                        if (chat) {
                            set({
                                chats: get().chats.map(c => c.id === chatId ? chat : c),
                                currentChat: chat.id,
                            });
                            useSettingsStore.getState().setSettings(chat.settings ||    {
                                sttSettings: {
                                    language: null,
                                    beam_size: null,
                                    best_of: null,
                                    patience: null,
                                    no_speech_threshold: null,
                                    temperature: null,
                                    hallucination_silence_threshold: null,
                                },
                                llmSettings: {
                                    seed: 0,
                                    model: null,
                                    system_prompt: null,
                                    mirostat: null,
                                    mirostat_eta: null,
                                    mirostat_tau: null,
                                    num_ctx: null,
                                    repeat_last_n: null,
                                    repeat_penalty: null,
                                    temperature: null,
                                    tfs_z: null,
                                    num_predict: null,
                                    top_k: null,
                                    top_p: null,
                                    min_p: null,
                                },
                                ttsSettings: {
                                    voice: null,
                                    speed: null,
                                },
                                asteriskSettings: {
                                    asterisk_min_audio_length: null,
                                    asterisk_silence_threshold: null,
                                    asterisk_host: null,
                                    asterisk_number: null,
                                },
                            },);
                            useMessageStore.getState().setMessages(messages);
                            // Assume MessageStore handles setting messages
                            apiClient.joinChat(chat.id);
                        }
                    } catch (error: any) {
                        set({ error: error.message });
                        console.error("Select Chat Error:", error);
                    }
                },
                renameChat: async (chatId: string, newTitle: string | null) => {
                    try {
                        set({ loading: true, error: null });
                        const chat = get().chats.find(c => c.id === chatId);
                        if (!chat) throw new Error("Chat not found");

                        let updatedTitle = newTitle;
                        if (!newTitle) {
                            // Generate title using LLM
                            const ollamaClient = new OllamaAPI(import.meta.env.VITE_BASE_API_URL || "zero");
                            const response = await ollamaClient.chat({
                                model: "gemma2:9b",
                                messages: [
                                    { role: Sender.User, content: `ONLY ON RUSSIAN LANGUAGE, WITHOUT EMOJI AND MARKDOWN, Generate a short title for the following chat: ${chat.messages.map(m => m.content).join(' ')}` },
                                ],
                                stream: false,
                            });

                            updatedTitle = response.message.content.trim();
                            if (!updatedTitle) {
                                throw new Error("Failed to generate a new title");
                            }
                        }

                        const updatedChat = await apiClient.updateChat(chatId, { title: updatedTitle });
                        if (updatedChat) {
                            set((state) => ({
                                chats: state.chats.map((c) =>
                                    c.id === chatId ? { ...c, title: updatedChat.title } : c
                                ),
                                loading: false,
                            }));
                        }
                    } catch (error: any) {
                        set({ error: error.message, loading: false });
                        console.error("Rename Chat Error:", error);
                    }
                },
            };
        },
        {
            name: 'chat-storage', // unique name
            partialize: (state) => ({
                chats: state.chats,
                currentChat: state.currentChat,
            }),
        }
    )
);