// @flow
import postsReducer from '../postsReducer';
import types from '../../actions/types';
import { DUMMY_POSTS, DUMMY_POSTS_IDS } from '../../config/dummies';
import type { PostsStore } from '../../config/types';

const INITIAL_STATE: PostsStore = {
  all: [],
  allFilter: {},
  myPosts: [],
  myPostsSelected: [],
  currentPost: null,
};

describe('posts reducer', () => {
  test('FETCH_ALL_POSTS_SUCCESS', () => {
    const action = {
      type: types.FETCH_ALL_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    };

    const expected = {
      ...INITIAL_STATE,
      all: DUMMY_POSTS,
    };

    expect(postsReducer(undefined, action)).toEqual(expected);
  });

  test('FETCH_POST_START', () => {
    const stateHavingCurrentPost = {
      ...INITIAL_STATE,
      currentPost: DUMMY_POSTS[0],
    };

    const action = {
      type: types.FETCH_POST_START,
    };

    const expected = {
      ...INITIAL_STATE,
      currentPost: null,
    };

    expect(postsReducer(stateHavingCurrentPost, action)).toEqual(expected);
  });

  test('FETCH_POST_SUCCESS', () => {
    const action = {
      type: types.FETCH_POST_SUCCESS,
      payload: DUMMY_POSTS[0],
    };

    const expected = {
      ...INITIAL_STATE,
      currentPost: DUMMY_POSTS[0],
    };

    expect(postsReducer(undefined, action)).toEqual(expected);
  });

  test('FETCH_MY_POSTS_SUCCESS', () => {
    const action = {
      type: types.FETCH_MY_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    };

    const expected = {
      ...INITIAL_STATE,
      myPosts: DUMMY_POSTS,
    };

    expect(postsReducer(undefined, action)).toEqual(expected);
  });

  test('DELETE_MY_POSTS_SUCCESS', () => {
    const action = {
      type: types.DELETE_MY_POSTS_SUCCESS,
    };

    const expected = {
      ...INITIAL_STATE,
      myPostsSelected: [],
    };

    expect(postsReducer(undefined, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS', () => {
    let action = {
      type: types.SELECT_MY_POSTS,
      payload: [1, 2, 3, 4, 5],
    };

    let expected = {
      ...INITIAL_STATE,
      myPostsSelected: [1, 2, 3, 4, 5],
    };

    const currentState = postsReducer(undefined, action);

    expect(currentState).toEqual(expected);

    action = {
      type: types.SELECT_MY_POSTS,
      payload: [1, 3, 5],
    };

    expected = {
      ...INITIAL_STATE,
      myPostsSelected: [2, 4],
    };

    expect(postsReducer(currentState, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS_ALL', () => {
    const state = {
      ...INITIAL_STATE,
      myPosts: DUMMY_POSTS,
    };

    const action = {
      type: types.SELECT_MY_POSTS_ALL,
    };

    const expected = {
      ...state,
      myPostsSelected: DUMMY_POSTS_IDS,
    };

    expect(postsReducer(state, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS_RESET', () => {
    const state = {
      ...INITIAL_STATE,
      myPostsSelected: [1, 2, 3, 4, 5],
    };

    const action = {
      type: types.SELECT_MY_POSTS_RESET,
    };

    const expected = {
      ...state,
      myPostsSelected: [],
    };

    expect(postsReducer(state, action)).toEqual(expected);
  });
});
