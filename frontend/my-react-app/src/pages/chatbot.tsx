import ChatBot, { Button as RcbButton, useMessages, useTextArea } from "react-chatbotify";
import api from "@/lib/api";
import { useState } from "react";
import { VoiceInput } from "@/components/ui/VoiceInput";

// Wrapper to use hooks inside the ChatBot context
const ChatbotVoiceInput = () => {
    const { setTextAreaValue } = useTextArea();

    return (
        <VoiceInput
            onTranscript={async (text, isFinal) => {
                await setTextAreaValue(text);
                if (isFinal && text.trim().length > 0) {
                    setTimeout(() => {
                        const sendButton = document.querySelector('.rcb-send-button') as HTMLDivElement;
                        if (sendButton) {
                            sendButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                        }
                    }, 200);
                }
            }}
        />
    );
};

const ChatbotComponent = () => {
    const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

    const flow = {
        start: {
            message: "Hello! I am your Digital Village assistant. How can I help you today?",
            path: "user_input"
        },
        user_input: {
            user: true,
            path: "process_response"
        },
        process_response: {
            message: async (params: any) => {
                const userMessage = params.userInput;
                try {
                    const response = await api.post("/chatbot/chat", {
                        message: userMessage,
                        language: "en",
                        history: history
                    });

                    const aiReply = response.data.reply;

                    setHistory(prev => [
                        ...prev,
                        { role: "user", content: userMessage },
                        { role: "model", content: aiReply }
                    ]);

                    return aiReply;
                } catch (error: any) {
                    console.error("Chat Error:", error);
                    if (error.response?.status === 429) {
                        return "I've reached my daily limit for responses. Please try again tomorrow!";
                    }
                    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
                }
            },
            path: "user_input"
        }
    };

    const settings = {
        general: {
            primaryColor: "#6366f1",
            secondaryColor: "#4f46e5",
            showFooter: false,
        },
        header: {
            title: "Digital Village Assistant",
            showAvatar: true,
        },
        chatHistory: {
            storageKey: "pv_chat_history"
        },
        chatInput: {
            buttons: [
                <ChatbotVoiceInput key="voice-input" />,
                RcbButton.SEND_MESSAGE_BUTTON
            ]
        }
    };

    const styles = {
        headerStyle: {
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            color: "#ffffff",
            padding: "15px",
        },
        chatWindowStyle: {
            backgroundColor: "#f8fafc",
        }
    };

    return (
        <div className="relative">
            <ChatBot
                settings={settings}
                flow={flow}
                styles={styles}
            />
        </div>
    );
};

export default ChatbotComponent;
