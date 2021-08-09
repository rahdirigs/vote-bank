import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { addAdmin } from '../../store/action-creators/user.action.creators';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';

const NewAdminPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [pincode, setPincode] = useState<string>('000000');
  const [message, setMessage] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  const dispatch = useDispatch();

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const adminAdd = useSelector((state: RootState) => state.adminAdd);
  const { loading, success, error } = adminAdd;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [dispatch, userInfo]);

  const validateInputs = (): boolean => {
    if (
      name.length > 0 &&
      username.length > 0 &&
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
      dispatch(addAdmin(name, username, password, contact, pincode, isAdmin));
    }
  };

  return (
    <>
      {message.length > 0 && <Message>{message}</Message>}
      {error && <Message>{error}</Message>}
      {loading && <Loader />}
      {success && (
        <Message variant='success'>
          Successfully added new administrator
        </Message>
      )}
      <FormContainer>
        <h1>Add Administrator</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the admin name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='username' className='my-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the admin username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password (minimum 5 characters long)</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter the admin password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirm' className='my-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm the admin password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='contact' className='my-3'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the admin phone number'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='my-2'>
            Register Admin
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default NewAdminPage;
