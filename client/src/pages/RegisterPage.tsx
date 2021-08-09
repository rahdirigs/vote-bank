import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { register } from '../store/action-creators/user.action.creators';
import { RootState } from '../store/root.reducer';

const RegisterPage = ({ location, history }: RouteComponentProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userRegister = useSelector((state: RootState) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [redirect, history, userInfo]);

  const validateInputs = (): boolean => {
    if (
      name.length > 0 &&
      contact.length === 10 &&
      pincode.length === 6 &&
      password.length >= 5
    ) {
      if (password === confirm) {
        return true;
      } else {
        setMessage('Passwords do not match!!!');
        return false;
      }
    }
    setMessage('Invalid values for one or more form fields');
    return false;
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setMessage('');
      const username: string = name.split(' ').join('') + contact;
      console.log(username);
      dispatch(register(name, username, password, contact, pincode));
    }
  };

  return (
    <>
      {message.length > 0 && <Message>{message}</Message>}
      {error && <Message>{error}</Message>}
      {loading && <Loader />}
      <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password (minimum 5 characters long)</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirm' className='my-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm your password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='contact' className='my-3'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your phone number'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='pincode' className='my-3'>
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your area pincode'
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='my-2'>
            Register
          </Button>
        </Form>
        <Row className='py-3'>
          <Col>
            Existing user?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Sign In here.
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterPage;
