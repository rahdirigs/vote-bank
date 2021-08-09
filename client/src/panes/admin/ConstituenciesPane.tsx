import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Contract } from 'web3-eth-contract';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';

type IProps = {
  electionId: string;
  constituencies: IConstituency[];
  regions: IRegion[];
  candidates: ICandidate[];
  instance: Contract;
  accounts: string[];
};

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

type ICandidate = {
  name: string;
  party: number;
  constituency: number;
  voteCount: number;
  won: boolean;
};

const ConstituenciesPane = ({
  electionId,
  constituencies,
  regions,
  candidates,
  instance,
  accounts,
}: IProps) => {
  const [selectedRegion, setSelectedRegion] = useState<number>(regions.length);
  const [declared, setDeclared] = useState<boolean[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }

    let declared_util: boolean[] = [];
    for (let i = 0; i < constituencies.length; i++) {
      declared_util.push(false);
    }

    for (let i = 0; i < candidates.length; i++) {
      declared_util[candidates[i].constituency] =
        declared_util[candidates[i].constituency] || candidates[i].won;
    }

    setDeclared(declared_util);
    setLoad(true);
  }, [success, userInfo, dispatch]);

  const countVotes = (id: number): number => {
    let candidate: number = -1;
    let votes: number = 0;
    let same: number = 1;
    for (let i = 0; i < candidates.length; i++) {
      if (Number(candidates[i].constituency) !== id) {
        continue;
      }
      if (Number(candidates[i].voteCount) > votes) {
        candidate = i;
        votes = Number(candidates[i].voteCount);
        same = 1;
      } else if (Number(candidates[i].voteCount) === votes) {
        same++;
      }
    }
    if (same > 1) {
      return -1;
    } else {
      return candidate;
    }
  };

  const declareResult = (id: number) => {
    setLoading(true);
    setSuccess(false);

    let candidate: number = countVotes(id);

    const appendBlock = async () => {
      await instance.methods
        .computeResults(userInfo?.username, electionId, candidate)
        .send({ from: accounts[0] })
        .on('receipt', (receipt: any) => {
          setSuccess(true);
          setMessage(undefined);
          setLoading(false);
        });
    };

    console.log(userInfo?.username, electionId, candidate);

    if (candidate > -1) {
      appendBlock();
      setLoading(false);
    } else {
      setLoading(false);
      setMessage('Conflict encountered...');
    }
  };

  return (
    <>
      {load && (
        <>
          {loading && <Loader />}
          {success && (
            <Message variant='success'>
              Declared result for the constituency successfully
            </Message>
          )}
          {message && <Message>{message}</Message>}
          <Row className='my-3'>
            <Col>
              <LinkContainer to={`/admin/new-constituency/${electionId}`}>
                <Button variant='success'>New Constituency</Button>
              </LinkContainer>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <FormContainer>
                <h3>Filter by Region</h3>
                <Form>
                  <Form.Group controlId='selectedRegion' className='my-3'>
                    <Form.Label>Select Region</Form.Label>
                    <Form.Control
                      as='select'
                      value={selectedRegion}
                      onChange={(e) =>
                        setSelectedRegion(Number(e.target.value))
                      }
                    >
                      {regions.map((region, id) => (
                        <option key={id} value={id}>
                          {region.name}
                        </option>
                      ))}
                      <option key={regions.length} value={regions.length}>
                        All regions
                      </option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </FormContainer>
            </Col>
          </Row>
          <Table striped hover responsive bordered className='my-2 text-center'>
            <thead>
              <tr>
                <th>Constituency ID</th>
                <th>Constituency Name</th>
                <th>Region Name</th>
                <th>Poll Start Date</th>
                <th>Poll End Date</th>
                <th>Vote Count</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {constituencies.map((constituency, id) =>
                selectedRegion === regions.length ? (
                  <tr key={id}>
                    <td>{id + 1}</td>
                    <td>{constituency.name}</td>
                    <td>{regions[constituency.region].name}</td>
                    <td>{constituency.startDate}</td>
                    <td>{constituency.endDate}</td>
                    <td>{constituency.voteCount}</td>
                    <td>
                      <Button
                        className='btn-sm'
                        disabled={declared[id]}
                        onClick={() => declareResult(id)}
                      >
                        {declared[id] ? 'Declared' : 'Declare'}
                      </Button>
                    </td>
                  </tr>
                ) : (
                  selectedRegion === Number(constituency.region) && (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{constituency.name}</td>
                      <td>{regions[constituency.region].name}</td>
                      <td>{constituency.startDate}</td>
                      <td>{constituency.endDate}</td>
                      <td>{constituency.voteCount}</td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ConstituenciesPane;
