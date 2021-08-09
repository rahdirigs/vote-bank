import React from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import CurrentElectionsPane from '../../panes/deputy/CurrentElectionsPane';
import PastElectionsPane from '../../panes/PastElectionsPane';

const ElectionsPage = () => {
  return (
    <>
      <Row className='text-center'>
        <h1>Elections</h1>
      </Row>
      <Tabs defaultActiveKey='active-elections' className='my-3'>
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
