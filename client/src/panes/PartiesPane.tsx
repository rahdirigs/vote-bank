import React, { useEffect } from 'react';
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

type IProps = {
  alliances: IAlliance[];
  parties: IParty[];
};

const PartiesPane = ({ alliances, parties }: IProps) => {
  useEffect(() => {
    parties.sort((a, b) => b.seatsWon - a.seatsWon);
  }, []);

  return (
    <>
      <Row className='my-3 text-center'>
        <h1>Parties</h1>
      </Row>
      <Table striped bordered hover responsive className='my-3 text-center'>
        <thead>
          <tr>
            <th>Party ID</th>
            <th>Party Name</th>
            <th>Alliance</th>
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
