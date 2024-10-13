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
    llm_system_prompt: string;
    llm_system_prompt_enabled: boolean;
    llm_mirostat: number;
    llm_mirostat_enabled: boolean;
    llm_mirostat_eta: number;
    llm_mirostat_eta_enabled: boolean;
    llm_mirostat_tau: number;
    llm_mirostat_tau_enabled: boolean;
    llm_num_ctx: number;
    llm_num_ctx_enabled: boolean;
    llm_repeat_last_n: number;
    llm_repeat_last_n_enabled: boolean;
    llm_repeat_penalty: number;
    llm_repeat_penalty_enabled: boolean;
    llm_temperature: number;
    llm_temperature_enabled: boolean;
    llm_tfs_z: number;
    llm_tfs_z_enabled: boolean;
    llm_num_predict: number;
    llm_num_predict_enabled: boolean;
    llm_top_k: number;
    llm_top_k_enabled: boolean;
    llm_top_p: number;
    llm_top_p_enabled: boolean;
    llm_min_p: number;
    llm_min_p_enabled: boolean;
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
            value={settings.llm_system_prompt}
            onChange={(e) =>
                onSettingsChange("llm_system_prompt", e.target.value)
            }
        />
        <SliderWithInput
            label="Mirostat"
            inputName="llm_mirostat"
            value={settings.llm_mirostat}
            enabled={settings.llm_mirostat_enabled}
            onChange={onSettingsChange}
            onToggleEnabled={(name, enabled) =>
                onSettingsChange(`${name}_enabled`, enabled)
            }
            sliderMin={0}
            sliderMax={2}
            sliderStep={1}
        />
        <Select
            value={settings.llm_mirostat}
            size="sm"
            onChange={(e) =>
                onSettingsChange("llm_mirostat", parseInt(e.target.value, 10))
            }
        >
            <Option value={0}>Disabled</Option>
            <Option value={1}>Mirostat</Option>
            <Option value={2}>Mirostat 2.0</Option>
        </Select>
        {[
            "llm_mirostat_eta",
            "llm_mirostat_tau",
            "llm_num_ctx",
            "llm_repeat_last_n",
            "llm_repeat_penalty",
            "llm_temperature",
            "llm_tfs_z",
            "llm_num_predict",
            "llm_top_k",
            "llm_top_p",
            "llm_min_p",
        ].map((setting) => (
            <SliderWithInput
                key={setting}
                label={setting.replace("llm_", "").replace("_", " ")}
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