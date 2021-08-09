import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type IProps = {
  electionId: string;
  alliances: IAlliance[];
};

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

const AlliancesPane = ({ electionId, alliances }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/new-alliance/${electionId}`}>
            <Button variant='success'>New Alliance</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Alliance ID</th>
            <th>Alliance Name</th>
            <th>Seats Won</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {alliances.map((alliance, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{alliance.name}</td>
              <td>{alliance.seatsWon}</td>
              <td>{alliance.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AlliancesPane;
