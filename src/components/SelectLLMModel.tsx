import React, { useEffect, useState } from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import CircularProgress from '@mui/joy/CircularProgress';
import { Stack, Typography } from '@mui/joy';

const SelectLLMModel: React.FC = () => {
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('http://192.168.25.63:11434/api/tags');
                const data = await response.json();
                const modelNames = data.models.map((model: { name: string }) => model.name);  // Extract the model names
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
        setSelectedModel(newValue);
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