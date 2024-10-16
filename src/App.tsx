import { Box, Button, CssBaseline, CssVarsProvider, FormControl, FormLabel, Input, Select, Sheet, Tab, TabList, TabPanel, Tabs, Option, Typography, Stack, Slider, Textarea } from '@mui/joy'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { ArrowDropDown } from '@mui/icons-material';
import SelectLLMModel from './components/SelectLLMModel';
import ChatPane from './components/ChatPane';



function App() {

  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          {/* <Sidebar /> */}
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
                  height: { xs: 'calc(100dvh - 10px)', md: '100dvh' },
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'column',
                  backgroundColor: 'background.level1',
                }}
              >
                <ChatPane />
              </Sheet>
              
            </Box>
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  )
}

export default App
