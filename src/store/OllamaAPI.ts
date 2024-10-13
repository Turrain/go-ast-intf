// Define the class for interacting with the Ollama API



class OllamaAPI {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async generateCompletion(model: string, prompt: string, stream: boolean = true) {
    const response = await fetch(`${this.apiUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream,
      }),
    });
    return await response.json();
  }

  async generateChat(model: string, messages: Array<{ role: string; content: string }>, stream: boolean = true) {
    const response = await fetch(`${this.apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    });
    return await response.json();
  }

  async listLocalModels() {
    const response = await fetch(`${this.apiUrl}/api/tags`, {
      method: "GET",
    });
    return await response.json();
  }

  async showModelInfo(name: string) {
    const response = await fetch(`${this.apiUrl}/api/show`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    return await response.json();
  }
}

export default OllamaAPI;
