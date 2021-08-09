import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import json from '../../contracts/Election.json';
import AlliancesPane from '../../panes/admin/AlliancesPane';
import CandidatesPane from '../../panes/admin/CandidatesPane';
import ConstituenciesPane from '../../panes/admin/ConstituenciesPane';
import DeputiesPane from '../../panes/admin/DeputiesPane';
import PartiesPane from '../../panes/admin/PartiesPane';
import RegionsPane from '../../panes/admin/RegionsPane';
import { endElection } from '../../store/action-creators/election.action.creators';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';
import useWeb3 from '../../web3/hooks/web3';

type IRegion = {
  name: string;
  voteCount: number;
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

type IOwner = {
  username: string;
};

type ISubOwner = {
  username: string;
  region: number;
};

const ElectionPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[3];
  const dispatch = useDispatch();

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const electionEnd = useSelector((state: RootState) => state.electionEnd);
  const { success: endSuccess, error } = electionEnd;

  const [regions, setRegions] = useState<IRegion[]>([]);
  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [alliances, setAlliances] = useState<IAlliance[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [deputies, setDeputies] = useState<ISubOwner[]>([]);
  const [owner, setOwner] = useState<IOwner | undefined>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [votes, setVotes] = useState<number>(0);

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
    const getRegions = async () => {
      const res = await instance?.methods.getRegions(electionId).call();
      setRegions(res);
    };

    const getConstituencies = async () => {
      const res = await instance?.methods.getConstituencies(electionId).call();
      setConstituencies(res);
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

    const getDeputies = async () => {
      const res = await instance?.methods.getSubOwners(electionId).call();
      setDeputies(res);
    };

    const getOwner = async () => {
      const res = await instance?.methods.getOwner(electionId).call();
      setOwner(res);
    };

    const getVotes = async () => {
      const res = await instance?.methods.getVotes(electionId).call();
      console.log(res);
      setVotes(res);
    };

    if (instance) {
      getRegions();
      getAlliances();
      getParties();
      getConstituencies();
      getCandidates();
      getDeputies();
      getOwner();
      getVotes();
      setLoaded(true);
    }
  }, [instance, electionId]);

  const endElectionHandler = () => {
    console.log('end');
    dispatch(endElection(electionId));
    window.location.href = `/results/${electionId}`;
  };

  return (
    <>
      {!loaded ? (
        <Loader />
      ) : owner?.username !== userInfo?.username ? (
        <Message>
          The logged in user does not have administrator access...
        </Message>
      ) : (
        <>
          {error && <Message>{error}</Message>}
          {endSuccess && (
            <Message variant='success'>Ended election successfully</Message>
          )}
          <Tabs defaultActiveKey='regions'>
            <Tab eventKey='regions' title='Regions'>
              <RegionsPane electionId={electionId} regions={regions} />
            </Tab>
            <Tab eventKey='alliances' title='Alliances'>
              <AlliancesPane electionId={electionId} alliances={alliances} />
            </Tab>
            <Tab eventKey='parties' title='Parties'>
              <PartiesPane
                electionId={electionId}
                parties={parties}
                alliances={alliances}
              />
            </Tab>
            <Tab eventKey='constituencies' title='Constituencies'>
              <ConstituenciesPane
                electionId={electionId}
                constituencies={constituencies}
                regions={regions}
                candidates={candidates}
                instance={instance!}
                accounts={accounts}
              />
            </Tab>
            <Tab eventKey='candidates' title='Candidates'>
              <CandidatesPane
                electionId={electionId}
                parties={parties}
                candidates={candidates}
                constituencies={constituencies}
              />
            </Tab>
            <Tab eventKey='deputies' title='Deputies'>
              <DeputiesPane
                electionId={electionId}
                deputies={deputies}
                regions={regions}
              />
            </Tab>
          </Tabs>
          <Row className='my-3'>
            <Col>
              <Button
                variant='primary'
                disabled={votes < 1}
                onClick={() => endElectionHandler()}
              >
                End Election
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ElectionPage;
