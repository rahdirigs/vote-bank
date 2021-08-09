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

type IParty = {
  name: string;
  alliance: number;
  seatsContested: number;
  seatsWon: number;
  voteCount: number;
};

type ICandidate = {
  name: string;
  party: number;
  constituency: number;
  voteCount: number;
  won: boolean;
};

type IConstituency = {
  name: string;
  region: number;
  voteCount: number;
  startDate: string;
  endDate: string;
  pincodes: string[];
};

const NewCandidatePage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[3];
  const dispatch = useDispatch();

  const [candidate, setCandidate] = useState<string>('');
  const [party, setParty] = useState<number>(0);
  const [constituency, setConstituency] = useState<number>(0);

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [parties, setParties] = useState<IParty[]>([]);
  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [message, setMessage] = useState<string>();

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

  useEffect(() => {
    const getParties = async () => {
      const res = await instance?.methods.getParties(electionId).call();
      setParties(res);
    };

    const getConstituencies = async () => {
      const res = await instance?.methods.getConstituencies(electionId).call();
      setConstituencies(res);
    };

    const getCandidates = async () => {
      const res = await instance?.methods.getCandidates(electionId).call();
      setCandidates(res);
    };

    if (instance) {
      getParties();
      getConstituencies();
      getCandidates();
      setLoaded(true);
    }
  }, [instance, success, electionId]);

  const validateCandidate = (): boolean => {
    if (party === 0) {
      return true;
    }
    for (let i = 0; i < candidates.length; i++) {
      const cand: ICandidate = candidates[i];
      if (
        Number(cand.party) === Number(party) &&
        Number(cand.constituency) === Number(constituency)
      ) {
        return false;
      }
    }
    return true;
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    let region: number = Number(constituencies[constituency].region);

    const appendBlock = async () => {
      await instance?.methods
        .addCandidate(
          userInfo?.username,
          electionId,
          candidate,
          party,
          constituency,
          region
        )
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          console.log(receipt);
          setSuccess(true);
          setMessage(undefined);
          setLoading(false);
        });
    };

    if (validateCandidate()) {
      appendBlock();
    } else {
      setLoading(false);
      setMessage(
        'A candidate from the selected party already exists for the constituency'
      );
    }
  };

  return (
    <>
      {loading && <Loader />}
      {success && (
        <Message variant='success'>Successfully added new candidate</Message>
      )}
      {message && <Message>{message}</Message>}
      {userInfo && loaded && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Candidate</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='candidate' className='my-3'>
                  <Form.Label>Candidate Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={candidate}
                    placeholder='Enter the candidate name'
                    onChange={(e) => setCandidate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='party' className='my-3'>
                  <Form.Label>Select party</Form.Label>
                  <Form.Control
                    as='select'
                    value={party}
                    onChange={(e) => setParty(Number(e.target.value))}
                  >
                    {parties.map((party, id) => (
                      <option key={id} value={id}>
                        {party.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='constituency' className='my-3'>
                  <Form.Label>Select constituency</Form.Label>
                  <Form.Control
                    as='select'
                    value={constituency}
                    onChange={(e) => setConstituency(Number(e.target.value))}
                  >
                    {constituencies.map((constituency, id) => (
                      <option key={id} value={id}>
                        {constituency.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={candidate.length <= 3}
                >
                  Add Candidate
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewCandidatePage;
