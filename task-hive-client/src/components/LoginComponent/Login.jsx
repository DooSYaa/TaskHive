import './Login.css';
import { Flex, Box, Text, TextField, Button } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setEmailError(!email ? 'email is required!' : null);
      setPasswordError(!password ? 'password required' : null);
      return;
    }
    if (!emailError && !passwordError) {
      const response = await fetch('http://localhost:5292/api/Account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        localStorage.clear();
        navigate('/');
        throw new Error(`Error occured: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        login(
          data.id,
          data.firstName,
          data.lastName,
          data.userName,
          data.email,
          data.avatarUrl,
          data.token,
        );
        navigate('/');
      } else {
        throw new Error('Username not found in this response');
      }
    }
  };
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
      setEmailError('Enter a valid email');
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
        className="login-border"
        p={'7'}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Flex flexGrow={'1'} gap={'6'} direction={'column'}>
            <Flex gap={'4'}>
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter the password"
                  size={'3'}
                />
              </Box>
            </Flex>
            <Flex direction={'column'} flexGrow={'1'} justify={'center'}>
              <Button
                style={{ width: '100%', height: '4vh' }}
                variant={'classic'}
              >
                Sign In
              </Button>
              <Flex justify={'end'} align={'center'} gap={'2'} mt={'2'}>
                <Text size={'3'}>Forgot your password?</Text>
              </Flex>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}
// return (
//   <div className={styles.loginMainContainer}>
//     <div className={styles.loginContainer}>
//       <div className={styles.rectangleContainer}>
//         <svg
//           className={styles.rectangle}
//           width={400}
//           height={400}
//           version="1.1"
//           xmlns="http://www.w3.org/2000/svg"
//         ></svg>
//       </div>
//       <div className={styles.loginFormContainer}>
//         <h1>Sign in</h1>
//         <form onSubmit={handleSubmit} className={styles.loginForm}>
//           <input
//             className={styles.formInput}
//             id="email"
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="Email"
//           />{' '}
//           {emailError && (
//             <span id="email-error" className={styles.errorMessage}>
//               {emailError}
//             </span>
//           )}
//           <input
//             className={styles.formInput}
//             id="password"
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             placeholder="Password"
//           />{' '}
//           <br />
//           <br />
//           <Button color="jade">Sign In</Button>
//           {/* <Button variant={'login'} type='submit'>Sign in</Button> */}
//         </form>
//       </div>
//     </div>
//   </div>
// );
