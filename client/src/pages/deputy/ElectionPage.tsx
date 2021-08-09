import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import json from '../../contracts/Election.json';
import AlliancesPane from '../../panes/deputy/AlliancesPane';
import CandidatesPane from '../../panes/deputy/CandidatesPane';
import ConstituenciesPane from '../../panes/deputy/ConstituenciesPane';
import PartiesPane from '../../panes/deputy/PartiesPane';
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

  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [alliances, setAlliances] = useState<IAlliance[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [deputies, setDeputies] = useState<ISubOwner[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);
  const [region, setRegion] = useState<number>(0);

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

    if (!userInfo || (userInfo && !userInfo.isDeputy)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [isLoading, isWeb3, userInfo, dispatch]);

  useEffect(() => {
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
      for (let i = 0; i < res.length; i++) {
        if (res[i].username === userInfo?.username) {
          setAuth(true);
          setRegion(Number(res[i].region));
        }
      }
      setDeputies(res);
    };

    if (instance) {
      getAlliances();
      getParties();
      getConstituencies();
      getCandidates();
      getDeputies();

      setLoaded(true);
    }
  }, [instance, electionId]);

  return (
    <>
      {!loaded ? (
        <Loader />
      ) : !auth ? (
        <Message>The logged in user does not have deputy access...</Message>
      ) : (
        <>
          <Tabs defaultActiveKey='alliances'>
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
                region={region}
              />
            </Tab>
            <Tab eventKey='candidates' title='Candidates'>
              <CandidatesPane
                electionId={electionId}
                parties={parties}
                candidates={candidates}
                constituencies={constituencies}
                region={region}
              />
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
};

export default ElectionPage;
