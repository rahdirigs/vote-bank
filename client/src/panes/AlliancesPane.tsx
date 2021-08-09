import React from 'react';
import { Row, Table } from 'react-bootstrap';

type IAlliance = {
  name: string;
  seatsWon: number;
  voteCount: number;
};

type IProps = {
  alliances: IAlliance[];
};

const AlliancesPane = ({ alliances }: IProps) => {
  return (
    <>
      <Row className='my-3 text-center'>
        <h1>Alliances</h1>
      </Row>
      <Table striped bordered hover responsive className='my-3 text-center'>
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
