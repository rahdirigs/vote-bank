import React, { useEffect } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import CurrentElectionsPane from '../panes/CurrentElectionsPane';
import PastElectionsPane from '../panes/PastElectionsPane';
import { userActionTypes } from '../store/action-types/user.action.types';
import { RootState } from '../store/root.reducer';

const ElectionsPage = ({ history }: RouteComponentProps) => {
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        history.push('/admin/elections');
      } else if (userInfo.isDeputy) {
        history.push('/deputy/elections');
      }
    } else {
      dispatch({ type: userActionTypes.USER_LOGOUT });
    }
  }, [userInfo, history, dispatch]);

  return (
    <>
      <Row className='text-center'>
        <h1>Elections</h1>
      </Row>
      <Tabs defaultActiveKey='active-elections'>
        <Tab eventKey='active-elections' title='Active Elections'>
          <CurrentElectionsPane />
        </Tab>
        <Tab eventKey='past-elections' title='Past Elections'>
          <PastElectionsPane />
        </Tab>
      </Tabs>
    </>
  );
};

export default ElectionsPage;
