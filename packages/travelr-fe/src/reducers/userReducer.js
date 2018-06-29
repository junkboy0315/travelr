// @flow
import type { Action, UserStore } from '../config/types';
import actionTypes from '../actions/types';

const INITIAL_STATE: UserStore = {
  userId: '',
  token: '',
  displayName: '',
  isAdmin: false,
  earnedLikes: 0,
  earnedComments: 0,
  earnedViews: 0,
};

export default (
  state: UserStore = INITIAL_STATE,
  action: Action<UserStore>,
): UserStore => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INFO_SUCCESS: {
      return action.payload;
    }
    case actionTypes.UPDATE_USER_INFO_SUCCESS: {
      const { displayName } = action.payload;

      return {
        ...state,
        displayName,
      };
    }
    case actionTypes.DELETE_USER_SUCCESS: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};
