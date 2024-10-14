import React, { FC } from "react";
import { Typography, Box, Button } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import { STTSettings } from "../../types/types";

interface STTFormProps {
    settings: STTSettings;
    onSettingsChange: (name: string, value: number | null) => void;
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
            <Box key={setting} sx={{ mb: 1 }}>
                <SliderWithInput
                    label={setting.replace("_", " ").toUpperCase()}
                    inputName={setting}
                    value={settings[setting] as number}
                    enabled={settings[setting] !== null}
                    sliderMin={getSliderMin(setting)}
                    sliderMax={getSliderMax(setting)}
                    sliderStep={getSliderStep(setting)}
                    onChange={(name, value) => onSettingsChange(name, value as number)}
                    onToggleEnabled={(name, enabled) => onSettingsChange(name, enabled ? getSliderMin(setting) : null)}
                />
            </Box>
        ))}
    </>
);

// Utility functions
const getSliderMin = (name: string): number => {
    const mins: { [key: string]: number } = {
        beam_size: 1,
        best_of: 1,
        patience: 1,
        no_speech_threshold: 1,
        temperature: 1,
        hallucination_silence_threshold: 1,
    };
    return mins[name] ?? 0;
};

const getSliderMax = (name: string): number => {
    const maxs: { [key: string]: number } = {
        beam_size: 10,
        best_of: 10,
        patience: 10,
        no_speech_threshold: 10,
        temperature: 10,
        hallucination_silence_threshold: 10,
    };
    return maxs[name] ?? 10;
};

const getSliderStep = (name: string): number => {
    return 1; // Assuming all sliders have a step of 1
};

const valueToDisable = (value: number | null): boolean => {
    return value === null;
};

export default STTForm;