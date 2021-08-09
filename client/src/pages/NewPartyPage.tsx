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

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

const NewPartyPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[2];
  const dispatch = useDispatch();

  const [party, setParty] = useState<string>('');
  const [alliance, setAlliance] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alliances, setAlliances] = useState<IAlliance[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

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

  useEffect(() => {
    const getAlliances = async () => {
      const res = await instance?.methods.getAlliances(electionId).call();
      setAlliances(res);
    };

    if (instance) {
      getAlliances();
      setLoaded(true);
    }
  }, [instance, electionId]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appendBlock = async () => {
      await instance?.methods
        .addParty(userInfo?.username, electionId, party, alliance)
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          console.log(receipt);
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
        <Message variant='success'>Successfully added new party</Message>
      )}
      {userInfo && loaded && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Party</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='party' className='my-3'>
                  <Form.Label>Party Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={party}
                    placeholder='Enter the party name'
                    onChange={(e) => setParty(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='alliance' className='my-3'>
                  <Form.Label>Select alliance</Form.Label>
                  <Form.Control
                    as='select'
                    value={alliance}
                    onChange={(e) => setAlliance(Number(e.target.value))}
                  >
                    {alliances.map((alliance, id) => (
                      <option key={id} value={id}>
                        {alliance.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={party.length <= 3}
                >
                  Add Party
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewPartyPage;
