import React from 'react';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import CurrentElectionsPane from '../../panes/admin/CurrentElectionsPane';
import PastElectionsPane from '../../panes/PastElectionsPane';

const ElectionsPage = () => {
  return (
    <>
      <Row className='text-center'>
        <h1>Elections</h1>
      </Row>
      <Row className='my-3'>
        <Col>
          <LinkContainer to='/new-election'>
            <Button variant='success'>New Election</Button>
          </LinkContainer>
        </Col>
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
