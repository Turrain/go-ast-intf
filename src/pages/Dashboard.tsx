import { CssVarsProvider, CssBaseline, Box, Sheet } from '@mui/joy';
import React from 'react';
import ChatPane from '../components/ChatPane';



const Dashboard: React.FC = () => {
    
    return (
        <>
        
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
      
      </>
    );
};

export default Dashboard;