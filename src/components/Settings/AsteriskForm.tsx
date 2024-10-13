import React, { FC } from "react";
import { Typography, Input, Button, Sheet } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";

interface AsteriskFormProps {
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

const AsteriskForm: FC<AsteriskFormProps> = ({
    settings,
    onSettingsChange,
}) => (
    <>
        <Typography color="warning" level="body-sm" fontWeight="bold">
            ASTERISK ONLY
        </Typography>
        {["asterisk_min_audio_length", "asterisk_silence_threshold"].map(
            (setting) => (
                <SliderWithInput
                    key={setting}
                    label={setting.replace("asterisk_", "").replace("_", " ")}
                    inputName={setting}
                    value={settings[setting]}
                    enabled={settings[`${setting}_enabled`]}
                    sliderMin={
                        setting === "asterisk_min_audio_length" ? 0.1 : 1
                    }
                    sliderMax={
                        setting === "asterisk_silence_threshold" ? 20 : undefined
                    }
                    sliderStep={1}
                    onChange={onSettingsChange}
                    onToggleEnabled={(name, enabled) =>
                        onSettingsChange(`${name}_enabled`, enabled)
                    }
                />
            )
        )}
        <Sheet
            color="primary"
            variant="soft"
            sx={{ p: 1, borderRadius: 2 }}
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
                onChange={(e) =>
                    onSettingsChange("asterisk_host", e.target.value)
                }
            />
            <Typography level="body-xs" sx={{ mb: 0.5 }}>
                Number
            </Typography>
            <Input
                sx={{ mb: 1 }}
                variant="soft"
                fullWidth
                size="sm"
                placeholder="Enter number"
                value={settings.asterisk_number}
                onChange={(e) =>
                    onSettingsChange("asterisk_number", e.target.value)
                }
            />
            <Button variant="solid" color="primary" fullWidth>
                Call
            </Button>
        </Sheet>
    </>
);

export default AsteriskForm;