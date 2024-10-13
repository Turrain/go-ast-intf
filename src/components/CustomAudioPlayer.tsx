import React, { useState, useCallback, useRef, FC } from "react";
import { Stack, IconButton, Slider } from "@mui/joy";
import { Pause, PlayArrow } from "@mui/icons-material";

interface CustomAudioPlayerProps {
    src: string;
}

const CustomAudioPlayer: FC<CustomAudioPlayerProps> = React.memo(({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const togglePlayPause = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying((prev) => !prev);
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    }, []);

    const handleSliderChange = useCallback(
        (event: Event, newValue: number | number[]) => {
            if (audioRef.current && typeof newValue === "number") {
                audioRef.current.currentTime = newValue;
                setCurrentTime(newValue);
            }
        },
        []
    );

    return (
        <Stack direction="row" sx={{ px: 1, gap: 1 }}>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: "none" }}
            />
            <IconButton onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Slider
                sx={{ minWidth: "100px" }}
                size="sm"
                variant="solid"
                value={currentTime}
                max={duration}
                onChange={handleSliderChange}
                aria-labelledby="audio-slider"
            />
        </Stack>
    );
});

export default CustomAudioPlayer;