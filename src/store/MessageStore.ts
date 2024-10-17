import  { StateCreator, create } from 'zustand';
import { Message, Sender } from '../types/types';
import ChatAPI from './ChatAPI';
import OllamaAPI from './OllamaAPI';
import { useChatStore } from './ChatStore';
import { useSettingsStore } from './SettingsStore';


interface MessageState {
    messages: Message[];
    loading: boolean;
    error: string | null;
    // Actions
    sendMessage: (content: string) => Promise<void>;
    updateMessage: (messageId: number, newContent: string) => Promise<void>;
    deleteMessage: (messageId: number) => Promise<void>;
    clearMessages: (chatId: string) => Promise<void>;
    setMessages: (messages: Message[]) => void;
}

export const useMessageStore = create<MessageState>((set, get) => {
    const apiClient = ChatAPI.getInstance(import.meta.env.VITE_BASE_API_URL || "zero");
    apiClient.connect();

    // Real-time event listeners for messages
    apiClient.socket.on('newMessage', (message: Message) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    });

    apiClient.socket.on('updateMessage', (updatedMessage: Message) => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
            ),
        }));
    });

    apiClient.socket.on('deleteMessage', ({ id }: { id: string }) => {
        set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== parseInt(id)),
        }));
    });

    return {
        messages: [],
        loading: false,
        error: null,
      
        sendMessage: async (content: string) => {
            try {
                const currentChatId = useChatStore.getState().currentChat;
                if (!currentChatId?.trim() || !content.trim()) return;

                const ollamaClient = new OllamaAPI(import.meta.env.VITE_BASE_API_URL || "zero");
                const llmSettings = useSettingsStore.getState().settings.llmSettings;

                const systemPrompt = llmSettings.system_prompt;
                const messages = get().messages
                    .filter(msg => msg.chatId === currentChatId)
                    .map(msg => ({
                        role:
                            msg.role === Sender.User
                                ? 'user'
                                : msg.role === Sender.Assistant
                                    ? 'assistant'
                                    : 'system',
                        content: msg.content,
                    })) || [];

                const fullMessages = [
                    { role: 'system', content: systemPrompt! },
                    ...messages,
                    { role: 'user', content: content.trim() },
                ];
          
                await apiClient.sendMessage(currentChatId, Sender.User, content.trim());

                const llmNotNullSettings = Object.fromEntries(
                    Object.entries(llmSettings).filter(([_, value]) => value !== null)
                );

                const response = await ollamaClient.chat({
                    model: llmSettings.model || 'gemma2:9b',
                    messages: fullMessages,
                    stream: false,
                    options: llmNotNullSettings,
                });

                await apiClient.sendMessage(currentChatId, Sender.Assistant, response.message.content);
            } catch (error: any) {
                set({ error: error.message });
                console.error("Send Message Error:", error);
            }
        },
        updateMessage: async (messageId: number, newContent: string) => {
            try {
                const updatedMessage = await apiClient.updateMessage(messageId, newContent);
                if (updatedMessage) {
                    set((state) => ({
                        messages: state.messages.map((msg) =>
                            msg.id === updatedMessage.id ? updatedMessage : msg
                        ),
                    }));
                }
            } catch (error: any) {
                set({ error: error.message });
                console.error("Update Message Error:", error);
            }
        },
        deleteMessage: async (messageId: number) => {
            try {
                await apiClient.deleteMessage(messageId);
                set((state) => ({
                    messages: state.messages.filter((msg) => msg.id !== messageId),
                }));
            } catch (error: any) {
                set({ error: error.message });
                console.error("Delete Message Error:", error);
            }
        },
        clearMessages: async (chatId: string) => {
            try {
                await apiClient.clearMessages(chatId);
                set({ messages: [] });
            } catch (error: any) {
                set({ error: error.message });
                console.error("Clear Messages Error:", error);
            }
        },
        setMessages: (messages: Message[]) => set({ messages }),
    };
});