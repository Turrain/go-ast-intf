import React, { FC } from "react";
import { Typography } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";

interface STTFormProps {
    settings: Settings;
    onSettingsChange: (name: string, value: number | string) => void;
}

interface Settings {
    whisper_beam_size: number;
    whisper_beam_size_enabled: boolean;
    whisper_best_of: number;
    whisper_best_of_enabled: boolean;
    whisper_patience: number;
    whisper_patience_enabled: boolean;
    whisper_no_speech_threshold: number;
    whisper_no_speech_threshold_enabled: boolean;
    whisper_temperature: number;
    whisper_temperature_enabled: boolean;
    whisper_hallucination_silence_threshold: number;
    whisper_hallucination_silence_threshold_enabled: boolean;
}

const STTForm: FC<STTFormProps> = ({ settings, onSettingsChange }) => (
    <>
        <Typography color="warning" level="body-sm" fontWeight="bold">
            FASTER-WHISPER-LARGE-V3
        </Typography>
        {[
            "whisper_beam_size",
            "whisper_best_of",
            "whisper_patience",
            "whisper_no_speech_threshold",
            "whisper_temperature",
            "whisper_hallucination_silence_threshold",
        ].map((setting) => (
            <SliderWithInput
                key={setting}
                label={setting.replace("whisper_", "").replace("_", " ")}
                inputName={setting}
                value={settings[setting]}
                enabled={settings[`${setting}_enabled`]}
                sliderMin={1}
                sliderMax={10}
                sliderStep={1}
                onChange={onSettingsChange}
                onToggleEnabled={(name, enabled) =>
                    onSettingsChange(`${name}_enabled`, enabled)
                }
            />
        ))}
    </>
);

export default STTForm;