import React from 'react';
import { Box, Typography } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

const readmeContent = `
# Добро пожаловать в приложение

Это окно входа в систему.
Выберите логин и пароль.
и нажмите кнопку "Войти".
либо нажмите кнопку "Зарегистрироваться", если у вас нет аккаунта.

## Новости

- Добавлена возможность регистрации пользователей.
- Добавлена возможность входа в систему.
- Распределенные чаты

## TODO

- Сделать фиксы загрузки чатов и сообщений
- Сделать фиксы отображения в реальном времени
- Пофиксить перебивания сообщений
- Добавить клонирование голоса
- 

`;

const ReadmeLogin: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
           
                padding: 2,
            }}
        >
            
            <Box sx={{ textAlign: 'left', maxWidth: '600px' }}>
                <ReactMarkdown>
                    {readmeContent}
                </ReactMarkdown>
            </Box>
        </Box>
    );
};

export default ReadmeLogin;

