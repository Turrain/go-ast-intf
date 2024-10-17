import  { StateCreator, create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { User } from '../types/types';
import ChatAPI from './ChatAPI';

interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
    // Actions
    setToken: (token: string | null) => void;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => Promise<void>;
    initialize: () => Promise<void>; // Added initialize method
}

type MyPersist = (
    config: StateCreator<AuthState>,
    options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>(
    (persist as MyPersist)(
        (set, get) => {
            const apiClient = ChatAPI.getInstance(import.meta.env.VITE_BASE_API_URL || "zero");
            apiClient.connect();

            return {
                token: null,
                user: null,
                loading: false,
                error: null,
                setToken: (token: string | null) => {
                    set(() => ({ token }));
                    if (token) {
                        apiClient.setToken(token);
                    }
                },
                loginUser: async (email: string, password: string) => {
                    set({ loading: true, error: null });
                    try {
                        await apiClient.loginUser(email, password);
                        const token = apiClient.getToken();
                        set({ token });
                        await useAuthStore.getState().initialize();
                        const user = await apiClient.getCurrentUser();
                        set({ user, loading: false });
                    } catch (error: any) {
                        set({ error: error.message, loading: false });
                        console.error("Login Error:", error);
                    }
                },
                registerUser: async (email: string, password: string) => {
                    set({ loading: true, error: null });
                    try {
                        const user = await apiClient.registerUser(email, password);
                        if (user) {
                            set({ user });
                        }
                        set({ loading: false });
                        await get().loginUser(email, password);
                    } catch (error: any) {
                        set({ error: error.message, loading: false });
                        console.error("Register Error:", error);
                    }
                },
                logoutUser: async () => {
                    set({ loading: true, error: null });
                    try {
                        await apiClient.logoutUser();
                        set({ token: null, user: null });
                        // Optionally, you can clear other stores here
                    } catch (error: any) {
                        set({ error: error.message, loading: false });
                        console.error("Logout Error:", error);
                    }
                },
                initialize: async () => { // Implement the initialize method
                    try {
                        // Example: Fetch current user data if token exists
                        const token = get().token;
                        if (token) {
                            apiClient.setToken(token);
                            const user = await apiClient.getCurrentUser();
                            set({ user });
                        }
                    } catch (error: any) {
                        set({ error: error.message });
                        console.error("Auth Initialization Error:", error);
                    }
                },
            };
        },
        {
            name: 'auth-storage', // unique name
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),
        }
    )
);