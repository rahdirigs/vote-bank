import React, { useEffect, useState } from 'react';
import { Button, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Contract } from 'web3-eth-contract';
import Loader from '../components/Loader';
import Message from '../components/Message';
import json from '../contracts/Election.json';
import { RootState } from '../store/root.reducer';

type IProps = {
  constituency: number;
  voter: number;
  electionId: string;
  instance: Contract;
  accounts: string[];
};

type IConstituency = {
  name: string;
  region: number;
  voteCount: number;
  startDate: string;
  endDate: string;
  pincodes: string[];
};

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

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

type IVoter = {
  voterId: string;
  voter: number;
  hasVoted: boolean;
  constituency: number;
};

const VotingPage = ({
  constituency,
  voter,
  electionId,
  instance,
  accounts,
}: IProps) => {
  const dispatch = useDispatch();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [alliances, setAlliances] = useState<IAlliance[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [voters, setVoters] = useState<IVoter[]>([]);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const [date, setDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    const getConstituencies = async () => {
      const res = await instance?.methods.getConstituencies(electionId).call();
      setConstituencies(res);
      setStartDate(new Date(res[constituency].startDate));
      setEndDate(new Date(res[constituency].endDate));
    };

    const getAlliances = async () => {
      const res = await instance?.methods.getAlliances(electionId).call();
      setAlliances(res);
    };

    const getParties = async () => {
      const res = await instance?.methods.getParties(electionId).call();
      setParties(res);
    };

    const getCandidates = async () => {
      const res = await instance?.methods.getCandidates(electionId).call();
      setCandidates(res);
    };

    const getVoters = async () => {
      const res = await instance?.methods.getVoters(electionId).call();
      setVoters(res);
      setHasVoted(res[voter].hasVoted);
    };

    if (instance) {
      getAlliances();
      getParties();
      getConstituencies();
      getCandidates();
      getVoters();
      setLoaded(true);
    }
  }, [instance, electionId, success]);

  const validateVote = (): boolean => {
    for (let i = 0; i < voters.length; i++) {
      if (voters[i].voterId === userInfo?.username) {
        if (voters[i].hasVoted) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  };

  const castVote = (id: number) => {
    setLoading(true);
    setSuccess(false);

    const appendBlock = async () => {
      await instance.methods
        .castVote(userInfo?.username, electionId, id)
        .send({ from: accounts[0] })
        .on('receipt', (receipt: any) => {
          setMessage(undefined);
          setSuccess(true);
          setLoading(false);
        });
    };

    if (validateVote()) {
      appendBlock();
      setLoading(false);
    } else {
      setMessage('Voter has already voted for this election');
      setLoading(false);
    }
  };

  return (
    <>
      {loaded ? (
        <>
          {hasVoted && (
            <Message variant='info'>
              The user associated with the Voter ID has already voted
            </Message>
          )}
          {loading && <Loader />}
          {date < startDate && (
            <Message variant='info'>The polls are yet to open</Message>
          )}
          {date > endDate && (
            <Message variant='info'>
              The polls in your constituency are over
            </Message>
          )}
          {success && (
            <Message variant='success'>
              Congratulations you have successfully voted
            </Message>
          )}
          <Row className='text-center my-3'>
            <h2>Voting Screen</h2>
          </Row>
          <Table striped hover responsive bordered className='my-2 text-center'>
            <thead>
              <tr>
                <th>Candidate ID</th>
                <th>Candidate Name</th>
                <th>Party</th>
                <th>Alliance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(
                (candidate, id) =>
                  Number(candidate.constituency) === Number(constituency) && (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{candidate.name}</td>
                      <td>{parties[candidate.party].name}</td>
                      <td>
                        {alliances[parties[candidate.party].alliance].name}
                      </td>
                      <td>
                        <Button
                          variant='primary'
                          className='btn-sm'
                          onClick={() => castVote(id)}
                          disabled={
                            hasVoted || date < startDate || date > endDate
                          }
                        >
                          Vote
                        </Button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default VotingPage;
