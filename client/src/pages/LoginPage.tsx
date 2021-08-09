import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { login } from '../store/action-creators/user.action.creators';
import { RootState } from '../store/root.reducer';

const LoginPage = ({ location, history }: RouteComponentProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const validateInputs = (): boolean => {
    if (username.length >= 8 && password.length >= 5) {
      return true;
    }
    return false;
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setMessage('');
      dispatch(login(username, password));
    } else {
      setMessage('Invalid values for one or more form fields');
    }
  };

  return (
    <>
      {message.length > 0 && <Message>{message}</Message>}
      {error && <Message>{error}</Message>}
      {loading && <Loader />}
      <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='username' className='my-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='my-2'>
            Login
          </Button>
        </Form>
        <Row className='py-3'>
          <Col>
            New user? <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>Register Here</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginPage;
