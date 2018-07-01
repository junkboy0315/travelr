import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import Menu from '../Menu';

jest.mock('../Menu');

describe('Header component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeAll(() => {
      Menu.mockImplementation(() => ({ render: () => <div>mock</div> }));

      wrapper = mount(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
    });

    test('shows site title', () => {
      expect(
        wrapper
          .find(Button)
          .at(0)
          .text(),
      ).toContain('Travelr');
    });

    test('shows humberger icon', () => {
      expect(wrapper.find(IconButton)).toHaveLength(1);
    });

    test('shows Signup/In button', () => {
      expect(
        wrapper
          .find(Button)
          .at(1)
          .html(),
      ).toContain('Signup');
    });
  });

  describe('if user is signed in', () => {
    let wrapper;

    beforeAll(() => {
      const store = { user: { userId: 'dummyId', displayName: 'dummyName' } };
      wrapper = mount(
        <BrowserRouter>
          <Header {...store} />
        </BrowserRouter>,
      );
    });

    test('shows userStatusButton', () => {
      const userStatusButton = wrapper.find(Button).at(1);

      expect(userStatusButton.find(AccountCircle)).toHaveLength(1);
      expect(userStatusButton.text()).toContain('dummyName');
    });
  });
});
