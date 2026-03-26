import { Button, Flex, Heading, TextField } from '@radix-ui/themes';
import './group.css';
export default function GroupModal({
  groupName,
  setGroupName,
  setShowModal,
  handleSubmit,
}) {
  return (
    <Flex
      justify={'center'}
      align={'center'}
      position={'fixed'}
      inset={'0'}
      className="create-group"
    >
      <Flex
        direction={'column'}
        gap={'14px'}
        width={'340px'}
        p={'30px'}
        className="create-group-form"
      >
        <Heading as="h2" color="gray">
          Create new group
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction={'column'} gap={'2'}>
            <TextField.Root
              type={'text'}
              placeholder="Enter group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              size={'3'}
            />
            <Flex gap={'10px'}>
              <Button type="submit">Create</Button>
              <Button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}
