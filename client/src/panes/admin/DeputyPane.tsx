import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IUser } from '../../custom/interfaces/user.interface';

type IProps = {
  users: IUser[];
};

const DeputyPane = ({ users }: IProps) => {
  return (
    <>
      <Row className='my-3'>
        <Col>
          <LinkContainer to='/new-deputy'>
            <Button variant='primary'>New Deputy</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped hover bordered responsive className='my-2 text-center'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>UserName</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {users.map(
            (user, i) =>
              user.isDeputy && (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.contact}</td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default DeputyPane;
