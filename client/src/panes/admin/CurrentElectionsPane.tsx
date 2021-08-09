import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { listElections } from '../../store/action-creators/election.action.creators';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';

const CurrentElectionsPane = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const electionList = useSelector((state: RootState) => state.electionList);

  const { userInfo } = userLogin;
  const { loading, error, elections } = electionList;

  useEffect(() => {
    if (userInfo && !userInfo.isAdmin) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
    dispatch(listElections());
  }, [userInfo, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='my-3 text-center'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {elections &&
              elections.map(
                (election) =>
                  election.ongoing && (
                    <tr key={election._id}>
                      <td>{election.title}</td>
                      <td>{election.description}</td>
                      <td>{election.owner}</td>
                      <td>
                        <LinkContainer to={`/admin/elections/${election._id}`}>
                          <Button className='btn-sm' variant='primary'>
                            <i className='fas fa-cogs' />
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CurrentElectionsPane;
