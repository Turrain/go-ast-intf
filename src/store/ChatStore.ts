import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import {
  Chat,
  Message,
  Sender,
  Settings,
  User,
} from '../types/types';
import ChatAPI from './ChatAPI';
import OllamaAPI from './OllamaAPI';

interface StoreState {
  user: User | null;
  chats: Chat[];
  currentChat: string | null;
  messages: Message[];
  settings: Settings;
  loading: boolean;
  error: string | null;
  // Actions
  initialize: () => Promise<void>;
  addChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  updateSettings: (category: keyof Settings, name: string, value: number | string | null) => void;
  saveSettingsChat: (chatId: string) => Promise<void>;
  updateMessage: (messageId: number, newContent: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
}

type MyPersist = (
    config: StateCreator<StoreState>,
    options: PersistOptions<StoreState>
  ) => StateCreator<StoreState>;

export const useStore = create<StoreState>(
  (persist as MyPersist)(
    (set, get) => {
      const apiClient = ChatAPI.getInstance("http://localhost:8009/api");
      apiClient.connect(); // Establish the Socket.IO connection once

      // Setup real-time event listeners with Zustand's set function
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
          messages: state.messages.filter((msg) => msg.id !== id),
        }));
      });

      return {
        user: null,
        chats: [],
        currentChat: null,
        messages: [],
        settings: {
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
        },
        loading: false,
        error: null,

        initialize: async () => {
          set({ loading: true, error: null });
          try {
            const users = await apiClient.listUsers();
            const user = users?.find((u) => u.email === "default@example.com") || null;
            set({ user });

            if (user) {
              const chats = await apiClient.listChats();
              set({ chats });

              if (chats && chats.length > 0) {
                const firstChatId = chats[0].id;
                set({ loading: false });
                await get().selectChat(firstChatId);
                apiClient.joinChat(firstChatId); // Join the initial chat room
              } else {
                set({ loading: false });
              }
            } else {
              set({ loading: false });
            }
          } catch (error: any) {
            set({ error: error.message, loading: false });
            console.error("Initialization Error:", error);
          }
        },

        addChat: async () => {
          const ollamaClient = new OllamaAPI("http://localhost:8009/api");
          const user = get().user;
          if (!user) return;

          try {
            const chat = await apiClient.startChat(user.id);
            if (chat) { // Ensure chat is defined
              set((state) => ({
                chats: [...state.chats, chat],
                messages: [],
                settings: {
                  ...state.settings,
                  asteriskSettings: {
                    ...state.settings.asteriskSettings,
                    asterisk_number: null, // default value set to null (disabled)
                  },
                },
              }));
              await get().selectChat(chat.id);
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
            apiClient.leaveChat(chatId); // Leave the chat room

            if (get().chats.length > 0) {
              const newChat = get().chats[0];
              await get().selectChat(newChat.id);
              apiClient.joinChat(newChat.id); // Join the new chat room
            } else {
              set({ messages: [], settings: get().settings, currentChat: null });
            }
          } catch (error: any) {
            set({ error: error.message });
            console.error("Delete Chat Error:", error);
          }
        },

        selectChat: async (chatId: string) => {
          // Leave the previous chat room if any
          const previousChatId = get().currentChat;
          if (previousChatId) {
            apiClient.leaveChat(previousChatId);
          }

          try {
            const messages = await apiClient.getMessages(chatId);
            const chat = await apiClient.getChat(chatId);
            if (chat) {
              set({
                messages: messages || [],
                settings: chat.settings || get().settings,
                currentChat: chat.id,
              });
              apiClient.joinChat(chat.id); // Join the new chat room
            }
          } catch (error: any) {
            set({ error: error.message });
            console.error("Select Chat Error:", error);
          }
        },

        sendMessage: async (content: string) => {
          try {
            const currentChatId = get().currentChat;
            if (!currentChatId?.trim() || !content.trim()) return;

            const newMessage = await apiClient.sendMessage(currentChatId, Sender.User, content.trim());
            // if(newMessage) {
            //   set((state) => ({
            //       messages: [...state.messages, newMessage],
            //     }));
            // }

            // Optionally, handle response generation if needed
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
        updateSettings: (category, name, value) => {
          set((state) => ({
            settings: {
              ...state.settings,
              [category]: {
                ...state.settings[category],
                [name]: value,
              },
            },
          }));
        },

        saveSettingsChat: async (chatId: string) => {
          try {
            await apiClient.updateChat(chatId, {
              settings: get().settings,
            });
            console.log("Settings saved successfully.");
          } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to save settings:", error);
          }
        },
      };
      },
      {
        name: 'app-storage', // unique name
        partialize: (state) => ({
          user: state.user,
          chats: state.chats,
          settings: state.settings,
          currentChat: state.currentChat,
          // Non-persisted properties
          messages: [],
          loading: false,
          error: null,
          initialize: async () => {},
          addChat: async () => {},
          deleteChat: async () => {},
          selectChat: async () => {},
          sendMessage: async () => {},
          updateSettings: () => {},
          saveSettingsChat: async () => {},
          deleteMessage: async () => {},
          updateMessage: async () => {},
        }),
      }
    )
  );