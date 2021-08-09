import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import json from '../../contracts/Election.json';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';
import useWeb3 from '../../web3/hooks/web3';

const NewRegionPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[2];
  const dispatch = useDispatch();

  const [region, setRegion] = useState<string>('');
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

    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [isLoading, isWeb3, userInfo, dispatch]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appendBlock = async () => {
      await instance?.methods
        .addRegion(userInfo?.username, electionId, region)
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
        <Message variant='success'>Successfully added new region</Message>
      )}
      {userInfo && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Region</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='region' className='my-3'>
                  <Form.Label>Region Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={region}
                    placeholder='Enter the region name'
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={region.length <= 3}
                >
                  Add Region
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewRegionPage;
