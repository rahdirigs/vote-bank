import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type IProps = {
  electionId: string;
  regions: IRegion[];
};

type IRegion = {
  name: string;
  voteCount: number;
};

const RegionsPane = ({ electionId, regions }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to={`/new-region/${electionId}`}>
            <Button variant='success'>New Region</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover responsive bordered className='my-2 text-center'>
        <thead>
          <tr>
            <th>Region ID</th>
            <th>Region Name</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{region.name}</td>
              <td>{region.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default RegionsPane;
