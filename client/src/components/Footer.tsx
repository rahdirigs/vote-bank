import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>Vote Bank &copy; 2021 All Rights Reserved</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
