import dotenv from 'dotenv';
import connectDb from './config/database';
import users from './data/users';
import { Election } from './models/elections/election.model';
import { User } from './models/users/user.model';

dotenv.config();
connectDb();

const importData = async () => {
  try {
    await User.insertMany(users);
    console.log('Data imported successfully....');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Election.deleteMany();
    console.log('Data destroyed successfully....');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
