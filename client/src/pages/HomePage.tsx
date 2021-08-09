import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Election from '../components/Election';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listElections } from '../store/action-creators/election.action.creators';
import { RootState } from '../store/root.reducer';

const HomePage = () => {
  const dispatch = useDispatch();

  const electionList = useSelector((state: RootState) => state.electionList);
  const { loading, error, elections } = electionList;

  useEffect(() => {
    dispatch(listElections());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Row className='text-center'>
            <h1>Ongoing elections</h1>
          </Row>
          <Row>
            {elections &&
              elections.map(
                (election) =>
                  election.ongoing && (
                    <Col key={election._id} sm={12} md={6} lg={4} xl={3}>
                      <Election election={election} />
                    </Col>
                  )
              )}
          </Row>
        </>
      )}
    </>
  );
};

export default HomePage;
