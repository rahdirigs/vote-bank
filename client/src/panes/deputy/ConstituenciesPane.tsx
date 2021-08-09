import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type IProps = {
  electionId: string;
  constituencies: IConstituency[];
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

const ConstituenciesPane = ({ electionId, constituencies, region }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/deputy/new-constituency/${electionId}`}>
            <Button variant='success'>New Constituency</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Constituency ID</th>
            <th>Constituency Name</th>
            <th>Poll Start Date</th>
            <th>Poll End Date</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {constituencies.map(
            (constituency, id) =>
              Number(constituency.region) === Number(region) && (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{constituency.name}</td>
                  <td>{constituency.startDate}</td>
                  <td>{constituency.endDate}</td>
                  <td>{constituency.voteCount}</td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default ConstituenciesPane;
