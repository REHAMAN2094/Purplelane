import ChatBot from "react-chatbotify";
import api from "@/lib/api";
import { useState } from "react";
import { VoiceInput } from "@/components/ui/VoiceInput";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ChatbotComponent = () => {
    const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

    const flow = {
        start: {
            message: "Hello! I am your Digital Village assistant. How can I help you today?",
            path: "process_input"
        },
        process_input: {
            transition: { duration: 0 },
            chatDisabled: false,
            user: true,
            path: async (params: any) => {
                const userMessage = params.userInput;
                try {
                    const response = await api.post("/chatbot/chat", {
                        message: userMessage,
                        language: "en",
                        history: history
                    });

                    const aiReply = response.data.reply;
                    params.injectMessage(aiReply);

                    // Update history
                    setHistory(prev => [
                        ...prev,
                        { role: "user", content: userMessage },
                        { role: "model", content: aiReply }
                    ]);

                    return "process_input";
                } catch (error) {
                    params.injectMessage("I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.");
                    return "process_input";
                }
            }
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
            {/* Custom Voice Input Trigger */}
            <div className="fixed bottom-24 right-6 z-[9999]">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg bg-indigo-600 hover:bg-indigo-700">
                            <Mic className="h-6 w-6 text-white" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" side="left">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2">Click to speak:</span>
                            <VoiceInput
                                onTranscript={(text) => {
                                    // We need to find the chat input and set its value
                                    const input = document.querySelector(".rcb-chat-input") as HTMLInputElement;
                                    if (input) {
                                        input.value = text;
                                        // Trigger change event for react-chatbotify to pick it up
                                        const event = new Event('input', { bubbles: true });
                                        input.dispatchEvent(event);
                                        input.focus();
                                    }
                                }}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default ChatbotComponent;
