import React, { FC, useState } from "react";
import { Box, Button, IconButton, Modal, ModalClose, ModalDialog, Sheet, Stack, Textarea, Typography } from "@mui/joy";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { Message, Sender } from "../types/types";
import { Delete, Edit } from "@mui/icons-material";
import { useStore } from "../store/ChatStore";




interface ChatMessageProps {
    message: Message;
}

const ChatMessage: FC<ChatMessageProps> = React.memo(({ message }) => {
    const deleteMessage = useStore((state) => state.deleteMessage);
    const updateMessage = useStore((state) => state.updateMessage);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const confirmDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = () => {
        handleDelete();
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteCancelled = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        deleteMessage(message.id);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editedContent.trim() !== "") {
            await updateMessage(message.id, editedContent.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(message.content);
        setIsEditing(false);
    };
    
    return (
        <Box
            mb={2}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === Sender.User ? 'flex-end' : 'flex-start',
             
                alignSelf: message.role === Sender.User ? "end" : "start",
                maxWidth: '60%',
                 minWidth: '30%'
            }}
        >
            <Stack  sx={{mb: 0.5, display: 'flex', gap:1, alignItems: 'center', flexDirection: message.role === Sender.User ? 'row-reverse' : 'row'}}>
            <Typography
                level="body-xs"
                sx={{
                
                    textAlign: message.role === Sender.User ? "end" : "start",
                }}
            >
                {message.role === Sender.User ? "User" : "Assistant"}
            </Typography>
            <Typography level="body-xs" sx={{ textAlign: 'end',  }}>{new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Typography>
            </Stack>
           
            <Box
                sx={{
                    backgroundColor: "background.surface",
                    borderRadius: "18px",
                    padding: "10px",
                    maxWidth: { xs: "100%", md: "90%" },
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                    color: "#FFF",
                }}
            >
                {isEditing ? (
                    <Box>
                        <Textarea
                            value={editedContent}
                       
                            onChange={(e) => setEditedContent(e.target.value)}
                            minRows={2}
                            maxRows={6}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button variant="solid" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="plain" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Typography level="body-md" sx={{ wordWrap: 'break-word' }}>
                        <Markdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(
                                        className || ""
                                    );
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            {...props}
                                            language={match[1]}
                                            style={darcula}
                                            PreTag="div"
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code
                                            className={className}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                          
                        </Markdown>
                        
                    </Typography>
                )}
                {/* {message.audioURL && (
                    <CustomAudioPlayer src={message.audioURL} />
                )} */}
            </Box>
          
            <Box sx={{ mt: 0.5, ml: 1, opacity: 0, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }}>
                <Stack direction="row" spacing={0}>
                    {!isEditing && (
                        <>
                            <IconButton aria-label="delete" size="sm" color="neutral" variant="plain" onClick={confirmDelete}>
                                <Delete fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="edit" size="sm" color="neutral" variant="plain" onClick={handleEdit}>
                                <Edit fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Stack>
            </Box>
           <Modal open={isDeleteDialogOpen} onClose={handleDeleteCancelled} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <ModalDialog>
              
               
                <Sheet
                variant="plain"
                sx={{
                    maxWidth: 500,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'sm',
                }}
            >
                  <ModalClose />
                <Typography id="delete-dialog-title" level="h4" mb={2}>
                    Confirm Deletion
                </Typography>
                <Typography id="delete-dialog-description" mb={3}>
                    Are you sure you want to delete this message?
                </Typography>
                <Button variant="solid" color="danger" onClick={handleDeleteConfirmed}>
                    Delete
                </Button>
            </Sheet>
               
            </ModalDialog>
           </Modal>
        </Box>
    );
});

export default ChatMessage;