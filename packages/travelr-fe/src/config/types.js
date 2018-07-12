// @flow

export type Action<T> = {
  type: string,
  payload: T,
};

export type Comment = {
  commentId: number,
  userId: string,
  postId: number,
  datetime: string,
  comment: string,
  displayName: string,
};

export type Post = {
  postId: number,
  userId: string,
  oldImageUrl: string,
  newImageUrl: string,
  description?: string,
  shootDate: string,
  lng: number,
  lat: number,
  viewCount: number,
  displayName: string,
  likedCount: number,
  commentsCount: number,
  comments: Array<Comment>,
  likeStatus?: boolean,
};

export type NewPost = {
  oldImageFile: any,
  newImageFile: any,
  description?: string,
  shootDate: string,
  lng: number,
  lat: number,
};

export type PostToEdit = {
  postId: number,
  oldImageUrl?: string,
  newImageUrl?: string,
  description?: string,
  shootDate?: string,
  lng?: number,
  lat?: number,
};

export type NewUserInfo = {
  displayName: string,
};

export type FilterCriterion = {
  userId?: string,
  displayName?: string,
  description?: string,
  minDate?: string,
  maxDate?: string,
  lng?: number,
  lat?: number,
  radius?: number,
  minViewCount?: number,
  maxViewCount?: number,
  minLikedCount?: number,
  maxLikedCount?: number,
  minCommentsCount?: number,
  maxCommentsCount?: number,
  limit?: number,
};

export type TaskName = 'fetch' | 'signin' | 'createPost' | 'editPost';

// required info to authenticate with the main API
export type AuthSeed = {
  token: string,
  displayName: string,
};

export type AppStore = {
  snackbarQueue: Array<string>,
  tasksInProgress: Array<TaskName>,
};

export type PostsStore = {
  all: Array<Post>,
  allFilter: any, // TODO specify this
  myPosts: Array<Post>,
  myPostsSelected: Array<number>,
  currentPost: ?Post,
};

export type UserStore = {
  userId: string,
  token: string,
  displayName: string,
  isAdmin: boolean,
  earnedLikes: number,
  earnedComments: number,
  earnedViews: number,
};

export type LatLng = {
  lat: number,
  lng: number,
};
