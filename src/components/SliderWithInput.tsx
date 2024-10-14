    // Start of Selection
    import React, { useState, useCallback, ChangeEvent, FC, memo } from "react";
    import { Stack, Typography, Switch, Input, Slider } from "@mui/joy";

    type InputVariant = "solid" | "outlined" | "plain";
    type InputSize = "sm" | "md" | "lg";
    type SliderValueLabelDisplay = "auto" | "on" | "off";
    type StackDirection = "row" | "column";

    interface SliderWithInputProps {
        label: string;
        inputWidth?: string;
        inputVariant?: InputVariant;
        inputSize?: InputSize;
        inputType?: "number" | "text" | "password" | "email" | "tel" | "url";
        inputStep?: number;
        inputName: string;
        sliderStep?: number;
        sliderMarks?: boolean;
        sliderMin?: number;
        sliderMax?: number;
        sliderValueLabelDisplay?: SliderValueLabelDisplay;
        stackDirection?: StackDirection;
        stackGap?: number;
        value: number;
        enabled: boolean;
        onChange: (name: string, value: number | string) => void;
        onToggleEnabled: (name: string, enabled: boolean) => void;
    }

    const SliderWithInput: FC<SliderWithInputProps> = memo(
        ({
            label,
            inputWidth = "110px",
            inputVariant = "plain",
            inputSize = "sm",
            inputType = "number",
            inputStep = 0.01,
            inputName,
            sliderStep = 0.1,
            sliderMarks = true,
            sliderMin = -1,
            sliderMax = 1,
            sliderValueLabelDisplay = "auto",
            stackDirection = "row",
            stackGap = 1,
            value,
            enabled,
            onChange,
            onToggleEnabled,
        }) => {
       

            const handleInputChange = useCallback(
                (event: ChangeEvent<HTMLInputElement>) => {
                    if (inputType === "number") {
                        const parsedValue = parseFloat(event.target.value);
                        if (!isNaN(parsedValue)) {
                            onChange(inputName, parsedValue);
                        }
                    } else {
                        onChange(inputName, event.target.value);
                    }
                },
                [onChange, inputName, inputType]
            );

            const handleSliderChange = useCallback(
                (event: Event, newValue: number | number[]) => {
                    if (typeof newValue === "number") {
                        onChange(inputName, newValue);
                    }
                },
                [onChange, inputName]
            );

         

            const handleToggleEnabled = useCallback(
                (event: ChangeEvent<HTMLInputElement>) => {
                    console.log("handleToggleEnabled", event.target.checked);
                    onToggleEnabled(inputName, event.target.checked);
                  
                },
                [onToggleEnabled, inputName]
            );

            return (
                <>
                    <Stack
                        direction="row"
                        gap={1}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ height: "20px", my: 0.75 }}
                    >
                        <Typography level="body-xs">{label}</Typography>
                        <Stack direction="row" gap={0.5} alignItems="center">
                            <Switch
                                checked={enabled}
                                onChange={handleToggleEnabled}
                                size={inputSize}
                            />
                        </Stack>
                    </Stack>
                    {enabled && (
                        <Stack
                            direction={stackDirection}
                            gap={stackGap}
                            sx={{ px: 1, height: "30px" }}
                        >
                            <Input
                                sx={{ width: inputWidth }}
                                variant={inputVariant}
                                size={inputSize}
                                type={inputType}
                                value={value}
                                step={inputStep}
                                name={inputName}
                                onChange={handleInputChange}
                            />
                            <Slider
                                size={inputSize}
                                aria-label="Slider"
                                value={value}
                                step={sliderStep}
                                marks={sliderMarks}
                                min={sliderMin}
                                max={sliderMax}
                                valueLabelDisplay={sliderValueLabelDisplay}
                                onChange={handleSliderChange}
                            />
                        </Stack>
                    )}
                </>
            );
        }
    );

    export default SliderWithInput;