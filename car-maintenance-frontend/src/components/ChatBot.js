// src/components/AutoBot.js
import React, { useState } from 'react';
import { Form, Button, ListGroup, Card } from 'react-bootstrap';
import CustomStep from './CustomStep';

const AutoBot = ({ vehicleId }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! You can ask me when your next service is due.' },
  ]);
  const [input, setInput] = useState('');
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const handleUserInput = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addMessage('user', trimmed);
    setInput('');

    // Handle known intents
    if (trimmed.toLowerCase().includes('service') || trimmed.toLowerCase().includes('reminder')) {
      setAwaitingResponse(true);
      // Placeholder message while waiting
      addMessage('bot', 'Let me check that for you...');
    } else {
      addMessage('bot', "Sorry, I didn't understand that. Ask me about your next service.");
    }
  };

  const handleCustomReply = (text) => {
    setMessages(prev => [
      ...prev.filter(msg => msg.text !== 'Let me check that for you...'),
      { sender: 'bot', text },
    ]);
    setAwaitingResponse(false);
  };

  return (
    <Card style={{ maxWidth: 500, margin: '0 auto', padding: '1rem' }}>
      <Card.Body>
        <ListGroup variant="flush" style={{ height: 300, overflowY: 'auto', marginBottom: '1rem' }}>
          {messages.map((msg, index) => (
            <ListGroup.Item key={index} className={msg.sender === 'user' ? 'text-end' : ''}>
              <strong>{msg.sender === 'bot' ? 'Bot: ' : 'You: '}</strong> {msg.text}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {awaitingResponse && (
          <CustomStep vehicleId={vehicleId} onReply={handleCustomReply} />
        )}

        <Form className="d-flex gap-2" onSubmit={e => { e.preventDefault(); handleUserInput(); }}>
          <Form.Control
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button onClick={handleUserInput}>Send</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AutoBot;
