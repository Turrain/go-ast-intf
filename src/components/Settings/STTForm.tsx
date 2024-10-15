import React, { FC } from "react";
import { Typography, Box, Button, Tooltip } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import { STTSettings } from "../../types/types";
import { InfoOutlined } from "@mui/icons-material";

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
                    tooltip={getTooltip(setting)}
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
        no_speech_threshold: 0,
        temperature: 0,
        hallucination_silence_threshold: 0,
    };
    return mins[name] ?? 0;
};

const getSliderMax = (name: string): number => {
    const maxs: { [key: string]: number } = {
        beam_size: 10,
        best_of: 10,
        patience: 10,
        no_speech_threshold: 1,
        temperature: 1,
        hallucination_silence_threshold: 1,
    };
    return maxs[name] ?? 10;
};

const getSliderStep = (name: string): number => {
    const steps: { [key: string]: number } = {
        beam_size: 1,
        best_of: 1,
        patience: 0.1,
        no_speech_threshold: 0.01,
        temperature: 0.2,
        hallucination_silence_threshold: 0.01,
    };
    return steps[name] ?? 0.1;
};

const getTooltip = (name: string): string => {
    const tooltips: { [key: string]: string } = {
        beam_size: "Размер луча: Количество лучей для лучевого поиска",
        best_of: "Лучший из: Количество лучших последовательностей для сохранения",
        patience: "Терпение: Контролирует, когда прекратить поиск",
        no_speech_threshold: "Порог отсутствия речи: Продолжительность ожидания перед остановкой",
        temperature: "Температура: Контролирует случайность в предсказаниях",
        hallucination_silence_threshold: "Порог тишины галлюцинаций: Порог для обнаружения галлюцинаций",
    };
    return tooltips[name] ?? "Описание недоступно";
};

const valueToDisable = (value: number | null): boolean => {
    return value === null;
};

export default STTForm;