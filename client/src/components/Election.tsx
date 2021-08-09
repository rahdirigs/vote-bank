import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { IElection } from '../custom/interfaces/election.interface';

interface IProps {
  election: IElection;
}

const Election = ({ election }: IProps) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/elections/${election._id}`}>
        <Card.Img src='/election.png' alt='Election' variant='top' />
      </Link>
      <Card.Body>
        <Link
          to={`/elections/${election._id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title as='div'>
            <strong>{election.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div' className='my-3'>
          <strong>Owner: </strong>
          {election.owner}
        </Card.Text>
        <LinkContainer to={`/elections/${election._id}`}>
          <Button variant='primary' className='btn-block'>
            Select and Proceed
          </Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default Election;
