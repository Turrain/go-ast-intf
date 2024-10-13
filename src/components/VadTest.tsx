import React, { useState, useCallback } from 'react';
import { useMicVAD, utils } from '@ricky0123/vad-react';
import { Badge, IconButton } from '@mui/joy';
import { Mic, MicOff } from '@mui/icons-material';


function VadTest({ onTranscribe }) {
    const [audioList, setAudioList] = useState([]);

    const handleSpeechEnd = useCallback((audio) => {
        const wavBuffer = utils.encodeWAV(audio);

        // Assuming settings is a global or retrieved object with correct properties
        const settings = JSON.stringify({
            'language': 'ru',
            'temperature': 0.2,
            // Add necessary transcription settings as needed
        });

        const formData = new FormData();
        formData.append('audio', new Blob([audio]), 'audio.wav');
        formData.append('settings', settings);

        fetch('http://localhost:8002/complete_transcribe_r', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Transcription result:', data);
            const base64 = utils.arrayBufferToBase64(wavBuffer);
            const url = `data:audio/wav;base64,${base64}`;
            onTranscribe(data.transcription, url);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        const base64 = utils.arrayBufferToBase64(wavBuffer);
        const url = `data:audio/wav;base64,${base64}`;

        setAudioList((prevAudioList) => [url, ...prevAudioList]);
    }, []);

    const vad = useMicVAD({
        onSpeechEnd: handleSpeechEnd,
        ortConfig: (ort) => {
            ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/";
        },
        workletURL: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.18/dist/vad.worklet.bundle.min.js",
        modelURL: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.18/dist/silero_vad.onnx",
    });

    return (
        <div>
            <Badge size='sm' invisible={!vad.userSpeaking} badgeInset="14%" color='danger'>
                <IconButton onClick={vad.toggle} sx={{ p: 0 }}>
                    {vad.listening ? <Mic /> : <MicOff sx={{ color: 'red' }} />}
                </IconButton>
            </Badge>
        </div>
    );
}

const UserSpeaking = React.memo(() => {
    return <span style={{ color: 'green' }}>User is speaking</span>;
});

const UserNotSpeaking = React.memo(() => {
    return <span style={{ color: 'red' }}>User is not speaking</span>;
});

export default VadTest;