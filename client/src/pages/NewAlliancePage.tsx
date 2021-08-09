import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import json from '../contracts/Election.json';
import { userActionTypes } from '../store/action-types/user.action.types';
import { RootState } from '../store/root.reducer';
import useWeb3 from '../web3/hooks/web3';

const NewAlliancePage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[2];
  const dispatch = useDispatch();

  const [alliance, setAlliance] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
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

    if (!userInfo || (userInfo && !userInfo.isAdmin && !userInfo.isDeputy)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [isLoading, isWeb3, userInfo, dispatch]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appendBlock = async () => {
      await instance?.methods
        .addAlliance(userInfo?.username, electionId, alliance)
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          setSuccess(true);
          setLoading(false);
        });
    };

    appendBlock();
  };

  return (
    <>
      {loading && <Loader />}
      {success && (
        <Message variant='success'>Successfully added new alliance</Message>
      )}
      {userInfo && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Alliance</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='alliance' className='my-3'>
                  <Form.Label>Alliance Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={alliance}
                    placeholder='Enter the alliance name'
                    onChange={(e) => setAlliance(e.target.value)}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={alliance.length <= 3}
                >
                  Add Alliance
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewAlliancePage;
