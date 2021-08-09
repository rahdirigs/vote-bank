import React, { useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import FormContainer from '../../components/FormContainer';

type IProps = {
  electionId: string;
  constituencies: IConstituency[];
  parties: IParty[];
  candidates: ICandidate[];
  region: number;
};

type IConstituency = {
  name: string;
  region: number;
  voteCount: number;
  startDate: string;
  endDate: string;
  pincodes: string[];
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

const CandidatesPane = ({
  electionId,
  constituencies,
  parties,
  candidates,
  region,
}: IProps) => {
  const [selectedConstituency, setSelectedConstituency] = useState<number>(
    constituencies.length
  );

  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/deputy/new-candidate/${electionId}`}>
            <Button variant='success'>New Candidate</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row className='my-3'>
        <Col>
          <FormContainer>
            <h3>Filter by Constituency</h3>
            <Form>
              <Form.Group controlId='selectedConstituency' className='my-3'>
                <Form.Label>Select Constituency from the Region</Form.Label>
                <Form.Control
                  as='select'
                  value={selectedConstituency}
                  onChange={(e) =>
                    setSelectedConstituency(Number(e.target.value))
                  }
                >
                  {constituencies.map(
                    (constituency, id) =>
                      Number(constituency.region) === Number(region) && (
                        <option key={id} value={id}>
                          {constituency.name}
                        </option>
                      )
                  )}
                  <option
                    key={constituencies.length}
                    value={constituencies.length}
                  >
                    All constituencies
                  </option>
                </Form.Control>
              </Form.Group>
            </Form>
          </FormContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Candidate Name</th>
            <th>Party Name</th>
            <th>Constituency Name</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, id) =>
            selectedConstituency === constituencies.length
              ? Number(region) ===
                  Number(constituencies[candidate.constituency].region) && (
                  <tr key={id}>
                    <td>{id + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{parties[candidate.party].name}</td>
                    <td>{constituencies[candidate.constituency].name}</td>
                    <td>{candidate.voteCount}</td>
                  </tr>
                )
              : selectedConstituency === Number(candidate.constituency) && (
                  <tr key={id}>
                    <td>{id + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{parties[candidate.party].name}</td>
                    <td>{constituencies[candidate.constituency].name}</td>
                    <td>{candidate.voteCount}</td>
                  </tr>
                )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default CandidatesPane;
