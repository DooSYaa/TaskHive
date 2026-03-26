import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import './chat.css';
import {
  Flex,
  Text,
  Box,
  TextArea,
  Button,
  Avatar,
  ScrollArea,
  Heading,
  Separator,
} from '@radix-ui/themes';
import { useSignalR } from '../Context/SignalRContext.jsx';

export default function Chat() {
  const { user } = useAuth();
  const { connection } = useSignalR();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipRef = useRef(0);
  const take = 10;
  const [observerElement, setObserverElement] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5292/api/Friend/getFriends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setFriends(data);
        console.log('fetched friends');
        console.log(data);
      })
      .catch(err => {
        console.log('Error getting friends', err);
        setFriends([]);
      });
  }, [user]);

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    skipRef.current = 0;
  }, [selectedFriend?.id]);

  const fetchPrivateMessages = useCallback(async () => {
    if (loading || !hasMore || !selectedFriend) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5292/api/Chat/get-private-chat-messages?friendId=${selectedFriend.id}&offset=${skipRef.current}&limit=${take}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        },
      );
      if (!response.ok) {
        console.error('Error getting private-chat-messages');
      }
      const data = await response.json();
      if (data.length > 0) {
        const reverseMessages = data.reverse();
        setMessages(prev => [...reverseMessages, ...prev]);
        skipRef.current += take;
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedFriend, loading, hasMore]);

  useEffect(() => {
    if (!selectedFriend || !observerElement) return;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          fetchPrivateMessages();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(observerElement);

    return () => {
      observer.disconnect();
    };
  }, [selectedFriend, observerElement]);

  useEffect(() => {
    if (!connection) return;

    const handleReceivePrivateMessage = incomingMessage => {
      if (
        incomingMessage.senderId === selectedFriend?.id ||
        incomingMessage.senderId === user?.id
      ) {
        setMessages(prev => [...prev, incomingMessage]);
      }
    };
    connection.on('ReceivePrivateMessage', handleReceivePrivateMessage);

    return () => {
      connection.off('ReceivePrivateMessage', handleReceivePrivateMessage);
    };
  }, [selectedFriend, connection, user?.token]);
  useEffect(() => {
    const isInitialLoad = skipRef.current === take; // Если загружена только первая порция
    const isLiveMessage =
      messages.length > 0 && !loading && skipRef.current > take; // Новое live-сообщение

    if (isInitialLoad || isLiveMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, loading]);
  const sendPrivateMessage = async () => {
    try {
      if (!connection || connection.state !== 'Connected') {
        console.error(
          'SignalR not connected. Actucal status:',
          connection?.state,
        );
        return;
      }
      if (!message || message.trim() === '') return;
      console.log(
        'Sending message: ',
        message,
        ' to friend: ',
        selectedFriend.id,
      );
      await connection.invoke('SendPrivateMessage', selectedFriend.id, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };
  return (
    <Flex
      direction="row"
      overflow="hidden"
      height="90vh"
      className="main-chat-container"
      style={{
        backgroundColor: 'var(--gray-1)',
        border: '1px solid var(--gray-4)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Flex
        direction="column"
        width="300px"
        style={{ borderRight: '1px solid var(--gray-4)' }}
      >
        <Box p="3">
          <Heading size="3">Friends</Heading>
        </Box>
        <Separator size="4" />
        <ScrollArea scrollbars="vertical">
          <Flex direction="column" p="2" gap="1">
            {friends.length > 0 ? (
              friends.map(friend => (
                <Box
                  key={friend.id}
                  p="2"
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-2)',
                    backgroundColor:
                      selectedFriend.userName === friend.userName
                        ? 'var(--accent-3)'
                        : 'transparent',
                  }}
                  onClick={() => setSelectedFriend(friend)}
                  className="friend-item-hover" // Добавь в CSS hover: var(--gray-3)
                >
                  <Flex align="center" gap="2">
                    <Avatar
                      size="1"
                      fallback={friend.userName[0].toUpperCase()}
                      radius="full"
                    />
                    <Text
                      size="2"
                      weight={
                        selectedFriend?.id === friend.id ? 'bold' : 'regular'
                      }
                    >
                      {friend.userName}
                    </Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text align="center" color="gray" p="4">
                No friends found :(
              </Text>
            )}
          </Flex>
        </ScrollArea>
      </Flex>

      {selectedFriend ? (
        <Flex direction="column" flexGrow="1" height="100%">
          <Box p="3" style={{ borderBottom: '1px solid var(--gray-4)' }}>
            <Text weight="bold">{selectedFriend.userName}</Text>
          </Box>

          <ScrollArea scrollbars="vertical" style={{ flexGrow: 1 }}>
            <Box ref={setObserverElement} height={'20px'} width={'100%'}>
              {loading && <p>Loading...</p>}
              {!hasMore && ''}
            </Box>
            <Flex direction="column" p="4" gap="2">
              {messages?.map(msg => {
                console.log('Rendering message: ', msg);
                const isMine = msg.senderId === user?.id;
                return (
                  <Flex
                    key={msg.id}
                    direction="column"
                    align={isMine ? 'end' : 'start'}
                  >
                    <Flex
                      gap="2"
                      align="end"
                      direction={isMine ? 'row-reverse' : 'row'}
                    >
                      <Avatar
                        size="2"
                        radius="full"
                        src={`http://localhost:5292/${msg.senderAvatar}`}
                        fallback={msg.senderName[0].toUpperCase()}
                        color={isMine ? 'indigo' : 'gray'}
                      />
                      <Box
                        p="3"
                        style={{
                          maxWidth: '400px',
                          backgroundColor: isMine
                            ? 'var(--accent-9)'
                            : 'var(--gray-3)',
                          color: isMine ? 'white' : 'var(--gray-12)',
                          borderRadius: 'var(--radius-3)',
                          borderBottomRightRadius: isMine
                            ? '0'
                            : 'var(--radius-3)',
                          borderBottomLeftRadius: isMine
                            ? 'var(--radius-3)'
                            : '0',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        <Text as="p" size="2" style={{ lineHeight: '1.4' }}>
                          {msg.message}
                        </Text>
                      </Box>
                    </Flex>
                    <Text
                      size="1"
                      color="gray"
                      mt="1"
                      style={{ fontSize: '10px' }}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                );
              })}
              <div ref={messagesEndRef} />
              {/* Автоскролл будет цепляться сюда */}
            </Flex>
          </ScrollArea>

          {/* Инпут чата */}
          <Box p="3" style={{ borderTop: '1px solid var(--gray-4)' }}>
            <Flex gap="2" align="center">
              <TextArea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flexGrow: 1, minHeight: '40px' }}
              />
              <Button onClick={sendPrivateMessage} size="2">
                Send
              </Button>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex align="center" justify="center" flexGrow="1">
          <Text color="gray">Select a friend to start chatting</Text>
        </Flex>
      )}
    </Flex>
  );
}
