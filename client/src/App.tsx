import { useEffect, useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username] = useState(() => "Client" + Math.floor(Math.random() * 1000));
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${data.user}: ${data.message}`]);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() !== '') {
      socket.send(JSON.stringify({
        user: username,
        message: input
      }));  
    setInput('');
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;