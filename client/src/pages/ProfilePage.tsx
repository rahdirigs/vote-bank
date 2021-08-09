import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  getUserDetails,
  updateUserProfile,
} from '../store/action-creators/user.action.creators';
import { userActionTypes } from '../store/action-types/user.action.types';
import { RootState } from '../store/root.reducer';

const ProfilePage = ({ history }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [contact, setContact] = useState<string | null>(null);
  const [pincode, setPincode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const userDetails = useSelector((state: RootState) => state.userDetails);
  const userUpdateProfile = useSelector(
    (state: RootState) => state.userUpdateProfile
  );
  const userLogin = useSelector((state: RootState) => state.userLogin);

  const { loading, error, user } = userDetails;
  const {
    loading: updateLoading,
    error: updateError,
    success,
  } = userUpdateProfile;
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user?.name) {
        dispatch(getUserDetails('profile'));
      } else {
        if (userInfo.name !== user.name || success) {
          dispatch(getUserDetails('profile'));
          dispatch({ type: userActionTypes.USER_UPDATE_PROFILE_RESET });
        }
        setName(user.name);
        setUsername(user.username!);
        setContact(user.contact!);
        setPincode(user.pincode!);
      }
    }
  }, [dispatch, history, user, userInfo, success]);

  const validateInputs = (): boolean => {
    if (username!.length >= 4) {
      if (
        (password && confirm && password.length >= 5 && password === confirm) ||
        (!password && !confirm)
      ) {
        if (contact!.length === 10) {
          if (pincode!.length === 6) {
            return true;
          } else {
            setMessage('Invalid pincode');
            return false;
          }
        } else {
          setMessage('Invalid phone number');
          return false;
        }
      } else {
        setMessage('Passwords do not match');
        return false;
      }
    } else {
      setMessage('Username too short');
      return false;
    }
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setMessage('');
      dispatch(
        updateUserProfile({
          id: user!._id!,
          username: username ? username : undefined,
          password: password ? password : undefined,
          contact: contact ? contact : undefined,
          pincode: pincode ? pincode : undefined,
        })
      );
    }
  };

  return (
    <>
      {message.length > 0 && <Message>{message}</Message>}
      {error && <Message>{error}</Message>}
      {updateError && <Message>{updateError}</Message>}
      {success && (
        <Message variant='success'>Successfully updated profile</Message>
      )}
      {(loading || updateLoading) && <Loader />}
      <FormContainer>
        <h1>Update Profile</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your name'
              value={name!}
              onChange={(e) => setName(e.target.value)}
              disabled
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='username' className='my-3'>
            <Form.Label>Username (minimum 4 characters long)</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your username'
              value={username!}
              onChange={(e) => setUsername(e.target.value)}
              disabled={userInfo && (userInfo.isAdmin || userInfo.isDeputy)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password (minimum 5 characters long)</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              value={password!}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirm' className='my-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm your password'
              value={confirm!}
              onChange={(e) => setConfirm(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='contact' className='my-3'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your phone number'
              value={contact!}
              onChange={(e) => setContact(e.target.value)}
              disabled={userInfo && (userInfo.isAdmin || userInfo.isDeputy)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='pincode' className='my-3'>
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your area pincode'
              value={pincode!}
              onChange={(e) => setPincode(e.target.value)}
              disabled={userInfo && (userInfo.isAdmin || userInfo.isDeputy)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProfilePage;
