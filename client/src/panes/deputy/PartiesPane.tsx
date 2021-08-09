import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type IProps = {
  electionId: string;
  parties: IParty[];
  alliances: IAlliance[];
};

type IParty = {
  name: string;
  alliance: number;
  seatsContested: number;
  seatsWon: number;
  voteCount: number;
};

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

const PartiesPane = ({ electionId, parties, alliances }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/new-party/${electionId}`}>
            <Button variant='success'>New Party</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Party ID</th>
            <th>Party Name</th>
            <th>Affiliation Alliance</th>
            <th>Seats Contested</th>
            <th>Seats Won</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{party.name}</td>
              <td>{alliances[party.alliance].name}</td>
              <td>{party.seatsContested}</td>
              <td>{party.seatsWon}</td>
              <td>{party.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default PartiesPane;
