import './Registration.css';
import { Box, Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
export default function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5292/api/Account/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        login(
          data.id,
          data.firstName,
          data.lastName,
          data.userName,
          data.token,
          data.email,
        );
        navigate('/');
      })
      .catch(err => console.log(err));
  }
  useEffect(() => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,20}$/;
    if (password && !pattern.test(password)) {
      setPasswordError(
        'Password must:\n' +
          '- be between 10 and 20 characters\n' +
          '- contain special characters\n' +
          '- must contain a capital letter\n' +
          '- contain numbers',
      );
    } else {
      setPasswordError(null);
    }
  }, [password]);
  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      setEmailError('Введите корректный email');
    } else {
      setEmailError(null);
    }
  }, [email]);
  return (
    <Flex
      height={'94vh'}
      justify={'center'}
      align={'center'}
      direction={'column'}
    >
      <Flex
        direction={'column'}
        justify={'center'}
        align={'center'}
        width={'700px'}
        className="register-border"
        p={'7'}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Flex flexGrow={'1'} gap={'6'} direction={'column'}>
            <Flex gap={'4'}>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  First Name
                </Text>
                <TextField.Root
                  type={'text'}
                  placeholder="Enter the first name"
                  size={'3'}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Box>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  Last Name
                </Text>
                <TextField.Root
                  type={'text'}
                  placeholder="Enter the last name"
                  size={'3'}
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex gap={'4'}>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  Username
                </Text>
                <TextField.Root
                  type={'text'}
                  placeholder="Enter the username"
                  size={'3'}
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                >
                  <TextField.Slot>@</TextField.Slot>
                </TextField.Root>
              </Box>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  Email
                </Text>
                <TextField.Root
                  type={'email'}
                  placeholder="Enter the email"
                  size={'3'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex justify={'between'} gap={'4'}>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  Password
                </Text>
                <TextField.Root
                  type={'password'}
                  placeholder="Enter the password"
                  size={'3'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Box>
              <Box flexGrow={'1'} flexBasis={'0'}>
                <Text weight={'bold'} as={'label'}>
                  Confirm Password
                </Text>
                <TextField.Root
                  type={'password'}
                  placeholder="Confirm the password"
                  size={'3'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex direction={'column'} flexGrow={'1'} justify={'center'}>
              <Button
                style={{ width: '100%', height: '4vh' }}
                variant={'classic'}
              >
                Register
              </Button>
              <Flex justify={'center'} align={'center'} gap={'2'} mt={'2'}>
                <Text size={'3'}>Already have an account?</Text>
                <Button type={'button'} variant={'solid'}>
                  Sign in
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}
