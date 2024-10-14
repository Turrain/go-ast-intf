import React, { FC } from "react";
import { Typography } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import { STTSettings } from "../../store/ChatAPI";

interface STTFormProps {
    settings: Settings;
    onSettingsChange: (name: string, value: number | string) => void;
}
interface Settings {
    beam_size: number;
    beam_size_enabled: boolean;
    best_of: number;
    best_of_enabled: boolean;
    patience: number;
    patience_enabled: boolean;
    no_speech_threshold: number;
    no_speech_threshold_enabled: boolean;
    temperature: number;
    temperature_enabled: boolean;
    hallucination_silence_threshold: number;
    hallucination_silence_threshold_enabled: boolean;
}

const STTForm: FC<STTFormProps> = ({ settings, onSettingsChange }) => (
    <>
        <Typography color="warning" level="body-sm" fontWeight="bold">
            FASTER-WHISPER-LARGE-V3
        </Typography>
        {[
            "beam_size",
            "best_of",
            "patience",
            "no_speech_threshold",
            "temperature",
            "hallucination_silence_threshold",
        ].map((setting) => (
            <SliderWithInput
                key={setting}
                label={setting.replace("", "").replace("_", " ")}
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