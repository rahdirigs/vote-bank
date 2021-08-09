import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Contract } from 'web3-eth-contract';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import json from '../../contracts/Election.json';
import { createElection } from '../../store/action-creators/election.action.creators';
import { electionActionTypes } from '../../store/action-types/election.action.types';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';
import useWeb3 from '../../web3/hooks/web3';

const NewElectionPage = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [append, setAppend] = useState(false);

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const electionCreate = useSelector(
    (state: RootState) => state.electionCreate
  );
  const { userInfo } = userLogin;
  const { loading, error, success, election } = electionCreate;

  useEffect(() => {
    dispatch({ type: electionActionTypes.ELECTION_CREATE_RESET });

    const getContractInstance = async () => {
      if (web3 !== null) {
        const networkId = (
          await web3.eth.net.getId()
        ).toString() as keyof typeof json.networks;
        const deployedNetwork = json.networks[networkId];
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
        );
        setInstance(instance);
      }
    };
    getContractInstance();

    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [isLoading, isWeb3, userInfo]);

  useEffect(() => {
    const appendBlock = async () => {
      await instance?.methods
        .newElection(userInfo!.username, election?._id)
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          setAppend(true);
        });
    };

    if (success) {
      appendBlock();
    }
  }, [success]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createElection(userInfo!.username, title, description));
  };

  return (
    <>
      {loading && <Loader />}
      {error && <Message>{error}</Message>}
      {append && (
        <Message variant='success'>Successfully created election</Message>
      )}
      {userInfo && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Election</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='title' className='my-3'>
                  <Form.Label>Election Title</Form.Label>
                  <Form.Control
                    type='text'
                    value={title}
                    placeholder='Enter the election title'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='description' className='my-3'>
                  <Form.Label>Election Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    value={description}
                    placeholder='Enter a description'
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                    cols={50}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={title.length === 0 || description.length <= 5}
                >
                  Create Election
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewElectionPage;
