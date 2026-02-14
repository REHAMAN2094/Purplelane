import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from './button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                await handleUpload(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            toast.error('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleUpload = async (blob: Blob) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        try {
            const response = await api.post('/chatbot/stt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onTranscript(response.data.transcript);
        } catch (err) {
            console.error('STT Error:', err);
            toast.error('Failed to process voice input');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={className}>
            {isLoading ? (
                <Button variant="ghost" size="icon" disabled className="animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </Button>
            ) : isRecording ? (
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={stopRecording}
                    type="button"
                    className="rounded-full animate-pulse"
                >
                    <Square className="h-4 w-4" />
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={startRecording}
                    type="button"
                    className="rounded-full hover:bg-primary hover:text-white transition-all"
                >
                    <Mic className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
