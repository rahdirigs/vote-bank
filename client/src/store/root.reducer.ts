import { combineReducers } from 'redux';
import {
  electionCreateReducer,
  electionEndReducer,
  electionListReducer,
} from './reducers/election.reducer';
import {
  adminAddReducer,
  deputyAddReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from './reducers/user.reducer';

const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  adminAdd: adminAddReducer,
  deputyAdd: deputyAddReducer,
  electionList: electionListReducer,
  electionCreate: electionCreateReducer,
  electionEnd: electionEndReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
