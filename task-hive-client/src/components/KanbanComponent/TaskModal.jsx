import { Cross2Icon } from '@radix-ui/react-icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  ScrollArea,
  Separator,
  Text,
  Dialog,
  TextArea,
} from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSignalR } from '../Context/SignalRContext';
import { useAuth } from '../Context/AuthContext';
import CalendarComponent from '../ModalComponents/Calendar.jsx';
import { useParams } from 'react-router-dom';
import Users from '../ModalComponents/Users.jsx';
import Mark from '../ModalComponents/Mark.jsx';
import Priority from '../ModalComponents/Priority.jsx';
import DescriptionEditor from '../ModalComponents/DescriptionEditor.jsx';

function TaskModal({
  card,
  isExpandedCard,
  setIsExpandedCard,
  date,
  onDateUpdate,
  selectedUser,
  onSelectUser,
  onAssignUser,
  activeMarkIds,
  onToggleMark,
  priority,
  setPriority,
  onPriorityUpdate,
}) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const { kanbanId } = useParams();
  const { connection } = useSignalR();
  const commentEndRef = useRef(null);
  const skipRef = useRef(0);
  const take = 10;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [observerElement, setObserverElement] = useState(null);

  useEffect(() => {
    setComments([]); // Очищаем старые комменты при смене ID
    setHasMore(true);
    skipRef.current = 0;
  }, [card?.id]);

  useEffect(() => {
    if (!isExpandedCard || !observerElement) return;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          fetchComments();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(observerElement);

    return () => {
      observer.disconnect();
    };
  }, [isExpandedCard, observerElement]);

  const fetchComments = useCallback(async () => {
    if (loading || !hasMore || !card?.id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5292/api/Chat/get-messages?offset=${skipRef.current}&limit=${take}&taskId=${card?.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      if (!response.ok) {
        console.error('Error fetching messages', response.status);
      }
      console.log('successfully');
      const data = await response.json();
      console.log('data');
      console.log(data);
      if (data.length > 0) {
        setComments(prev => [...prev, ...data]);
        skipRef.current += take;
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  }, [card?.id, loading, hasMore]);

  // useEffect(() => {
  //   commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [comments]);

  useEffect(() => {
    if (!connection) return;
    const handleReceiveComment = (cardId, commentData) => {
      if (cardId !== card?.id) return;
      console.log('Tut OK!')
      console.log(commentData)
      const newComment = {
        cardId,
        senderId: commentData.senderId,
        senderName: commentData.senderName,
        senderAvatar: commentData.senderAvatar,
        message: commentData.message,
        createdAt: commentData.createdAt,
      };
      setComments(prev => [newComment, ...prev]);
    };
    connection.on('ReceiveComment', handleReceiveComment);
    return () => {
      connection.off('ReceiveComment', handleReceiveComment);
    };
  }, [connection, card?.id]);

  useEffect(() => {
    const join = () => {
      if (connection.state === 'Connected' && card?.id) {
        try {
          connection.invoke('JoinGroup', card?.id);
        } catch (error) {
          console.error('Join group error:', error);
        }
      }
    };
    join();
    return () => {
      if (connection.state === 'Connected' && card?.id) {
        console.log('leaving trying')
        connection
          .invoke('LeaveGroup', card.id)
          .catch(err => console.error('Error leaving group:', err));
        console.log('leaving success')
      }
      console.log('leaving failed')
    };
  }, [connection, card?.id]);

  const sendComment = async () => {
    if (!connection || connection.state !== 'Connected') {
      console.error(
        'SignalR not connected. Actucal status:',
        connection?.state,
      );
      return;
    }
    if (!comment || comment.trim() === '') return;
    try {
      console.log('trying send comment', card.id, comment);
      console.log(connection.state);
      await connection.invoke('SendComment', card.id, comment);
      setComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  return (
    <Dialog.Root open={isExpandedCard} onOpenChange={setIsExpandedCard}>
      <Dialog.Content maxWidth={'1200px'} maxHeight={'93vh'}>
        <Flex justify={'end'} m={'1'}>
          <IconButton onClick={() => setIsExpandedCard(false)}>
            <Cross2Icon />
          </IconButton>
        </Flex>
        <Box width={'100%'} my={'2'}>
          <Separator size={'4'} orientation={'horizontal'} />
        </Box>
        <Flex>
          <Flex
            direction={'column'}
            flexGrow={'1'}
            flexShrink={'1'}
            flexBasis={'0'}
            gap={'2'}
          >
            <Box>
              <Text>{card ? card.title : null}</Text>
            </Box>
            <Flex justify={'center'} gap={'2'}>
              <CalendarComponent
                date={date}
                onDateUpdate={onDateUpdate}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card?.id}
              />
              <Users
                setSelectedUser={onSelectUser}
                onAssignUser={onAssignUser}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card?.id}
              />
              <Mark
                activeMarksIds={activeMarkIds}
                onToggleMark={onToggleMark}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card?.id}
              />
              <Priority
                priority={priority}
                setPriority={setPriority}
                onPriorityUpdate={onPriorityUpdate}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card?.id}
              />
            </Flex>
            <Flex direction={'column'} gap={'2'}>
              <Box>
                {date && (
                  <Flex direction={'column'} gap={'2'} p={'1'}>
                    <Text weight={'bold'}>Term</Text>
                    {new Date(date).toLocaleDateString()}
                  </Flex>
                )}
              </Box>
              <Box>
                {selectedUser && (
                  <Flex direction={'column'} gap={'2'} p={'1'}>
                    <Text weight={'bold'}>Assigned User</Text>
                    <Flex align={'center'} gap={'2'}>
                      <Avatar
                        fallback={selectedUser.userName[0]}
                        radius={'full'}
                        size={'2'}
                      />
                      {selectedUser.userName}
                    </Flex>
                  </Flex>
                )}
              </Box>
              <Box>
                {activeMarkIds?.length !== 0 && (
                  <Flex direction={'column'} gap={'2'} p={'1'}>
                    <Text size={'3'} weight={'bold'}>
                      Marks
                    </Text>
                    <Flex gap={'1'} wrap={'wrap'}>
                      {activeMarkIds.map(mark => (
                        <Box
                          p={'4px'}
                          style={{
                            backgroundColor: `var(--${mark.hexColor}-9`,
                            borderRadius: '4px',
                          }}
                          key={mark.id}
                        >
                          {mark.markName === '' ? 'No name' : mark.markName}
                        </Box>
                      ))}
                    </Flex>
                  </Flex>
                )}
              </Box>
            </Flex>
            <Box><DescriptionEditor /></Box>
          </Flex>
          <Flex
            flexGrow={'1'}
            flexShrink={'1'}
            flexBasis={'0'}
            direction={'column'}
          >
            <Text>Comments</Text>
            <Flex direction={'column'} gap={'2'}>
              <Flex justify={'center'} align={'center'} gap={'2'}>
                <TextArea
                  placeholder="Add a comment..."
                  size={'3'}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  style={{ width: '70%' }}
                />
                <Button onClick={sendComment}>Send</Button>
              </Flex>
              <Flex
                direction={'column'}
                align={'center'}
                gap={'1'}
                width={'100%'}
                height={'100%'}
              >
                <ScrollArea scrollbars={'vertical'} style={{ height: '60vh', paddingRight: '12px' }}>
                  <Flex
                    direction={'column'}
                    gap={'1'}
                  >
                    {comments.map((comment, index) => (
                      <Box
                        p={'2'}
                        key={index}
                        width={'100%'}
                        style={{ border: '1px solid black' }}
                      >
                        <Flex justify={'between'} align={'center'}>
                          <Flex align={'center'} gap={'2'}>
                            <Avatar
                              size={'2'}
                              src={`http://localhost:5292/${comment.senderAvatar}`}
                              fallback={comment.senderName[0].toUpperCase()}
                              radius={'full'}
                            />
                            <Text weight={'bold'}>{comment.senderName}</Text>
                          </Flex>
                          <Text size={'1'}>
                            {new Date(comment.createdAt).toLocaleString()}
                          </Text>
                        </Flex>
                        <Text>{comment.message}</Text>
                      </Box>
                    ))}
                    <Box
                      ref={setObserverElement}
                      height={'20px'}
                      width={'100%'}
                    >
                      {loading && <p>Загрузка...</p>}
                      {!hasMore && <p>Это все комментарии.</p>}
                    </Box>
                    {/*<Box ref={commentEndRef}></Box>*/}
                  </Flex>
                </ScrollArea>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default TaskModal;
