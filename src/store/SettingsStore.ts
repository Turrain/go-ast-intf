import {create} from 'zustand';
import { Settings } from '../types/types';
import ChatAPI from './ChatAPI';
import { useChatStore } from './ChatStore';

interface SettingsState {
    settings: Settings;
    // Actions
    updateSettings: (category: keyof Settings, name: string, value: number | string | null) => Promise<void>;
    saveSettingsChat: (chatId: string) => Promise<void>;
    setSettings: (settings: Settings) => void;
    resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
    const apiClient = ChatAPI.getInstance(import.meta.env.VITE_BASE_API_URL || "zero");

    return {
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
        },
        updateSettings: async (category, name, value) => {
            set((state) => ({
                settings: {
                    ...state.settings,
                    [category]: {
                        ...state.settings[category],
                        [name]: value,
                    },
                },
            }));
            const currentChatId = useChatStore.getState().currentChat;
            if (currentChatId) {
                await apiClient.updateChat(currentChatId, {
                    settings: get().settings,
                });
            }
        },
        saveSettingsChat: async (chatId: string) => {
            try {
                await apiClient.updateChat(chatId, {
                    settings: get().settings,
                });
                console.log("Settings saved successfully.");
            } catch (error: any) {
                console.error("Failed to save settings:", error);
            }
        },
        setSettings: (settings: Settings) => set({ settings }),
        resetSettings: () => set({
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
            },
        }),
    };
});