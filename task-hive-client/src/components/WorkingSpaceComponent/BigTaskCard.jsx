import './BigTaskCard.css';
import { Badge, Card, Flex, Separator, Text, Box } from '@radix-ui/themes';
function BigTaskCard({ task }) {
  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];
  const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
  const isOverdue = new Date(task.dueDate) < new Date();
  return (
    <Flex
      direction={'column'}
      justify={'between'}
      height={'280px'}
      p={'1.25rem'}
      className="big-task-card"
    >
      <Flex justify={'between'} align={'center'}>
        <Flex justify={'center'} align={'center'} gap={'6px'}>
          {task.groupName && (
            <Flex align={'center'} gap={'6px'}>
              <Badge>
                <Text>{task.groupName}</Text>
              </Badge>
              <Separator orientation="vertical" />
            </Flex>
          )}
          <Badge color="gray">
            <Text size={'2'} weight={'bold'}>
              {task.tableName}
            </Text>
          </Badge>
          <Separator orientation="vertical" />
          <Badge color="blue" radius={'large'}>
            <Text size={'2'} weight={'bold'}>
              {task.statusName}
            </Text>
          </Badge>
        </Flex>
        {/* <div className="priority-badge">
          <div
            className="priority-dot"
            style={{ background: priorityColors[task.priority] }}
          ></div>
          <span className="priority-text">{priorityLabels[task.priority]}</span>
        </div> */}
        <Card size={'1'}>
          <Flex m={'-1'} justify={'center'} align={'center'} gap={'6px'}>
            <Box
              width={'0.625rem'}
              height={'0.625rem'}
              style={{
                backgroundColor: priorityColors[task.priority],
                borderRadius: '50%',
              }}
            ></Box>
            <Text>{priorityLabels[task.priority]}</Text>
          </Flex>
        </Card>
      </Flex>
      <div className="card-content">
        <h3 className="card-title">{task.title}</h3>
        <p className="card-description">
          {task.description || 'No description...'}
        </p>
      </div>
      <div className="card-footer">
        <div className="marks-container">
          {task.marks.map(mark => (
            <Badge key={mark.id} color={mark.hexColor}>
              <Text size={'2'}>{mark.markName}</Text>
            </Badge>
          ))}
        </div>
        <div className="date-container">
          <div className="date-label">Deadline</div>
          <div className={`date-value ${isOverdue ? 'overdue' : ''}`}>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                })
              : 'No deadline'}
          </div>
        </div>
      </div>
    </Flex>
  );
}

export default BigTaskCard;
