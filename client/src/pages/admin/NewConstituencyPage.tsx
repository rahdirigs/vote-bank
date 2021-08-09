import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

type IRegion = {
  name: string;
  voteCount: number;
};

const NewConstituencyPage = ({ location }: RouteComponentProps) => {
  const electionId = location.pathname.split('/')[3];
  const dispatch = useDispatch();

  const [constituency, setConstituency] = useState<string>('');
  const [region, setRegion] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [pincodes, setPincodes] = useState<string>('');

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [regions, setRegions] = useState<IRegion[]>([]);
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

    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [isLoading, isWeb3, userInfo, dispatch]);

  useEffect(() => {
    const getRegions = async () => {
      const res = await instance?.methods.getRegions(electionId).call();
      setRegions(res);
    };

    if (instance) {
      getRegions();
      setLoaded(true);
    }
  }, [instance, electionId]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let pincodes_arr: string[] = [];
    const pincodes_split = pincodes.split(',');
    for (let i = 0; i < pincodes_split.length; i++) {
      pincodes_arr.push(pincodes_split[i].trim());
    }
    let startDateStr: string = startDate.toDateString();
    let endDateStr: string = endDate.toDateString();

    const appendBlock = async () => {
      await instance?.methods
        .addConstituency(
          userInfo?.username,
          electionId,
          constituency,
          region,
          startDateStr,
          endDateStr,
          pincodes_arr
        )
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
        <Message variant='success'>Successfully added new constituency</Message>
      )}
      {userInfo && loaded && (
        <FormContainer>
          <Row className='text-center'>
            <h1>New Constituency</h1>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='constituency' className='my-3'>
                  <Form.Label>Constituency Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={constituency}
                    placeholder='Enter the constituency name'
                    onChange={(e) => setConstituency(e.target.value)}
                  />
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
                <Form.Group controlId='startDate' className='my-3'>
                  <Form.Label>Election Start Date</Form.Label>
                  <br />
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                  />
                </Form.Group>
                <Form.Group controlId='endDate' className='my-3'>
                  <Form.Label>Election End Date</Form.Label>
                  <br />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                  />
                </Form.Group>
                <Form.Group controlId='pincodes' className='my-3'>
                  <Form.Label>
                    Pincodes (Enter multiple pincodes separated by commas)
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    value={pincodes}
                    onChange={(e) => setPincodes(e.target.value)}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  className='my-3'
                  disabled={constituency.length <= 3}
                >
                  Add Constituency
                </Button>
              </Form>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default NewConstituencyPage;
