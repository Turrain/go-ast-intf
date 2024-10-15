import React, { FC } from "react";
import { Typography, Textarea, Box, Button, Switch, Tooltip } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import SelectLLMModel from "../SelectLLMModel";
import { LLMSettings } from "../../types/types";
import { InfoOutlined } from "@mui/icons-material";

interface LLMFormProps {
    settings: LLMSettings;
    onSettingsChange: (name: string, value: number | string | null) => void;
}

const LLMForm: FC<LLMFormProps> = ({ settings, onSettingsChange }) => (
    <form>
        <Typography level="body-xs" sx={{ mb: 1 }}>Selected Model: {settings.model || "Default Model"}</Typography>
        <SelectLLMModel
            selectedModel={settings.model}
            onModelChange={(val) => onSettingsChange("model", val)}
        />
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%',  }}>
                <Typography sx={{ flex: 1 }} level="body-xs">System Prompt</Typography>
                <Switch
                    size="sm"
                    checked={settings.system_prompt !== null}
                    onChange={(e) => onSettingsChange("system_prompt", e.target.checked ? "You are an assistant." : null)}
                    sx={{ ml: 2 }}
                />
                <Tooltip arrow color="primary" title={"System Prompt"} placement="top-start">
                    <InfoOutlined
                        sx={{
                            fontSize: 'small',
                            ml: 1,
                            color: 'text.secondary',
                            cursor: 'help'
                        }}
                    />
                </Tooltip>
            </Box>
            {settings.system_prompt !== null && (
                <Textarea
                    minRows={4}
                    size="sm"
                    placeholder="Enter system prompt here"
                    variant="outlined"
                    maxRows={10}
                    value={settings.system_prompt}
                    onChange={(e) =>
                        onSettingsChange("system_prompt", e.target.value)
                    }
                    sx={{ mb: 2 }}
                />
            ) }
        </Box>
        {[
            "mirostat",
            "mirostat_eta",
            "mirostat_tau",
            "num_ctx",
            "repeat_last_n",
            "repeat_penalty",
            "temperature",
            "tfs_z",
            "num_predict",
            "top_k",
            "top_p",
            "min_p",
        ].map((setting) => (
            <Box key={setting} sx={{ mb: 1, width: '100%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>


                <SliderWithInput
                    label={setting.replace("_", " ").toUpperCase()}
                    inputName={setting}
                    tooltip={getTooltip(setting)}
                    value={settings[setting] as number}
                    enabled={settings[setting] !== null}
                    sliderMin={getSliderMin(setting)}
                    sliderMax={getSliderMax(setting)}
                    sliderStep={getSliderStep(setting)}
                    onChange={(name, value) => onSettingsChange(name, value)}
                    onToggleEnabled={(name, enabled) => onSettingsChange(name, enabled ? getSliderMin(setting) : null)}
                />

            </Box>
        ))}
    </form>
);

// Utility functions
const getSliderMin = (name: string): number => {
    const mins: { [key: string]: number } = {
        mirostat: 0,
        mirostat_eta: 0,
        mirostat_tau: 0,
        num_ctx: 0,
        repeat_last_n: 0,
        repeat_penalty: 0,
        temperature: 0,
        tfs_z: 0,
        num_predict: 0,
        top_k: 0,
        top_p: 0,
        min_p: 0,
    };
    return mins[name] ?? 0;
};
const getTooltip = (name: string): string => {
    const tooltips: { [key: string]: string } = {
        mirostat: "Миростат: Алгоритм динамической регулировки температуры",
        mirostat_eta: "Миростат Эта: Скорость обучения для алгоритма миростат",
        mirostat_tau: "Миростат Тау: Целевая энтропия для алгоритма миростат",
        num_ctx: "Размер контекста: Количество токенов для рассмотрения",
        repeat_last_n: "Повтор последних N: Количество токенов для проверки повторов",
        repeat_penalty: "Штраф за повтор: Снижает вероятность повторения текста",
        temperature: "Температура: Контролирует случайность вывода",
        tfs_z: "TFS Z: Порог для хвостового свободного сэмплирования",
        num_predict: "Количество предсказаний: Максимальное число генерируемых токенов",
        top_k: "Top K: Ограничивает выбор наиболее вероятными K токенами",
        top_p: "Top P: Выбирает из наиболее вероятных токенов с суммарной вероятностью P",
        min_p: "Min P: Минимальная вероятность для рассмотрения токена",
    };
    return tooltips[name] ?? "Нет описания";
};

const getSliderMax = (name: string): number => {
    const maxs: { [key: string]: number } = {
        mirostat: 5,
        mirostat_eta: 1,
        mirostat_tau: 1,
        num_ctx: 4096,
        repeat_last_n: 100,
        repeat_penalty: 2,
        temperature: 1,
        tfs_z: 2,
        num_predict: 500,
        top_k: 100,
        top_p: 1,
        min_p: 1,
    };
    return maxs[name] ?? 10;
};

const getSliderStep = (name: string): number => {
    const steps: { [key: string]: number } = {
        mirostat: 1,
        mirostat_eta: 0.1,
        mirostat_tau: 0.1,
        num_ctx: 100,
        repeat_last_n: 10,
        repeat_penalty: 0.1,
        temperature: 0.1,
        tfs_z: 0.1,
        num_predict: 50,
        top_k: 10,
        top_p: 0.1,
        min_p: 0.1,
    };
    return steps[name] ?? 1;
};

export default LLMForm;