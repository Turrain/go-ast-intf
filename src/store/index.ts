// This file ensures that all stores are initialized properly.

import { useAuthStore } from './AuthStore';
import { useChatStore } from './ChatStore';
import { useMessageStore } from './MessageStore';
import { useSettingsStore } from './SettingsStore';

// Initialize AuthStore
useAuthStore.getState().initialize();
useChatStore.getState().initialize();

// Alternatively, you can manage initialization based on your app's flow.