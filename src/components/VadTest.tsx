import React, { useState, useCallback } from 'react';
import { useMicVAD, utils } from '@ricky0123/vad-react';

function VadTest() {
    const [audioList, setAudioList] = useState([]);

    const handleSpeechEnd = useCallback((audio) => {
        const wavBuffer = utils.encodeWAV(audio);
        const base64 = utils.arrayBufferToBase64(wavBuffer);
        const url = `data:audio/wav;base64,${base64}`;

        setAudioList((prevAudioList) => [url, ...prevAudioList]);  // Functional update
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
            <h1>Demo of @ricky0123/vad-react</h1>
            <button onClick={vad.toggle}>Toggle VAD</button>

            <div>{vad.listening ? 'VAD is running' : 'VAD is NOT running'}</div>

            {vad.userSpeaking ? <UserSpeaking /> : <UserNotSpeaking />}

            <ol id="playlist">
                {audioList.map((audioURL, index) => (
                    <li key={`${audioURL}-${index}`}>
                        <audio controls src={audioURL} />
                    </li>
                ))}
            </ol>
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