import { hashSync } from 'bcryptjs';

const users = [
  {
    name: 'Deputy 1',
    username: 'deputy1@votebank',
    password: hashSync('deputy', 10),
    contact: '0000000001',
    pincode: '000000',
    isDeputy: true,
  },
];

export default users;
