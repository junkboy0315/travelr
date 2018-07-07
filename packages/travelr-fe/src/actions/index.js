// @flow
import type {
  Comment,
  PostToEdit,
  FilterCriterion,
  NewPost,
  NewUserInfo,
  Post,
  UserStore,
} from '../config/types';
import config from '../config';
import actionTypes from './types';
import type { Dispatch } from 'redux';

const actions = {};

actions.getOrCreateUserInfo = (token: string, displayName?: string) => async (
  dispatch: Dispatch<any>,
) => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        authorization: token,
      },
      body: displayName ? JSON.stringify({ displayName }) : '',
    };
    const response = await fetch(`${config.apiUrl}users`, fetchOptions);

    if (!response.ok) {
      dispatch({
        type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
      });
      return;
    }

    const userInfo = await response.json();
    dispatch({
      type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS,
      payload: { ...userInfo, token },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
    });
  }
};

actions.fetchUserInfo = (user: UserStore) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;
  try {
    const response = await fetch(`${config.apiUrl}users/token`, {
      headers: {
        authorization: token,
      },
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.FETCH_USER_INFO_FAIL, // TODO: toast
      });
      return;
    }

    const userInfo = await response.json();
    dispatch({
      type: actionTypes.FETCH_USER_INFO_SUCCESS,
      payload: { ...userInfo, token },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_USER_INFO_FAIL, // TODO: toast
    });
  }
};

actions.updateUserInfo = (user: UserStore, newUserInfo: NewUserInfo) => async (
  dispatch: Dispatch<any>,
) => {
  const { userId, token } = user;
  const { displayName } = newUserInfo;
  try {
    const response = await fetch(`${config.apiUrl}users/${userId}`, {
      method: 'PUT',
      headers: {
        authorization: token,
      },
      body: JSON.stringify({ displayName }),
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.UPDATE_USER_INFO_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: actionTypes.UPDATE_USER_INFO_SUCCESS, // TODO: toast
      payload: { displayName },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.UPDATE_USER_INFO_FAIL, // TODO: toast
    });
  }
};

actions.deleteUser = (user: UserStore, callback: any => any) => async (
  dispatch: Dispatch<any>,
) => {
  const { userId, token } = user;
  try {
    const response = await fetch(`${config.apiUrl}users/${userId}`, {
      method: 'DELETE',
      headers: {
        authorization: token,
      },
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.DELETE_USER_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: actionTypes.DELETE_USER_SUCCESS, // TODO: toast
    });
    callback();
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_USER_FAIL, // TODO: toast
    });
  }
};

actions.fetchAllPosts = (criterion: FilterCriterion = {}) => async (
  dispatch: Dispatch<any>,
) => {
  const {
    userId,
    displayName,
    description,
    minDate,
    maxDate,
    lng,
    lat,
    radius,
    minViewCount,
    maxViewCount,
    minLikedCount,
    maxLikedCount,
    minCommentsCount,
    maxCommentsCount,
    limit,
  } = criterion;

  const params = [];

  if (userId) params.push(`user_id=${userId}`);
  if (displayName) params.push(`display_name=${displayName}`);
  if (description) params.push(`description=${description}`);
  if (minDate) params.push(`min_date=${minDate}`);
  if (maxDate) params.push(`max_date=${maxDate}`);
  if (lng) params.push(`lng=${lng}`);
  if (lat) params.push(`lat=${lat}`);
  if (radius) params.push(`radius=${radius}`);
  if (minViewCount) params.push(`min_view_count=${minViewCount}`);
  if (maxViewCount) params.push(`max_view_count=${maxViewCount}`);
  if (minLikedCount) params.push(`min_liked_count=${minLikedCount}`);
  if (maxLikedCount) params.push(`max_liked_count=${maxLikedCount}`);
  if (minCommentsCount) params.push(`min_comments_count=${minCommentsCount}`);
  if (maxCommentsCount) params.push(`max_comments_count=${maxCommentsCount}`);
  if (limit) params.push(`limit=${limit}`);

  let queryParams = '';
  if (params.length) queryParams = `?${params.join('&')}`;

  try {
    const response = await fetch(`${config.apiUrl}posts${queryParams}`);
    const posts = await response.json();
    dispatch({
      type: actionTypes.FETCH_ALL_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_ALL_POSTS_FAIL,
    });
  }
};

actions.fetchPost = (postId: number, user: UserStore) => async (
  dispatch: Dispatch<any>,
) => {
  dispatch({
    type: actionTypes.FETCH_POST_START,
    payload: postId,
  });

  try {
    let url;
    if (user && user.userId) {
      url = `${config.apiUrl}posts/${postId}?user_id=${user.userId}`;
    } else {
      url = `${config.apiUrl}posts/${postId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      dispatch({
        type: actionTypes.FETCH_POST_FAIL,
      });
      return;
    }

    const post = await response.json();

    dispatch({
      type: actionTypes.FETCH_POST_SUCCESS,
      payload: post,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_POST_FAIL,
    });
  }
};

actions.createPost = (
  user: UserStore,
  newPost: NewPost,
  successCallback: any => any,
) => async (dispatch: Dispatch<any>) => {
  try {
    const response = await fetch(`${config.apiUrl}posts`, {
      method: 'POST',
      headers: {
        authorization: user.token,
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.CREATE_POST_FAIL,
      });
      return;
    }

    const { postId } = await response.json();
    dispatch({
      type: actionTypes.CREATE_POST_SUCCESS,
      payload: postId,
    });
    successCallback(postId);
  } catch (err) {
    dispatch({
      type: actionTypes.CREATE_POST_FAIL,
    });
  }
};

actions.editPost = (
  user: UserStore,
  postToEdit: PostToEdit,
  successCallback: any => any,
) => async (dispatch: Dispatch<any>) => {
  try {
    const response = await fetch(`${config.apiUrl}posts/${postToEdit.postId}`, {
      method: 'PUT',
      headers: {
        authorization: user.token,
      },
      body: JSON.stringify(postToEdit),
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.EDIT_POST_FAIL,
      });
      return;
    }

    dispatch({
      type: actionTypes.EDIT_POST_SUCCESS,
    });
    successCallback(postToEdit.postId);
  } catch (err) {
    dispatch({
      type: actionTypes.EDIT_POST_FAIL,
    });
  }
};

actions.deletePost = (
  user: UserStore,
  postId: number,
  successCallback: void => void,
) => async (dispatch: Dispatch<any>) => {
  const { token } = user;

  try {
    const response = await fetch(`${config.apiUrl}posts/${postId}`, {
      method: 'DELETE',
      headers: { authorization: token },
    });

    if (!response.ok) {
      // TODO: toast
      dispatch({
        type: actionTypes.DELETE_POST_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: actionTypes.DELETE_POST_SUCCESS, // TODO: toast
    });
    successCallback();
  } catch (err) {
    // TODO: toast
    dispatch({
      type: actionTypes.DELETE_POST_FAIL, // TODO: toast
    });
  }
};

actions.deletePosts = (user: UserStore, postIds: Array<number>) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;

  try {
    const response = await fetch(`${config.apiUrl}posts`, {
      method: 'DELETE',
      headers: { authorization: token },
      body: JSON.stringify(postIds),
    });

    if (!response.ok) {
      // TODO: toast
      dispatch({
        type: actionTypes.DELETE_POSTS_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: actionTypes.DELETE_POSTS_SUCCESS, // TODO: toast
      payload: postIds,
    });
    actions.fetchMyPosts(user)(dispatch);
  } catch (err) {
    // TODO: toast
    dispatch({
      type: actionTypes.DELETE_POSTS_FAIL, // TODO: toast
    });
  }
};

actions.fetchMyPosts = (user: UserStore) => async (dispatch: Dispatch<any>) => {
  const { userId } = user;
  if (!userId) return;
  try {
    const response = await fetch(`${config.apiUrl}posts?user_id=${userId}`);
    if (!response.ok) {
      dispatch({
        type: actionTypes.FETCH_MY_POSTS_FAIL, // TODO: toast
      });
      // TODO: toast
      return;
    }

    const myPosts = await response.json();
    dispatch({
      type: actionTypes.FETCH_MY_POSTS_SUCCESS, // TODO: toast
      payload: myPosts,
    });
  } catch (err) {
    // TODO: toast
    dispatch({
      type: actionTypes.FETCH_MY_POSTS_FAIL, // TODO: toast
    });
  }
};

actions.selectMyPosts = (postIds: Array<number>) => ({
  type: actionTypes.SELECT_MY_POSTS,
  payload: postIds,
});

actions.selectMyPostsAll = () => ({
  type: actionTypes.SELECT_MY_POSTS_ALL,
});

actions.selectMyPostsReset = () => ({
  type: actionTypes.SELECT_MY_POSTS_RESET,
});

actions.createComment = (
  user: UserStore,
  postId: number,
  comment: string,
  successCallback: void => void,
) => async (dispatch: Dispatch<any>) => {
  try {
    const response = await fetch(`${config.apiUrl}posts/${postId}/comments`, {
      method: 'POST',
      headers: { authorization: user.token },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      dispatch({
        type: actionTypes.CREATE_COMMENT_FAIL,
      });
      return;
    }

    dispatch({
      type: actionTypes.CREATE_COMMENT_SUCCESS,
    });

    successCallback();
    await actions.fetchPost(postId, user)(dispatch);
  } catch (err) {
    dispatch({
      type: actionTypes.CREATE_COMMENT_FAIL,
    });
  }
};

actions.deleteComment = (user: UserStore, comment: Comment) => async (
  dispatch: Dispatch<any>,
) => {
  const { postId, commentId } = comment;
  try {
    const response = await fetch(
      `${config.apiUrl}posts/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: { authorization: user.token },
      },
    );

    if (!response.ok) {
      dispatch({
        type: actionTypes.DELETE_COMMENT_FAIL,
      });
      return;
    }

    dispatch({
      type: actionTypes.DELETE_COMMENT_SUCCESS,
    });

    await actions.fetchPost(postId, user)(dispatch);
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_COMMENT_FAIL,
    });
  }
};

actions.toggleLike = (user: UserStore, post: Post) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;
  const { postId } = post;

  try {
    const response = await fetch(
      `${config.apiUrl}posts/${postId}/like/toggle`,
      {
        method: 'POST',
        headers: { authorization: token },
      },
    );

    if (!response.ok) {
      dispatch({
        type: actionTypes.TOGGLE_LIKE_FAIL,
      });
      return;
    }

    dispatch({
      type: actionTypes.TOGGLE_LIKE_SUCCESS,
    });

    await actions.fetchPost(postId, user)(dispatch);
  } catch (err) {
    dispatch({
      type: actionTypes.TOGGLE_LIKE_FAIL,
    });
  }
};

actions.reduceSnackbarQueue = () => ({
  type: actionTypes.REDUCE_SNACKBAR_QUEUE,
});

export default actions;
