import { Button, Flex } from '@radix-ui/themes';

function SideMenu({ activeTab, setActiveTab, menuItems }) {
  return (
    <Flex
      p={'5'}
      width={'350px'}
      direction={'column'}
      gap={'2'}
      style={{ borderLeft: '1px solid #ccc' }}
    >
      {menuItems.map(item => (
        <Button
          size={'3'}
          key={item.id}
          variant={item.id === activeTab ? 'soft' : 'surface'}
          onClick={() => setActiveTab(item.id)}
        >
          {item.label}
        </Button>
      ))}
    </Flex>
  );
}

export default SideMenu;
