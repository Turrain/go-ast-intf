import React, { FC, useState } from "react";
import { Typography, Input, Button, Sheet, Alert, CircularProgress, Switch, Box } from "@mui/joy";
import { AsteriskSettings } from "../../types/types";
import { useStore } from "../../store/ChatStore";
import AsteriskAPI from "../../store/AsteriskAPI";

interface AsteriskFormProps {
    chatId: string;
    settings: AsteriskSettings;
    onSettingsChange: (name: string, value: number | string | null) => void;
}

const AsteriskForm: FC<AsteriskFormProps> = ({ chatId, settings, onSettingsChange }) => {
    const asteriskAPI = new AsteriskAPI('http://192.168.25.63:8009');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCall = async () => {
        const endpoint = settings.asterisk_number;

        if (!endpoint) {
            setErrorMessage('Endpoint is required to make a call.');
            return;
        }

        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const response = await asteriskAPI.originateChannel(endpoint, { chatId });
            setSuccessMessage(response.message);
            console.log('Channel ID:', response.channelId);
        } catch (error: any) {
            setErrorMessage(error.error || 'Failed to originate channel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet
            color="primary"
            variant="soft"
            sx={{ p: 1, borderRadius: 2, mt: 2 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography level="body-xs">Asterisk Host</Typography>
                <Switch
                    checked={settings.asterisk_host !== null}
                    onChange={(e) => onSettingsChange("asterisk_host", e.target.checked ? "192.168.25.63" : null)}
                    sx={{ ml: 2 }}
                />
            </Box>
            {settings.asterisk_host !== null && (
                <Input
                    fullWidth
                    size="sm"
                    variant="soft"
                    sx={{ mb: 1 }}
                    placeholder="Enter Asterisk host"
                    value={settings.asterisk_host}
                    onChange={(e) =>
                        onSettingsChange('asterisk_host', e.target.value || null)
                    }
                />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography level="body-xs">Endpoint</Typography>
                <Switch
                    checked={settings.asterisk_number !== null}
                    onChange={(e) => onSettingsChange("asterisk_number", e.target.checked ? "PJSIP/7000" : null)}
                    sx={{ ml: 2 }}
                />
            </Box>
            {settings.asterisk_number !== null && (
                <Input
                    sx={{ mb: 1 }}
                    variant="soft"
                    fullWidth
                    size="sm"
                    placeholder="Enter endpoint (e.g., PJSIP/7000)"
                    value={settings.asterisk_number}
                    onChange={(e) =>
                        onSettingsChange('asterisk_number', e.target.value || null)
                    }
                />
            )}

            {successMessage && (
                <Alert color="success" sx={{ mb: 1 }}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert color="danger" sx={{ mb: 1 }}>
                    {errorMessage}
                </Alert>
            )}
            <Button
                variant="solid"
                color="primary"
                fullWidth
                onClick={handleCall}
                disabled={loading || settings.asterisk_number === null}
                startDecorator={loading ? <CircularProgress size="sm" /> : null}
            >
                {loading ? 'Calling...' : 'Call'}
            </Button>
        </Sheet>
    );
};

export default AsteriskForm;