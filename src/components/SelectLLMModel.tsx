import React, { useEffect, useState } from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import CircularProgress from '@mui/joy/CircularProgress';
import { Stack, Typography } from '@mui/joy';


interface SelectLLMModelProps {
    selectedModel: string | null;
    onModelChange: (model: string | null) => void;
}

const SelectLLMModel: React.FC<SelectLLMModelProps> = ({ selectedModel, onModelChange }) => {
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('http://82.200.169.182:11434/api/tags');
                const data = await response.json();
                const modelNames = data.models.map((model: { name: string }) => model.name);
                setModels(modelNames);
            } catch (error) {
                console.error('Error fetching models:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleChange = (event: any, newValue: string | null) => {
        onModelChange(newValue);
    };

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <Stack>
                    <Typography level='body-xs'>Select a model:</Typography>
                    <Select
                        size='sm'
                        placeholder="Select a model"
                        value={selectedModel}
                        onChange={handleChange}
                    >
                        {models.map((model) => (
                            <Option key={model} value={model}>
                                {model}
                            </Option>
                        ))}
                    </Select>
                </Stack>
            )}
        </div>
    );
};

export default SelectLLMModel;