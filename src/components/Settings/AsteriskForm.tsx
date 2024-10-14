import React, { FC, useState } from "react";
import { Typography, Input, Button, Sheet, Alert, CircularProgress } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import AsteriskAPI from "../../store/AsteriskAPI";

interface AsteriskFormProps {
    chatId: string;
    settings: Settings;
    onSettingsChange: (name: string, value: number | string) => void;
}

interface Settings {
    asterisk_min_audio_length: number;
    asterisk_min_audio_length_enabled: boolean;
    asterisk_silence_threshold: number;
    asterisk_silence_threshold_enabled: boolean;
    asterisk_host: string;
    asterisk_host_enabled: boolean;
    asterisk_number: string;
    asterisk_number_enabled: boolean;
}
const asteriskAPI = new AsteriskAPI('http://192.168.25.63:8009');

const AsteriskForm: React.FC<AsteriskFormProps> = ({
    chatId,
    settings,
    onSettingsChange,
  }) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleCall = async () => {
      const endpoint = settings.asterisk_number; // Assuming the number field holds the endpoint like 'PJSIP/7000'
  
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
        <Typography level="body-xs" sx={{ mb: 0.5 }}>
          Asterisk Host
        </Typography>
        <Input
          fullWidth
          size="sm"
          variant="soft"
          sx={{ mb: 1 }}
          placeholder="Enter Asterisk host"
          value={settings.asterisk_host}
          disabled={true}
          onChange={(e) =>
            onSettingsChange('asterisk_host', e.target.value)
          }
        />
        <Typography level="body-xs" sx={{ mb: 0.5 }}>
          Endpoint
        </Typography>
        <Input
          sx={{ mb: 1 }}
          variant="soft"
          fullWidth
          size="sm"
          placeholder="Enter endpoint (e.g., PJSIP/7000)"
          value={settings.asterisk_number}
          onChange={(e) =>
            onSettingsChange('asterisk_number', e.target.value)
          }
        />
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
          disabled={loading}
          startDecorator={loading ? <CircularProgress size="sm" /> : null}
        >
          {loading ? 'Calling...' : 'Call'}
        </Button>
      </Sheet>
    );
  };

export default AsteriskForm;