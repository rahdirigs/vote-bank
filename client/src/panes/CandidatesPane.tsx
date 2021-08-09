import React, { useState } from 'react';
import { Form, Row, Table } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

type IParty = {
  name: string;
  alliance: number;
  seatsContested: number;
  seatsWon: number;
  voteCount: number;
};

type ICandidate = {
  name: string;
  party: number;
  constituency: number;
  voteCount: number;
  won: boolean;
};

type IConstituency = {
  name: string;
  region: number;
  voteCount: number;
  startDate: string;
  endDate: string;
  pincodes: string[];
};

type IRegion = {
  name: string;
  voteCount: number;
};

type IProps = {
  regions: IRegion[];
  constituencies: IConstituency[];
  alliances: IAlliance[];
  parties: IParty[];
  candidates: ICandidate[];
};

const CandidatesPane = ({
  regions,
  constituencies,
  alliances,
  parties,
  candidates,
}: IProps) => {
  const [constituency, setConstituency] = useState<number>(
    constituencies.length
  );

  return (
    <>
      <Row className='my-3 text-center'>
        <h1>Candidates</h1>
      </Row>
      <FormContainer>
        <Form>
          <Form.Group controlId='constituency' className='my-3'>
            <Form.Label>Filter by Constituency</Form.Label>
            <Form.Control
              as='select'
              value={constituency}
              onChange={(e) => setConstituency(Number(e.target.value))}
            >
              {constituencies.map((constituency, id) => (
                <option key={id} value={id}>
                  {constituency.name}
                </option>
              ))}
              <option key={constituencies.length} value={constituencies.length}>
                All constituencies
              </option>
            </Form.Control>
          </Form.Group>
        </Form>
      </FormContainer>
      <Table striped bordered hover responsive className='my-3 text-center'>
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Candidate Name</th>
            <th>Constituency</th>
            <th>Region</th>
            <th>Party</th>
            <th>Alliance</th>
            <th>Votes</th>
            <th>Won the Seat</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(
            (candidate, id) =>
              (Number(candidate.constituency) === constituency ||
                constituency === constituencies.length) && (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{candidate.name}</td>
                  <td>{constituencies[candidate.constituency].name}</td>
                  <td>
                    {regions[constituencies[candidate.constituency].region]}
                  </td>
                  <td>{parties[candidate.party].name}</td>
                  <td>{alliances[parties[candidate.party].alliance].name}</td>
                  <td>{candidate.voteCount}</td>
                  <td>{candidate.won ? 'Yes' : 'No'}</td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default CandidatesPane;
