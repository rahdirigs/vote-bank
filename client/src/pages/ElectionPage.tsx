import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import Loader from '../components/Loader';
import Message from '../components/Message';
import json from '../contracts/Election.json';
import { userActionTypes } from '../store/action-types/user.action.types';
import { RootState } from '../store/root.reducer';
import useWeb3 from '../web3/hooks/web3';
import VotingPage from './VotingPage';

type IConstituency = {
  name: string;
  region: number;
  voteCount: number;
  startDate: string;
  endDate: string;
  pincodes: string[];
};

type IVoter = {
  voterId: string;
  hasVoted: boolean;
  vote: number;
  constituency: number;
};

const ElectionPage = ({ history, location }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const electionId = location.pathname.split('/')[2];

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [voters, setVoters] = useState<IVoter[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [constituency, setConstituency] = useState<number>(9999);
  const [voter, setVoter] = useState<number>(9999);
  const [enroll, setEnroll] = useState<boolean>(false);

  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);

  let cons: number = 9999;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (userInfo.isAdmin) {
      history.push(`/admin/elections/${electionId}`);
    } else if (userInfo.isDeputy) {
      history.push(`/deputy/elections/${electionId}`);
    }
  }, [userInfo, dispatch, electionId]);

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

    if (!userInfo) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [userInfo, isLoading, isWeb3, dispatch]);

  useEffect(() => {
    const getConstituenciesAndVoters = async () => {
      const res = await instance?.methods.getConstituencies(electionId).call();
      setConstituencies(res);
      const res2 = await instance?.methods.getVoters(electionId).call();
      setVoters(res2);
      for (let i = 0; i < res2.length; i++) {
        if (res2[i].voterId === userInfo?.username) {
          for (let j = 0; j < res.length; j++) {
            for (let k = 0; k < res[j].pincodes.length; k++) {
              if (res[j].pincodes[k] === userInfo?.pincode) {
                setConstituency(j);
                setVoter(i);
                setEnroll(true);
              }
            }
          }
        }
      }
    };

    if (instance) {
      getConstituenciesAndVoters();
      setLoaded(true);
    }
  }, [instance, electionId, success]);

  const validateVoter = (): boolean => {
    for (let i = 0; i < voters.length; i++) {
      if (voters[i].voterId === userInfo?.username) {
        return false;
      }
    }
    return true;
  };

  const validatePincode = (): boolean => {
    for (let i = 0; i < constituencies.length; i++) {
      for (let j = 0; j < constituencies[i].pincodes.length; j++) {
        if (constituencies[i].pincodes[j] === userInfo?.pincode) {
          return true;
        }
      }
    }
    return false;
  };

  const getConstituency = (): number => {
    for (let i = 0; i < constituencies.length; i++) {
      for (let j = 0; j < constituencies[i].pincodes.length; j++) {
        if (constituencies[i].pincodes[j] === userInfo?.pincode) {
          return i;
        }
      }
    }
    return 9999;
  };

  const verifyVoter = () => {
    setLoading(true);
    setSuccess(false);

    const authVoter = async () => {
      await instance?.methods
        .authVoter(userInfo?.username, electionId, cons)
        .send({ from: accounts[0] })
        .on('receipt', (receipt: any) => {
          setLoading(false);
          setMessage(undefined);
          setSuccess(true);
        });
    };

    if (validateVoter()) {
      cons = getConstituency();
      if (validatePincode()) {
        authVoter();
      } else {
        setMessage(
          "The user's pincode does not belong to any of the constituencies, in the election"
        );
      }
    } else {
      setMessage('A voter with same VoterId already enrolled...');
    }
    setLoading(false);
  };

  return (
    <>
      {loaded ? (
        loaded && enroll ? (
          <VotingPage
            constituency={constituency}
            voter={voter}
            electionId={electionId}
            instance={instance!}
            accounts={accounts}
          />
        ) : (
          <>
            {success && (
              <Message variant='success'>
                Successfully verified Voter ID
              </Message>
            )}
            {message && <Message>{message}</Message>}
            <Container>
              <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                  <h2>Enroll Yourself</h2>
                  <Button
                    className='my-3'
                    variant='primary'
                    onClick={() => verifyVoter()}
                  >
                    Enroll Voter ID
                  </Button>
                </Col>
              </Row>
            </Container>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ElectionPage;
