import React, { useEffect } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import AdminPane from '../../panes/admin/AdminPane';
import DeputyPane from '../../panes/admin/DeputyPane';
import { listUsers } from '../../store/action-creators/user.action.creators';
import { userActionTypes } from '../../store/action-types/user.action.types';
import { RootState } from '../../store/root.reducer';

const DeputiesPage = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state: RootState) => state.userList);
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { users, loading } = userList;
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    } else {
      dispatch(listUsers());
    }
  }, [userInfo, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Row className='text-center my-3'>
            <h2>Admins and Deputies</h2>
          </Row>
          <Tabs defaultActiveKey='admins'>
            <Tab eventKey='admins' title='Administrators'>
              <AdminPane users={users} />
            </Tab>
            <Tab eventKey='deputies' title='Deputies'>
              <DeputyPane users={users} />
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
};

export default DeputiesPage;
