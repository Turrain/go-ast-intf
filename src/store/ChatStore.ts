import { create } from "zustand";
import OllamaAPI from "./OllamaAPI.ts";

// Define types for chat messages and sessions
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  input: string;
  title: string;  // Add a title field to each session
}

interface ChatStoreState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  addSession: () => void;
  setInput: (input: string) => void;
  sendMessage: (content: string) => void;
  switchSession: (sessionId: string) => void;
  generateTitle: (session: ChatSession) => string;
  generateAssistantResponse: () => Promise<void>;
}

// Initialize the Ollama API
const ollamaAPI = new OllamaAPI("http://192.168.25.63:11434");

// Helper to generate unique IDs for messages and sessions
const generateId = () => Math.random().toString(36).substring(7);

// Helper to generate a title based on session content
const createTitleFromSession = (session: ChatSession): string => {
  if (session.messages.length < 1) return "New Conversation";
  const firstUserMessage = session.messages.find(msg => msg.role === "user");
  const firstAssistantResponse = session.messages.find(msg => msg.role === "assistant");
  
  return (
    (firstUserMessage ? firstUserMessage.content : "Conversation") +
    (firstAssistantResponse ? ` - ${firstAssistantResponse.content}` : "")
  ).substring(0, 50); // Limit title length
};

// Create the Zustand store with support for chat
const useChatStore = create<ChatStoreState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  loading: false,

  // Add a new chat session
  addSession: () => {
    const newSession: ChatSession = {
      id: generateId(),
      messages: [],
      input: "",
      title: "New Conversation",
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: newSession.id,
    }));
  },

  // Switch to an existing chat session by id
  switchSession: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  // Set the input for the current session
  setInput: (input: string) => {
    const { currentSessionId, sessions } = get();
    if (!currentSessionId) return;

    set({
      sessions: sessions.map((session) =>
        session.id === currentSessionId ? { ...session, input } : session
      ),
    });
  },

  // Send a message in the current session
  sendMessage: (content: string) => {
    const { currentSessionId, sessions } = get();
    if (!currentSessionId) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
    };

    set({
      sessions: sessions.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage], input: "" }
          : session
      ),
    });

    get().generateAssistantResponse();
  },

  // Generate a title for a session based on its messages
  generateTitle: (session: ChatSession): string => createTitleFromSession(session),

  // Generate a response from the assistant
  generateAssistantResponse: async () => {
    const { currentSessionId, sessions } = get();
    if (!currentSessionId) return;
  
    const currentSession = sessions.find((session) => session.id === currentSessionId);
    if (!currentSession) return;
  
    const userMessages = currentSession.messages.map(({ role, content }) => ({
      role,
      content,
    }));
  
    set({ loading: true });
  
    try {
      // Call the Ollama API to get a response
      const response = await fetch("http://192.168.25.63:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma2:9b",
          messages: userMessages,
          stream: false,
        }),
      });
  
      const responseText = await response.text();
      console.log("Raw Response:", responseText);
  
      const assistantResponse = JSON.parse(responseText);
  
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: assistantResponse.message.content,
      };
  
      set({
        sessions: sessions.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                title: createTitleFromSession({ ...session, messages: [...session.messages, assistantMessage] })
              }
            : session
        ),
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch assistant response:", error);
      set({ loading: false });
    }
  }
}));

export default useChatStore;