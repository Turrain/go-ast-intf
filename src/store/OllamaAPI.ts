import axios from 'axios';
import { Sender } from './ChatAPI';

class OllamaAPI {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async chat(request: {
    model: string;
    messages: Array<{ role: Sender; content: string }>;
    stream?: boolean;
    keep_alive?: string | number;
    options?: Record<string, any>;
  }) {
    const response = await axios.post(`${this.apiUrl}/ollama/chat`, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async generate(request: {
    model: string;
    prompt: string;
    suffix?: string;
    system?: string;
    template?: string;
    raw?: boolean;
    images?: (Uint8Array | string)[];
    format?: string;
    stream?: boolean;
    keep_alive?: string | number;
    options?: Record<string, any>;
  }) {
    const response = await axios.post(`${this.apiUrl}/ollama/generate`, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async listModels() {
    const response = await axios.get(`${this.apiUrl}/ollama/models`);
    return response.data;
  }

  // Add more methods corresponding to other Ollama API endpoints as needed
}

export default OllamaAPI;