import React from 'react';
import { Row, Table } from 'react-bootstrap';

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

const ConstituenciesPane = ({
  regions,
  constituencies,
  alliances,
  parties,
  candidates,
}: IProps) => {
  return (
    <>
      <Row className='my-3 text-center'>
        <h1>Candidates</h1>
      </Row>
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
          </tr>
        </thead>
        <tbody>
          {candidates.map(
            (candidate, id) =>
              candidate.won && (
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
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default ConstituenciesPane;
