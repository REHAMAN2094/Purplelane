import ChatBot from "react-chatbotify";

const MyComponent = () => {
  const id = "my-chatbot-id" // if not specified, will auto-generate uuidv4

  const flow = {
    "start": {
        message: "Hello there!",
        path: "end"
    },
    "end": {
        message: "See you, goodbye!"
    }
  }

  return (
    <ChatBot id={id} flow={flow}/>
  );
};