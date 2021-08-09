import React, { useEffect, useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import Loader from '../components/Loader';
import json from '../contracts/Election.json';
import AlliancesPane from '../panes/AlliancesPane';
import CandidatesPane from '../panes/CandidatesPane';
import ConstituenciesPane from '../panes/ConstituenciesPane';
import PartiesPane from '../panes/PartiesPane';
import { userActionTypes } from '../store/action-types/user.action.types';
import { RootState } from '../store/root.reducer';
import useWeb3 from '../web3/hooks/web3';

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

const ResultsPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[2];
  const dispatch = useDispatch();

  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = json.abi;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const [regions, setRegions] = useState<IRegion[]>([]);
  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [alliances, setAlliances] = useState<IAlliance[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [alliancesSorted, setAlliancesSorted] = useState<IAlliance[]>([]);
  const [partiesSorted, setPartiesSorted] = useState<IParty[]>([]);
  const [candidatesSorted, setCandidatesSorted] = useState<ICandidate[]>([]);

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
      const res2 = res
        .slice()
        .sort((a: any, b: any) => b.seatsWon - a.seatsWon);
      setAlliances(res);
      setAlliancesSorted(res2);
    };

    const getParties = async () => {
      const res = await instance?.methods.getParties(electionId).call();
      const res2 = res
        .slice()
        .sort((a: any, b: any) => b.seatsWon - a.seatsWon);
      setParties(res);
      setPartiesSorted(res2);
    };

    const getCandidates = async () => {
      const res = await instance?.methods.getCandidates(electionId).call();
      const res2 = res
        .slice()
        .sort((a: any, b: any) => b.voteCount - a.voteCount);
      setCandidates(res);
      setCandidatesSorted(res2);
    };

    if (instance) {
      getRegions();
      getAlliances();
      getParties();
      getConstituencies();
      getCandidates();
      setLoaded(true);
    }
  }, [instance, electionId]);

  return (
    <>
      {loaded ? (
        <>
          <Row className='text-center my-3'>
            <h2>Election results</h2>
          </Row>
          <Tabs defaultActiveKey='alliances'>
            <Tab eventKey='alliances' title='Results by Alliance'>
              <AlliancesPane alliances={alliancesSorted} />
            </Tab>
            <Tab eventKey='parties' title='Results by Party'>
              <PartiesPane alliances={alliances} parties={partiesSorted} />
            </Tab>
            <Tab eventKey='constituencies' title='Results by Constituencies'>
              <ConstituenciesPane
                regions={regions}
                constituencies={constituencies}
                alliances={alliances}
                parties={parties}
                candidates={candidates}
              />
            </Tab>
            <Tab eventKey='candidates' title='Results by Candidates'>
              <CandidatesPane
                regions={regions}
                constituencies={constituencies}
                alliances={alliances}
                parties={parties}
                candidates={candidatesSorted}
              />
            </Tab>
          </Tabs>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ResultsPage;
