import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import './header.css';
import { Avatar, DropdownMenu, Flex, Button, Text } from '@radix-ui/themes';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="header-component">
      <div className="header-main">
        <div className="header-logo">
          <Link className="nav-link flex items-center gap-2" to="/">
            <h2 className="text-xl font-bold text-blue-600">TaskHive</h2>
          </Link>
        </div>
        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant={'ghost'}>
                <Flex align={'center'} gap={'2'}>
                  <Text size={'3'}>{user.userName}</Text>
                  <Avatar
                    variant={'solid'}
                    size={'2'}
                    src={`http://localhost:5292/${user.avatarUrl}`}
                    fallback={user.userName[0]}
                  />
                </Flex>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant={'soft'}>
              <DropdownMenu.Label>
                <Flex direction={'column'}>
                  <Text size={'1'}>{user.firstName + ' ' + user.lastName}</Text>
                  <Text size={'1'}>{user.email}</Text>
                </Flex>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => navigate('/user')}>
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item>Settings</DropdownMenu.Item>
              <DropdownMenu.Item color={'red'} onSelect={handleLogout}>
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <nav className="flex gap-4">
            <Link
              className="text-gray-600 hover:text-blue-600 font-medium"
              to="/login"
            >
              Sign In
            </Link>
            <Link
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              to="/registration"
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
