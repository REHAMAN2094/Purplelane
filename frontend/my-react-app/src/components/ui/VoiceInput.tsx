import 'regenerator-runtime/runtime';
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import api from '@/lib/api';
import { toast } from 'sonner';

interface VoiceInputProps {
    onTranscript: (text: string, isFinal?: boolean) => void;
    className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className }) => {
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // 🔹 Hook from react-speech-recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // 🔹 Update live text as user speaks
    useEffect(() => {
        if (transcript) {
            onTranscript(transcript, false);
        }
    }, [transcript, onTranscript]);

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    const startRecording = async () => {
        try {
            console.log('Starting Voice Library Listening...');
            resetTranscript();

            // 1. Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // 2. Start library-based live recognition
            SpeechRecognition.startListening({
                continuous: true,
                language: 'en-IN'
            });

            // 3. Start MediaRecorder for high-quality backend pass (Gemini/Whisper-style)
            const types = ['audio/webm', 'audio/mp4', 'audio/wav'];
            const supportedType = types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                console.log('Recording stopped. Processing high-quality audio...');
                const audioBlob = new Blob(chunksRef.current, { type: supportedType });
                await handleUpload(audioBlob, supportedType);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Microphone Error:', err);
            toast.error('Could not access microphone');
        }
    };

    const stopRecording = () => {
        console.log('Stopping Listening...');
        SpeechRecognition.stopListening();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleUpload = async (blob: Blob, mimetype: string) => {
        setIsLoading(true);
        const extension = mimetype.split('/')[1].split(';')[0] || 'webm';
        const formData = new FormData();
        formData.append('file', blob, `recording.${extension}`);

        try {
            const response = await api.post('/chatbot/stt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Final high-quality transcript from Gemini replaces the interim one
            onTranscript(response.data.transcript, true);
        } catch (err) {
            console.error('STT Processing Error:', err);
            // Fallback: the library transcript is already in the input box
            onTranscript(transcript, true);
            toast.info('Session ended. Voice processed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-center ${className || ''}`} style={{ minWidth: '40px' }}>
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            ) : listening ? (
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); stopRecording(); }}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 animate-pulse border-none outline-none cursor-pointer p-0"
                    title="Stop Listening"
                >
                    <Square size={14} />
                </button>
            ) : (
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); startRecording(); }}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-none outline-none cursor-pointer p-0"
                    title="Start Listening"
                >
                    <Mic size={18} />
                </button>
            )}
        </div>
    );
};
