import React, { ReactChild, ReactChildren } from 'react';
import { Alert } from 'react-bootstrap';

interface IProps {
  variant: string;
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

const Message = ({ variant, children }: IProps) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'danger',
};

export default Message;
