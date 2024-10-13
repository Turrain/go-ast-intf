// src/apiClient.ts
import axios, { AxiosInstance } from 'axios';
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    audioURL?: string;  // Optional audio URL
  }
  
interface ChatSession {
    id: string;
    messages: ChatMessage[];
    input: string;
    title: string;  // Add a title field to each session
  }

  
class ChatAPI {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  // Users
  async createUser(username: string, email: string) {
    try {
      const response = await this.client.post('/users', { username, email });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async listUsers() {
    try {
      const response = await this.client.get('/users');
     
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Chats
  async startChat(userId: number) {
    try {
      const response = await this.client.post('/chats', { userId });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
async getChat(chatId: string) {
    try {
        const response = await this.client.get(`/chats/${chatId}`);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        this.handleError(error);
    }
}
  async listChats() {
    try {
      const response = await this.client.get('/chats');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  async deleteChat(chatId: string) {
    try {
      const response = await this.client.delete(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateChat(chatId: string, data: { userId?: number; endTime?: string; settings?: any }) {
    try {
      const response = await this.client.put(`/chats/${chatId}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  // Messages
  async sendMessage(chatId: string, sender: string, content: string) {
    try {
      const response = await this.client.post('/messages', { chatId, sender, content });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMessages(chatId: string) {
    try {
      const response = await this.client.get(`/messages/${chatId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Sessions
  async saveSession(session: ChatSession) {
    try {
      const response = await this.client.post('/sessions', session);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async loadSessions() {
    try {
      const response = await this.client.get('/sessions');
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