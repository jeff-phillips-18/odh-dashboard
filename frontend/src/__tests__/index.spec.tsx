/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { store } from '../redux/store/store';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../app/App';
import Header from '../app/Header';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLocation: () => '/',
  };
});
jest.mock('react', () => {
  const React = jest.requireActual('react');
  jest.mock('react', () => {
    const React = jest.requireActual('react');
    return {
      ...React,
      Suspense: ({ children }) => children,
      lazy: (factory) => factory(),
    };
  });

  return React;
});

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: () => ({
      user: 'Test User',
      notifications: [],
    }),
  };
});

const dashboardConfig = {
  disableInfo: false,
  enablement: true,
};

jest.mock('../utilities/useWatchDashboardConfig', () => ({
  useWatchDashboardConfig: () => ({
    dashboardConfig,
    loaded: true,
    loadError: null,
  }),
}));
describe('Index test', () => {
  it('should render a basic component', () => {
    const component = mount(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>,
    );
    expect(component.html()).toMatchSnapshot('basic');
  });
  it('should render the header correctly', () => {
    const component = mount(
      <Provider store={store}>
        <Router>
          <Header isNavOpen={false} onNavToggle={() => {}} onNotificationsClick={() => {}} />
        </Router>
      </Provider>,
    );
    expect(component.html()).toMatchSnapshot('header');
  });
});
