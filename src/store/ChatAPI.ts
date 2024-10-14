import axios, { AxiosInstance } from 'axios';

export enum Sender {
    User = "user",
    Assistant = "assistant",
}

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // Added password field
    createdAt: Date;
    updatedAt: Date;
    chats: Chat[];
}

export interface ChatSettings {
    [key: string]: any; // Adjust according to your settings structure
}
export interface STTSettings {
    beam_size: number;
    beam_size_enabled: boolean;
    best_of: number;
    best_of_enabled: boolean;
    patience: number;
    patience_enabled: boolean;
    no_speech_threshold: number;
    no_speech_threshold_enabled: boolean;
    temperature: number;
    temperature_enabled: boolean;
    hallucination_silence_threshold: number;
    hallucination_silence_threshold_enabled: boolean;
}
export interface LLMSettings {
    model: string;
    system_prompt: string;
    mirostat: number;
    mirostat_eta: number;
    mirostat_tau: number;
    num_ctx: number;
    repeat_last_n: number;
    repeat_penalty: number;
    temperature: number;
    tfs_z: number;
    num_predict: number;
    top_k: number;
    top_p: number;
    min_p: number;
}
export interface Chat {
    id: string;
    userId: number;
    startTime: Date;
    endTime?: Date;
    messages: Message[];
    settings?: ChatSettings;
    sttSettings?: STTSettings;
    llmSettings?: LLMSettings;
    ttsSettings?: ChatSettings;
}

export interface Message {
    id: number;
    chatId: string;
    role: Sender;
    content: string;
    sentAt: Date;
}

class ChatAPI {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({ baseURL });
    }

    // Users
    async createUser(username: string, email: string, password: string): Promise<User | undefined> {
        try {
            const response = await this.client.post('/users', { username, email, password });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async listUsers(): Promise<User[] | undefined> {
        try {
            const response = await this.client.get('/users');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Chats
    async startChat(userId: number): Promise<Chat | undefined> {
        try {
            const response = await this.client.post('/chats', { userId });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getChat(chatId: string): Promise<Chat | undefined> {
        try {
            const response = await this.client.get(`/chats/${chatId}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async listChats(): Promise<Chat[] | undefined> {
        try {
            const response = await this.client.get('/chats');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteChat(chatId: string): Promise<void> {
        try {
            await this.client.delete(`/chats/${chatId}`);
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateChat(chatId: string, data: Partial<Chat>): Promise<Chat | undefined> {
        try {
            const response = await this.client.put(`/chats/${chatId}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Messages
    async sendMessage(chatId: string, sender: Sender, content: string): Promise<Message | undefined> {
        try {
            const response = await this.client.post('/messages', { chatId, role:sender, content });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMessages(chatId: string): Promise<Message[] | undefined> {
        try {
            const response = await this.client.get(`/messages/${chatId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Network Error:', error.message);
        }
    }
}

export default ChatAPI;