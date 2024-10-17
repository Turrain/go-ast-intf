import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { Box, IconButton, Typography, Stack, Button, Divider, FormControl, FormLabel, Input, Checkbox, tabClasses, TabList, Tab, Tabs, TabPanel } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';



const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginUser, registerUser, error, user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser( email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <Box>
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                {user?.email}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>


                        </Box>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >

                        <Tabs aria-label="Settings Tabs" size="sm" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
                            <TabList disableUnderline={true} tabFlex="auto" sx={{
                                mt: 2,
                                p: 0.5,
                                gap: 0.5,
                                borderRadius: 'xl',
                                bgcolor: 'background.level1',
                                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                    boxShadow: 'sm',
                                    bgcolor: 'background.surface',
                                },
                            }}>
                                <Tab disableIndicator>Войти</Tab>
                                <Tab disableIndicator>Зарегистрироваться</Tab>

                                {/* Add more tabs if necessary */}
                            </TabList>
                            <TabPanel value={0}>
                                <Stack sx={{ gap: 4, mt: 2 }}>
                                   
                                        <FormControl required>
                                            <FormLabel>Email</FormLabel>
                                            <Input value={email}
                                                onChange={(e) => setEmail(e.target.value)} sx={{ boxShadow: 'sm' }} variant='plain' type="email" name="email" />
                                        </FormControl>
                                        <FormControl required>
                                            <FormLabel>Password</FormLabel>
                                            <Input value={password}
                                                onChange={(e) => setPassword(e.target.value)} sx={{ boxShadow: 'sm' }} variant='plain' type="password" name="password" />
                                        </FormControl>
                                        <Stack sx={{ gap: 4, mt: 2 }}>

                                            <Button onClick={handleSubmit} fullWidth>
                                                Войти
                                            </Button>
                                        </Stack>
                                  
                                </Stack>
                            </TabPanel>
                            <TabPanel value={1}>
                                <Stack sx={{ gap: 4, mt: 2 }}>
                                   
                                        <FormControl required>
                                            <FormLabel>Email</FormLabel>
                                            <Input value={email}
                                                onChange={(e) => setEmail(e.target.value)} variant='plain' type="email" name="email" />
                                        </FormControl>
                                        <FormControl required>
                                            <FormLabel>Password</FormLabel>
                                            <Input value={password}
                                                onChange={(e) => setPassword(e.target.value)} variant='plain' type="password" name="password" />
                                        </FormControl>
                                        <Stack sx={{ gap: 4, mt: 2 }}>

                                            <Button onClick={handleRegister} fullWidth>
                                                Зарегистрироваться
                                            </Button>
                                        </Stack>
                                    
                                </Stack>
                            </TabPanel>
                        </Tabs>

                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                            © Лехич {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
                    },
                })}
            />
        </Box>
    );
};

export default Login;
