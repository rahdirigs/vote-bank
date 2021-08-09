import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type IProps = {
  electionId: string;
  deputies: ISubOwner[];
  regions: IRegion[];
};

type ISubOwner = {
  username: string;
  region: number;
};

type IRegion = {
  name: string;
  voteCount: number;
};

const DeputiesPane = ({ electionId, deputies, regions }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/appoint-deputy/${electionId}`}>
            <Button variant='success'>Appoint Deputy</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Deputy ID</th>
            <th>Deputy Username</th>
            <th>Region Name</th>
          </tr>
        </thead>
        <tbody>
          {deputies.map((deputy, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{deputy.username}</td>
              <td>{regions[deputy.region].name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DeputiesPane;
