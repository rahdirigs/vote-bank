import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import json from '../../contracts/Election.json';
import { listUsers } from '../../store/action-creators/user.action.creators';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';
import useWeb3 from '../../web3/hooks/web3';

type ISubOwner = {
  username: string;
  region: number;
};

type IRegion = {
  name: string;
  voteCount: number;
};

const AppointDeputyPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[2];
  const dispatch = useDispatch();

  const [deputy, setDeputy] = useState<string>('');
  const [region, setRegion] = useState<number>(0);

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [deputies, setDeputies] = useState<ISubOwner[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [message, setMessage] = useState<string>();

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const userList = useSelector((state: RootState) => state.userList);
  const { userInfo } = userLogin;
  const { users } = userList;

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

    dispatch(listUsers());
  }, [isLoading, isWeb3, userInfo, dispatch]);

  useEffect(() => {
    const getRegions = async () => {
      const res = await instance?.methods.getRegions(electionId).call();
      setRegions(res);
    };

    const getDeputies = async () => {
      const res = await instance?.methods.getSubOwners(electionId).call();
      setDeputies(res);
    };

    if (instance) {
      getRegions();
      getDeputies();
      setLoaded(true);
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].isDeputy) {
        setDeputy(users[i].username);
        break;
      }
    }
  }, [instance, success, electionId, users]);

  const validateDeputy = (): boolean => {
    for (let i = 0; i < deputies.length; i++) {
      const dep: ISubOwner = deputies[i];
      if (Number(dep.region) === Number(region)) {
        return false;
      }
    }
    return true;
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    const appendBlock = async () => {
      await instance?.methods
        .approveSubOwner(userInfo?.username, deputy, electionId, region)
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          console.log(receipt);
          setSuccess(true);
          setMessage(undefined);
          setLoading(false);
        });
    };

    if (validateDeputy()) {
      appendBlock();
    } else {
      setLoading(false);
      setMessage('A deputy already exists for the selected region');
    }
  };

  return (
    <>
      {loading && <Loader />}
      {success && (
        <Message variant='success'>Successfully added new deputy</Message>
      )}
      {message && <Message>{message}</Message>}
      {userInfo && loaded && users.length > 0 && (
        <FormContainer>
          <Row className='text-center'>
            <h1>Appoint Deputy</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='deputy' className='my-3'>
                  <Form.Label>Select deputy</Form.Label>
                  <Form.Control
                    as='select'
                    value={deputy}
                    onChange={(e) => setDeputy(e.target.value)}
                  >
                    {users.map(
                      (user, id) =>
                        user.isDeputy && (
                          <option key={id} value={user.username}>
                            {user.username}
                          </option>
                        )
                    )}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='region' className='my-3'>
                  <Form.Label>Select region</Form.Label>
                  <Form.Control
                    as='select'
                    value={region}
                    onChange={(e) => setRegion(Number(e.target.value))}
                  >
                    {regions.map((region, id) => (
                      <option key={id} value={id}>
                        {region.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='my-3'>
                  Appoint Deputy
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default AppointDeputyPage;
