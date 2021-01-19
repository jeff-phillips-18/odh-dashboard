import React from 'react';
import { connect } from 'react-redux';
import { Page } from '@patternfly/react-core';
import { detectUser, getComponents } from '../redux/actions/actions';
import Header from './Header';
import Routes from './Routes';

import './App.scss';
import NavSidebar from './NavSidebar';

type AppProps = {
  getComponents: () => void;
  detectUser: () => void;
};

const _App: React.FC<AppProps> = ({ getComponents, detectUser }) => {
  const [isNavOpen, setIsNavOpen] = React.useState(true);

  React.useEffect(() => {
    getComponents();
    detectUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Page
      header={<Header isNavOpen={isNavOpen} onNavToggle={onNavToggle} />}
      sidebar={<NavSidebar isNavOpen={isNavOpen} />}
      className="app"
    >
      <Routes />
    </Page>
  );
};

const mapStateToProps = (state) => {
  return state.appReducer;
};

const mapDispatchToProps = (dispatch) => ({
  getComponents: () => {
    dispatch(getComponents());
  },
  detectUser: () => {
    dispatch(detectUser());
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(_App);

export default App;
