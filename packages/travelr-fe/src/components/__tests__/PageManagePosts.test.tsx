import { ListItem, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
  DUMMY_POSTS,
  DUMMY_POSTS_STORE,
  DUMMY_USER_STORE,
} from '../../config/dummies';
import { PageManagePosts } from '../PageManagePosts';

describe('PageManagePosts component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    mock = {
      actions: {
        fetchMyPosts: jest.fn(),
        deletePosts: jest.fn(),
        selectMyPosts: jest.fn(),
        selectMyPostsAll: jest.fn(),
        selectMyPostsReset: jest.fn(),
        openDialog: jest.fn(),
      },
      history: { push: jest.fn() },
    };

    wrapper = shallow(
      <PageManagePosts
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        classes={{}}
        fetchMyPosts={mock.actions.fetchMyPosts}
        deletePosts={mock.actions.deletePosts}
        selectMyPosts={mock.actions.selectMyPosts}
        selectMyPostsAll={mock.actions.selectMyPostsAll}
        selectMyPostsReset={mock.actions.selectMyPostsReset}
        openDialog={mock.actions.openDialog}
      />,
    );
  });

  test('shows menu', () => {
    expect(
      wrapper
        .find(Button)
        .children()
        .text(),
    ).toBe('一括');
    expect(
      wrapper
        .find(MenuItem)
        .at(0)
        .find(ListItemText)
        .prop('primary'),
    ).toBe('すべて選択');
    expect(
      wrapper
        .find(MenuItem)
        .at(1)
        .find(ListItemText)
        .prop('primary'),
    ).toBe('選択を解除');
    expect(
      wrapper
        .find(MenuItem)
        .at(2)
        .find(ListItemText)
        .prop('primary'),
    ).toBe('選択した投稿を削除');
  });

  test('fetchMyPosts() called on componentDidMount', () => {
    expect(mock.actions.fetchMyPosts).toHaveBeenCalledTimes(1);
  });

  test('fetchMyPosts() called if user is changed', () => {
    wrapper.setProps({ user: { userId: 'someNewId' } });
    expect(mock.actions.fetchMyPosts).toHaveBeenCalledTimes(2);
  });

  test('selectMyPostsAll() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(0)
      .simulate('click');
    expect(mock.actions.selectMyPostsAll).toHaveBeenCalledTimes(1);
  });

  test('selectMyPostsReset() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(1)
      .simulate('click');
    expect(mock.actions.selectMyPostsReset).toHaveBeenCalledTimes(1);
  });

  test('openDialog() called when the menu item is clicked', () => {
    // simulate selecting post
    wrapper.setProps({
      posts: {
        ...DUMMY_POSTS_STORE,
        myPostsSelected: [DUMMY_POSTS_STORE.myPosts[0].postId],
      },
    });
    // simulate clicking 'delete' button
    wrapper
      .find(MenuItem)
      .at(2)
      .simulate('click');
    expect(mock.actions.openDialog).toHaveBeenCalledTimes(1);
  });

  test('selectMyPosts() called when a checkbox is clicked', () => {
    wrapper
      .find(Checkbox)
      .at(2)
      .simulate('change');

    expect(mock.actions.selectMyPosts).toHaveBeenCalledTimes(1);
    expect(mock.actions.selectMyPosts).toHaveBeenCalledWith([
      DUMMY_POSTS[2].postId,
    ]);
  });

  test('has links to the posts', () => {
    expect(
      wrapper
        .find(ListItem)
        .filterWhere(node => node.prop('to').includes('/post/')),
    ).toHaveLength(DUMMY_POSTS.length);
  });
});
