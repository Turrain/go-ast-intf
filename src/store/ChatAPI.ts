import axios, { AxiosInstance } from 'axios';

export interface ChatMessage {
    id: string;
    role: "User" | "LLM";
    content: string;
    audioURL?: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: ChatMessage[];
    input: string;
}

export interface User {
    id: number;
    email: string;
    username: string;
}

class ChatAPI {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({ baseURL });
    }

    // Users
    async createUser(username: string, email: string): Promise<User | undefined> {
        try {
            const response = await this.client.post('/users', { username, email });
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
    async sendMessage(chatId: string, sender: string, content: string): Promise<Message | undefined> {
        try {
            const response = await this.client.post('/messages', { chatId, sender, content });
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