import React, { useEffect, useCallback, FC, useState } from "react";
import {
    Box,
    Sheet,
    Button,
    List,
    IconButton,
    Typography,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Stack,
    ListItemButton,
    ListItem,
    ListItemContent,
    tabClasses,
    ModalDialog,
    Modal,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Dropdown,
} from "@mui/joy";
import { Clear, Delete, Edit, Logout, MoreVert } from "@mui/icons-material";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import STTForm from "./Settings/STTForm";
import LLMForm from "./Settings/LLMForm";
import AsteriskForm from "./Settings/AsteriskForm";
import { Chat } from "../types/types";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { useStore } from "zustand";
import { useChatStore } from "../store/ChatStore";
import { useMessageStore } from "../store/MessageStore";
import { useSettingsStore } from "../store/SettingsStore";
import { useAuthStore } from "../store/AuthStore";

const ChatPane: FC = () => {

    const chats = useChatStore(state => state.chats);
    const currentChat = useChatStore(state => state.currentChat);
    const selectChat = useChatStore(state => state.selectChat);
    const addChat = useChatStore(state => state.addChat);
    const deleteChat = useChatStore(state => state.deleteChat);
    const renameChat = useChatStore(state => state.renameChat); 
   // const initialize = useChatStore(state => state.initialize);
    const messages = useMessageStore(state => state.messages);
    const clearMessages = useMessageStore(state => state.clearMessages);
    const sendMessage = useMessageStore((state) => state.sendMessage);
    //
    const logoutUser = useAuthStore((state)=> state.logoutUser)
    const user = useAuthStore((state)=> state.user)
    const getChats = useChatStore((state) => state.getChats);
    const settings = useSettingsStore((state) => state.settings);

    const saveSettingsChat = useSettingsStore((state) => state.saveSettingsChat);
    
    const updateSettings = useSettingsStore((state) => state.updateSettings);
  //  const initialize = useStore((state) => state.initialize);
    //const saveSettingsChat = useStore((state) => state.saveSettingsChat);
   // const error = useStore((state) => state.error);

    
    useEffect(() => {
        getChats();
    }, []);
  
    const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState<string>('');

   

    const handleSendMessage = useCallback(async (content: string) => {
        await sendMessage(content);
    }, [sendMessage]);

    const handleRename = async (chatId: string) => {
        await renameChat(chatId, newTitle);
        setRenamingChatId(null);
        setNewTitle('');
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
               
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                    height: '5px', // Set the scrollbar width
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888', // Set the scrollbar thumb color
                    borderRadius: '10px', // Optional: round the scrollbar thumb
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555', // Change color on hover
                },
                position: 'relative',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='gray' opacity='0.1' transform='translate(-50%, -50%)'>TEST(L)</text></svg>")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '300px 300px',
            }}
        >
       
            {/* <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(45deg)', // Added rotate(45deg)
                    opacity: 0.05,
                    fontSize: '5rem',
                    color: 'gray',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            >
                Лехич Playground
            </Box> */}
 
            <Sheet
                sx={{
                    minWidth: { xs: '100dvw', md: '350px' },
                    width: { xs: '100dvw', md: '350px' },
                    height: '100vh',
                    scrollSnapAlign: 'start',

                    overflowY: 'auto',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {/* <Typography level="body-xs">{import.meta.env.MODE }</Typography>
                <Typography level="body-xs">{import.meta.env.VITE_BASE_API_URL }</Typography> */}
                <Box sx={{
                    px: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    position: 'sticky',      // Makes the box sticky
                    top: 0,                  // Sticks to the top
                    backgroundColor: 'background.surface',
                    zIndex: 1,               // Keeps it above other elements
                    paddingTop: 1,           // Adds top padding
                    paddingBottom: 1,        // Adds bottom padding
                }}>
                    <Button
                        onClick={() => addChat()}
                        fullWidth
                        color="primary"
                        variant="plain"
                        sx={{ mt: 2, mb: 1, backgroundColor: 'background.level1', borderRadius: '18px', boxShadow: 'sm' }}
                    >
                        New Chat
                    </Button>

                  
                    <ColorSchemeToggle sx={{ mt: 2, mb: 1, borderRadius: '50%', px: 1.25, boxShadow: 'sm' }} />
                    <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        sx={{
                            borderRadius: '50%',
                            boxShadow: 'sm',
                            mt: 2,
                            mb: 1,
                        }}
                        onClick={() => logoutUser()}
                    >
                        <Logout />
                    </IconButton>
                
                </Box>

                <List sx={{ px: 2, gap: 1 }}>
                    {chats.map((chat: Chat) => (
                        <ListItem key={chat.id}>
                            <ListItemButton
                                sx={{
                                    backgroundColor: 'background.surface',
                                    borderRadius: '18px',
                                }}
                                onClick={() => selectChat(chat.id)}
                                selected={chat.id === currentChat}
                            >
                                <ListItemContent>
                                    <Typography level="body-xs">
                                        {chat.title || chat.id} {/* Display title if available */}
                                    </Typography>
                                </ListItemContent>
                                <IconButton
                                    size="sm"
                                    variant="plain" 
                                    color="neutral"
                                    sx={{
                                        opacity: chat.id !== currentChat ? 0.1 : 1,
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    color="neutral"
                                    sx={{
                                        opacity: chat.id !== currentChat ? 0.1 : 1,
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRenamingChatId(chat.id);
                                        setNewTitle(chat.title || '');
                                    }}
                                >
                                    {/* You can use an edit icon here */}
                                    <Edit />
                                </IconButton>
                            </ListItemButton>
                            {/* Rename Modal */}
                            {renamingChatId === chat.id && (
                                <Modal
                                    open={true}
                                    onClose={() => setRenamingChatId(null)}
                                    aria-labelledby="rename-chat-title"
                                    aria-describedby="rename-chat-description"
                                >
                                    <ModalDialog>
                                        <Typography id="rename-chat-title" level="body-md" mb={2}>
                                            Rename Chat
                                        </Typography>
                                        <Input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Enter new chat title"
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        />
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            onClick={() => handleRename(chat.id)}
                                            sx={{ mr: 2 }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="plain"
                                            color="neutral"
                                            onClick={() => setRenamingChatId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </ModalDialog>
                                </Modal>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Sheet>
            
            <Stack sx={{
                flex: 1,
                scrollSnapAlign: 'start',
                minWidth: { xs: '100dvw', md: 'unset' },
                width: { xs: '100dvw', md: '100%' },
                height: '100vh',
              
                pb: 4,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                    <Box
                component="header"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  padding: 2,
                  backgroundColor: 'background.level1',
                 
                }}
              >
              
              <Dropdown >
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
      >
        <MoreVert />
      </MenuButton>
      <Menu variant="plain" sx={{bgcolor: 'background.surface', py: 0, width: '100px'}}>
        <MenuItem sx={{color: 'text.secondary', width: '100%'}} onClick={() => clearMessages(currentChat!)}>Очистить</MenuItem>
       
      </Menu>
    </Dropdown>
  
              </Box>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        width: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        '&::-webkit-scrollbar': {
                            width: '3px', // Set the scrollbar width
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888', // Set the scrollbar thumb color
                            borderRadius: '10px', // Optional: round the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555', // Change color on hover
                        },
                    }}
                    ref={(el) => {
                        if (el) {
                            // Ensure el is of type HTMLElement
                            const boxElement = el as HTMLElement;
                            boxElement.scrollTop = boxElement.scrollHeight;
                        }
                    }}
                >
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                </Box>
                <ChatInput
                    onSend={handleSendMessage}
                />
            </Stack>
            <Sheet
                id="Settings"
                sx={{
                    height: "100vh",
                    scrollSnapAlign: 'start',
                    width: { xs: '100dvw', md: '350px' },
                    minWidth: { xs: '100dvw', md: '350px' },
                    overflow: 'auto',
                    px: 2,
                }}
            >
                {/* <Button
                    onClick={() => saveSettingsChat(getCurrentChatId(chats))}
                    variant="solid"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Save Settings
                </Button> */}
           
                <Tabs aria-label="Settings Tabs" size="sm" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
                    <TabList disableUnderline={true} tabFlex="auto" sx={{
                        mt: 2,
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'xl',
                        bgcolor: 'background.level1',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'background.surface',
                        },
                    }}>
                        <Tab disableIndicator>STT</Tab>
                        <Tab disableIndicator>LLM</Tab>
                        <Tab disableIndicator>TTS</Tab>
                        <Tab disableIndicator>     {user?.email}</Tab>
                        {/* Add more tabs if necessary */}
                    </TabList>
                    <TabPanel value={0}>
                        <STTForm
                            settings={settings.sttSettings}
                            onSettingsChange={(name, value) => updateSettings('sttSettings', name, value)}
                        />
                    </TabPanel>
                    <TabPanel value={1}>
                        <LLMForm
                            settings={settings.llmSettings}
                            onSettingsChange={(name, value) => updateSettings('llmSettings', name, value)}
                        />
                    </TabPanel>
                    {/* <TabPanel value={2}>
                        <TTSForm
                            settings={settings.ttsSettings}
                            onSettingsChange={(name, value) => updateSettings('ttsSettings', name, value)}
                        />
                    </TabPanel> */}
                    <TabPanel value={3}>
                        <AsteriskForm
                            settings={settings.asteriskSettings}
                            onSettingsChange={(name, value) => updateSettings('asteriskSettings', name, value)}
                            chatId={getCurrentChatId(chats)}
                        />
                    </TabPanel>
                </Tabs>
            </Sheet>
        </Box>
    );
};

// Utility function to get the current chat ID
const getCurrentChatId = (chats: Chat[]): string => {
    if (chats.length === 0) return "";
    return chats[0].id;
};

export default React.memo(ChatPane);