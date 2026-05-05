import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './TaskWidget.css';
import { Flex, Heading, Box, Text, ScrollArea } from '@radix-ui/themes';

export default function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          'http://localhost:5292/api/kanban-tables/GetMyTasks',
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched tasks for widget:', data);
          setTasks(data);
        }
      } catch (e) {
        console.error('Widget load error', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTasks();
  }, [user]);

  const goToTask = task => {
    navigate(`/group/${task.groupId}/${task.kanbanId}`);
  };

  const isUrgent = dateStr => {
    if (!dateStr) return false;
    return (
      new Date(dateStr) < new Date(new Date().setDate(new Date().getDate() + 1))
    ); // Если дедлайн сегодня или завтра
  };

  if (loading) return <div className="widget-container">Loading...</div>;

  return (
    <Box height={'100vh'} p={'20px'} className="widget-container">
      <Flex justify={'between'} align={'center'} mb={'15px'}>
        <Heading as="h3" weight={'medium'} size={'5'} color="black">
          My Focus
        </Heading>
      </Flex>

      <ScrollArea
        size={'3'}
        scrollbars={'vertical'}
        style={{ height: '53rem' }}
      >
        <Flex direction={'column'} gap={'10px'} width={'24rem'}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <Flex
                justify={'between'}
                align={'center'}
                py={'10px'}
                px={'12px'}
                key={task.id}
                className="widget-task-row"
                onClick={() => goToTask(task)}
              >
                <Flex align={'center'} gap={'12px'} width={'70%'}>
                  {/* Цветная полоска приоритета */}
                  <Box
                    width={'5px'}
                    height={'32px'}
                    className="priority-strip"
                    style={{ background: priorityColors[task.priority || 0] }}
                  />

                  <Box width={'90%'}>
                    <Heading
                      wrap={'nowrap'}
                      weight={'medium'}
                      truncate
                      size={'3'}
                    >
                      {task.title}
                    </Heading>
                    <Box>
                      <Text size={'1'} color="gray" mt={'2px'}>
                        {task.tableName} • {task.statusName}
                      </Text>
                    </Box>
                  </Box>
                </Flex>

                {task.dueDate && (
                  <Box
                    width={'60px'}
                    className={`task-date ${isUrgent(task.dueDate) ? 'urgent' : ''}`}
                  >
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Box>
                )}
              </Flex>
            ))
          ) : (
            <Box>
              <Text align={'center'} color="gray" size={'2'}>
                🎉 No urgent tasks. Good job!
              </Text>
            </Box>
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
}
