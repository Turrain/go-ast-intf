export enum Sender {
    User = "user",
    Assistant = "assistant",
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    chats: Chat[];
  }
  
  export interface STTSettings {
    language: string | null;
    beam_size: number | null;
    best_of: number | null;
    patience: number | null;
    no_speech_threshold: number | null;
    temperature: number | null;
    hallucination_silence_threshold: number | null;
  }
  
  export interface LLMSettings {
    seed: number | null;
    model: string | null;
    system_prompt: string | null;
    mirostat: number | null;
    mirostat_eta: number | null;
    mirostat_tau: number | null;
    num_ctx: number | null;
    repeat_last_n: number | null;
    repeat_penalty: number | null;
    temperature: number | null;
    tfs_z: number | null;
    num_predict: number | null;
    top_k: number | null;
    top_p: number | null;
    min_p: number | null;
  }
  
  export interface TTSSettings {
    // Define TTS settings here, e.g.,
    voice: string | null;
    speed: number | null;
  }
  
  export interface AsteriskSettings {
    asterisk_min_audio_length: number | null;
    asterisk_silence_threshold: number | null;
    asterisk_host: string | null;
    asterisk_number: string | null;
  }
  
  export interface Settings {
    sttSettings: STTSettings;
    llmSettings: LLMSettings;
    ttsSettings: TTSSettings;
    asteriskSettings: AsteriskSettings;
  }
  
  export interface Message {
    id: number;
    chatId: string;
    role: Sender;
    content: string;
    sentAt: Date;
  }
  
  export interface Chat {
    id: string;
    userId: number;
    startTime: Date;
    endTime?: Date;
    messages: Message[];
    settings?: Settings;
    title?: string;
  }