import { useAuth } from '../Context/AuthContext';
import { Theme, Select, Flex, Text } from '@radix-ui/themes';

const PRIORITIES = [
  { label: 'Low', value: 0, color: '#22c55e' },
  { label: 'Medium', value: 1, color: '#eab308' },
  { label: 'High', value: 2, color: '#ef4444' },
  { label: 'Urgent', value: 3, color: '#000000' },
];
function Priority({
  priority,
  setPriority,
  onPriorityUpdate,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();

  const handleSelect = async newItem => {
    const newValueNum = parseInt(newItem);
    if (setPriority) setPriority(newValueNum);
    try {
      const response = await fetch(
        'http://localhost:5292/api/kanban-tables/UpdateTaskPriority',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
            cardId: cardId,
            priority: newValueNum,
          }),
        },
      );
      if (!response.ok) throw new Error('failed to update priority');
      if (onPriorityUpdate) {
        onPriorityUpdate(newValueNum);
      }
    } catch (error) {
      console.error('Error changing priority:', error);
    }
  };
  const currentValue =
    priority !== null && priority !== undefined ? String(priority) : undefined;
  return (
      <Select.Root value={currentValue} onValueChange={handleSelect}>
        <Select.Trigger variant="soft" placeholder="Select priority" />
        <Select.Content
          style={{ zIndex: '9999' }}
          position="popper"
          variant="soft"
        >
          {PRIORITIES.map(option => (
            <Select.Item key={option.value} value={String(option.value)}>
              <Flex align="center" gap="2">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: option.color,
                  }}
                />
                <Text>{option.label}</Text>
              </Flex>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
  );
}

export default Priority;
