import axios, { AxiosInstance } from 'axios';
import { Sender, Chat, Message, User } from '../types/types';
import { io, Socket } from 'socket.io-client';

class ChatAPI {
    private static instance: ChatAPI;
    private client: AxiosInstance;
    public socket: Socket;
    private token: string | null = null;

    private constructor(baseURL: string) {
        this.client = axios.create({ baseURL });
        this.socket = io(baseURL);

        this.setupSocketListeners();
    }

    // Singleton access method
    public static getInstance(baseURL: string): ChatAPI {
        if (!ChatAPI.instance) {
            ChatAPI.instance = new ChatAPI(baseURL);
        }
        return ChatAPI.instance;
    }

    // Users
    public setToken(token: string) {
        this.token = token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    public getToken(): string | null {
        return this.token;
    }
    // Users
    async registerUser(email: string, password: string): Promise<User | undefined> {
        try {
            const response = await this.client.post('/users/register', { email, password });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async loginUser(email: string, password: string): Promise<void> {
        try {
            const response = await this.client.post('/users/login', { email, password });
            this.setToken(response.data.token);
            
        } catch (error) {
            this.handleError(error);
        }
    }

    async logoutUser(): Promise<void> {
        try {
            await this.client.post('/users/logout');
            this.token = null;
            delete this.client.defaults.headers.common['Authorization'];
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
    async updateUser(userId: number, data: Partial<User>): Promise<User | undefined> {
        try {
            const response = await this.client.put(`/users/${userId}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
    async getCurrentUser(): Promise<User | undefined> {
        try {
            const response = await this.client.get('/users/me');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
    async clearMessages(chatId: string): Promise<void> {
        try {
            await this.client.delete(`/messages/clear/${chatId}`);
        } catch (error) {
            this.handleError(error);
        }
    }
   


    async deleteUser(userId: number): Promise<void> {
        try {
            await this.client.delete(`/users/${userId}`);
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
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async listChats(): Promise<Chat[] | undefined> {
        try {
            const response = await this.client.get('/chats');
            console.log(response.data)
            return response.data;

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

    async deleteChat(chatId: string): Promise<void> {
        try {
            await this.client.delete(`/chats/${chatId}`);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Messages
    async sendMessage(chatId: string, sender: Sender, content: string): Promise<Message | undefined> {
        try {
            const response = await this.client.post('/messages', { chatId, role: sender, content });
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

    async updateMessage(messageId: number, content: string): Promise<Message | undefined> {
        try {
            const response = await this.client.put(`/messages/${messageId}`, { content });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteMessage(messageId: number): Promise<void> {
        try {
            await this.client.delete(`/messages/${messageId}`);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Socket.IO Setup
    private setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        this.socket.on('newMessage', (message: Message) => {
            console.log('New message received:', message);
            // This will be handled in the store via callbacks or event emitters
            // You can implement custom logic here if needed
        });

        this.socket.on('updateMessage', (message: Message) => {
            console.log('Message updated:', message);
            // Handle message update logic if needed
        });

        this.socket.on('deleteMessage', (data: { id: string }) => {
            console.log('Message deleted:', data.id);
            // Handle message deletion logic if needed
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
    }

    // Connect method to initiate the socket connection
    connect() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }

    // Disconnect method to gracefully close the connection
    disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    // Emitters for joining and leaving chat rooms
    joinChat(chatId: string) {
        this.socket.emit('joinChat', chatId);
    }

    leaveChat(chatId: string) {
        this.socket.emit('leaveChat', chatId);
    }

    // Utility to handle errors
    private handleError(error: any) {
        console.error('API Error:', error);
        throw error;
    }
}

export default ChatAPI;