import React, { FC } from "react";
import { Typography, Textarea, Select, Option, Stack } from "@mui/joy";
import SliderWithInput from "../SliderWithInput";
import SelectLLMModel from "../SelectLLMModel";

interface LLMFormProps {
    settings: Settings;
    onSettingsChange: (name: string, value: number | string) => void;
}

interface Settings {
    model: string;
    system_prompt: string;
    system_prompt_enabled: boolean;
    mirostat: number;
    mirostat_enabled: boolean;
    mirostat_eta: number;
    mirostat_eta_enabled: boolean;
    mirostat_tau: number;
    mirostat_tau_enabled: boolean;
    num_ctx: number;
    num_ctx_enabled: boolean;
    repeat_last_n: number;
    repeat_last_n_enabled: boolean;
    repeat_penalty: number;
    repeat_penalty_enabled: boolean;
    temperature: number;
    temperature_enabled: boolean;
    tfs_z: number;
    tfs_z_enabled: boolean;
    num_predict: number;
    num_predict_enabled: boolean;
    top_k: number;
    top_k_enabled: boolean;
    top_p: number;
    top_p_enabled: boolean;
    min_p: number;
    min_p_enabled: boolean;
}

const LLMForm: FC<LLMFormProps> = ({ settings, onSettingsChange }) => (
    <form>
        <Typography level="body-xs">Selected Model: {settings.model}</Typography>
        <SelectLLMModel
            selectedModel={settings.model}
            onModelChange={(val) => onSettingsChange("model", val)}
        />
        <Typography level="body-xs">Системный промпт</Typography>
        <Textarea
            minRows={4}
            size="sm"
            placeholder="Напишите здесь системный промпт"
            variant="outlined"
            value={settings.system_prompt}
            onChange={(e) =>
                onSettingsChange("system_prompt", e.target.value)
            }
        />
        <SliderWithInput
            label="Mirostat"
            inputName="mirostat"
            value={settings.mirostat}
            enabled={settings.mirostat_enabled}
            onChange={onSettingsChange}
            onToggleEnabled={(name, enabled) =>
                onSettingsChange(`${name}_enabled`, enabled)
            }
            sliderMin={0}
            sliderMax={2}
            sliderStep={1}
        />
        <Select
            value={settings.mirostat}
            size="sm"
            onChange={(e) =>
                onSettingsChange("mirostat", parseInt(e.target.value, 10))
            }
        >
            <Option value={0}>Disabled</Option>
            <Option value={1}>Mirostat</Option>
            <Option value={2}>Mirostat 2.0</Option>
        </Select>
        {[
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
            <SliderWithInput
                key={setting}
                label={setting.replace("", "").replace("_", " ")}
                inputName={setting}
                value={settings[setting]}
                enabled={settings[`${setting}_enabled`]}
                onChange={onSettingsChange}
                onToggleEnabled={(name, enabled) =>
                    onSettingsChange(`${name}_enabled`, enabled)
                }
            />
        ))}
    </form>
);

export default LLMForm;