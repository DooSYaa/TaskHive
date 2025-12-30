import React, { useEffect, useRef, useState } from 'react';
import Button from '../ButtonComponent/Button';
import { useSignalR } from '../Context/SignalRContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './workingSpaceChat.css';

function WorkingSpaceChat() {
  const { connection } = useSignalR();
  const { groupId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = incomingMessage => {
      setMessages(prev => [...prev, incomingMessage]);
    };
    connection.on('ReceiveGroupMessage', handleReceiveMessage);

    return () => {
      connection.off('ReceiveGroupMessage', handleReceiveMessage);
    };
  }, [connection, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    try {
      if (!message || message.trim() === '') return;
      await connection.invoke('SendGroupMessage', groupId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending: ', error);
    }
  };
  return (
    <div>
      <div ref={messagesEndRef} className="messages h-180 border">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`group-message ${msg.senderName === user.userName ? 'sent' : 'received'}`}
          >
            <div className="border w-full ">{msg.senderName}</div>
            <p className="border">
              {msg.message} <sub></sub>
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-3 border">
        <textarea
          name=""
          id=""
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="border w-3xl resize-none"
        ></textarea>
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}

export default WorkingSpaceChat;
