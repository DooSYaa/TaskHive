import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSignalR } from '../Context/SignalRContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './workingSpaceChat.css';
import {
  Box,
  Flex,
  Button,
  TextArea,
  ScrollArea,
  Avatar,
  Text,
} from '@radix-ui/themes';

function WorkingSpaceChat() {
  const { connection } = useSignalR();
  const { groupId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipRef = useRef(0);
  const take = 10;
  const [observerElement, setObserverElement] = useState(null);

  const fetchGroupMessages = useCallback(async () => {
    if (loading || !hasMore || !groupId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5292/api/Chat/get-group-messages?groupId=${groupId}&offset=${skipRef.current}&limit=${take}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        },
      );
      if (!response.ok) console.error(response.error);

      const data = await response.json();
      if (data.length > 0) {
        const reverseMessages = data.reverse();
        setMessages(prev => [...reverseMessages, ...prev]);
        skipRef.current += take;
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, groupId, user?.token]);
  useEffect(() => {
    if (!groupId || !observerElement) return;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          fetchGroupMessages();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(observerElement);

    return () => {
      observer.disconnect();
    };
  }, [groupId, hasMore, observerElement, user?.token]);

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    skipRef.current = 0;
  }, [groupId]);

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
    <Flex direction={'column'} flexGrow={'1'} height={'93vh'}>
      <ScrollArea scrollbars={'vertical'} style={{ flexGrow: 1 }}>
        <Box ref={setObserverElement} height={'20px'} width={'100%'}>
          {loading && <p>Loading...</p>}
          {!hasMore && ''}
        </Box>
        <Flex direction={'column'} p={'4'} gap={'2'}>
          {messages.map(msg => {
            const isMine = msg.senderId === user?.id;
            return (
              <Flex
                key={msg.id}
                direction={'column'}
                align={isMine ? 'end' : 'start'}
              >
                <Flex
                  gap={'2'}
                  align={'end'}
                  direction={isMine ? 'row-reverse' : 'row'}
                >
                  <Avatar
                    size={'1'}
                    radius="full"
                    src={`http://localhost:5292/${msg.senderAvatar}`}
                    fallback={msg.senderName[0].toUpperCase()}
                  />
                  <Flex
                    p={'2'}
                    direction={'column'}
                    justify={'center'}
                    align={isMine ? 'end' : 'start'}
                    style={{
                      maxWidth: '400px',
                      backgroundColor: isMine
                        ? 'var(--accent-9)'
                        : 'var(--gray-3)',
                      color: isMine ? 'white' : 'var(--gray-12)',
                      borderRadius: 'var(--radius-3)',
                      borderBottomRightRadius: isMine ? '0' : 'var(--radius-3)',
                      borderBottomLeftRadius: isMine ? 'var(--radius-3)' : '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Text size={'1'} weight={'bold'}>
                      {msg.senderName}
                    </Text>
                    <Text as="p" size="2" style={{ lineHeight: '1.4' }}>
                      {msg.message}
                    </Text>
                  </Flex>
                </Flex>
                <Text size="1" color="gray" mt="1" style={{ fontSize: '10px' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </Text>
              </Flex>
            );
          })}
          <div ref={messagesEndRef} />
        </Flex>
      </ScrollArea>
      <Flex
        justify={'center'}
        p="3"
        style={{ borderTop: '1px solid var(--gray-4)' }}
      >
        <Flex
          direction={'row'}
          justify={'center'}
          align={'center'}
          gap={'3'}
          width={'70%'}
        >
          <TextArea
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default WorkingSpaceChat;
