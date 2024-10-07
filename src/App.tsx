import { Box, Button, CssBaseline, CssVarsProvider, FormControl, FormLabel, Input, Select, Sheet, Tab, TabList, TabPanel, Tabs, Option, Typography, Stack, Slider, Textarea } from '@mui/joy'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { ArrowDropDown } from '@mui/icons-material';
import SelectLLMModel from './components/SelectLLMModel';
import ChatPane from './components/ChatPane';


type AbstractComponentProps = {
  label: string;
  inputWidth?: string;
  inputVariant?: 'plain' | 'outlined' | 'filled';
  inputSize?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';
  inputType?: string;
  inputStep?: number;
  inputName?: string;
  sliderStep?: number;
  sliderMarks?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderValueLabelDisplay?: 'off' | 'auto' | 'on';
  stackDirection?: 'row' | 'column';
  stackGap?: number;
  defaultValue?: number;
};

const AbstractComponent: React.FC<AbstractComponentProps> = ({
  label,
  inputWidth = '110px',
  inputVariant = 'plain',
  inputSize = 'sm',
  inputType = 'number',
  inputStep = 0.01,
  inputName = 'default_input_name',
  sliderStep = 0.00000001,
  sliderMarks = true,
  sliderMin = -0.00000005,
  sliderMax = 0.0000001,
  sliderValueLabelDisplay = 'auto',
  stackDirection = 'row',
  stackGap = 1,
  defaultValue = 0.00000005,
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };
  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <>
      <Stack direction='row' gap={1} justifyContent="space-between" sx={{ height: '20px', my: 0.75 }}>
        <Typography level='body-xs'>{label}</Typography>
        <Typography onClick={toggleExpanded} variant="plain" size="sm" sx={{ cursor: "pointer", transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          <ArrowDropDown />
        </Typography>
      </Stack>
      {expanded && (
        <Stack direction={stackDirection} gap={stackGap} sx={{ px: 1, height: '30px' }}>
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
};

function App() {

  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          <Sidebar />
          <Box
            component="main"
            className="MainContent"
            sx={{


              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: '100dvh',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <Sheet
                sx={{
                  height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'column',
                  backgroundColor: 'background.level1',
                }}
              >
                <ChatPane />
              </Sheet>
              <Sheet sx={{ height: '100dvh', width: '350px', }} >
                <Tabs aria-label="Basic tabs" defaultValue={0} size='sm'>
                  <TabList tabFlex="auto">
                    <Tab>STT</Tab>
                    <Tab>TTS</Tab>
                    <Tab>LLM</Tab>
                    <Tab>CON</Tab>
                    <Tab>RAG</Tab>
                  </TabList>
                  <TabPanel value={0}>
                    <b>First</b> tab panel
                  </TabPanel>
                  <TabPanel value={1}>
                    <form>
                      <SelectLLMModel/>
                        <Typography level='body-xs'>Системный промпт</Typography>
                        <Textarea

                          minRows={4}
                          size="sm"
                          placeholder='Напишите здесь системный промпт'
                          variant="outlined"
                        />
                      
                     
                        <Typography level='body-xs'>Mirostat</Typography>
                        <Select defaultValue={0} size='sm'>
                          <Option value={0}>Disabled</Option>
                          <Option value={1}>Mirostat</Option>
                          <Option value={2}>Mirostat 2.0</Option>
                        </Select>
                      
                     
                        <AbstractComponent
                          label="Mirostat Eta"
                          inputName="mirostat_eta"
                          defaultValue={0.1}
                        />
                      
                     
                        <AbstractComponent
                          label="Mirostat Tau"
                          inputName="mirostat_tau"
                          defaultValue={0.1}
                        />
                      
                     
                        <AbstractComponent
                          label="Num Context"
                          inputName="num_ctx"
                          defaultValue={4096}
                        />
                      
                     
                        <AbstractComponent
                          label="Repeat Last N"
                          inputName="repeat_last_n"
                          defaultValue={64}
                        />
                      
                     
                        <AbstractComponent
                          label="Repeat Penalty"
                          inputName="repeat_penalty"
                          defaultValue={1.1}
                        />
                      
                     
                        <AbstractComponent
                          label="Temperature"
                          inputName="temperature"
                          defaultValue={0.7}
                        />
                      
                     
                        <AbstractComponent
                          label="TFS Z"
                          inputName="tfs_z"
                          defaultValue={0.1}
                        />
                      
                     
                        <AbstractComponent
                          label="Num Predict"
                          inputName="num_predict"
                          defaultValue={42}
                        />
                      
                     
                        <AbstractComponent
                          label="Top K"
                          inputName="top_k"
                          defaultValue={40}
                        />
                      
                     
                        <AbstractComponent
                          label="Top P"
                          inputName="top_p"
                          defaultValue={0.9}
                        />
                      
                     
                        <AbstractComponent
                          label="Min P"
                          inputName="min_p"
                          defaultValue={0.05}
                        />
                      
                    </form>
                  </TabPanel>
                  <TabPanel value={2}>
                    <b>Third</b> tab panel
                  </TabPanel>
                  <TabPanel value={3}>
                    еуеы
                  </TabPanel>
                </Tabs>
              </Sheet>
            </Box>
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  )
}

export default App
