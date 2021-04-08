import React from 'react';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  DropdownItem,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router';

const AUTH_COOKIE = '_oauth_proxy';
const TEST_COOKIE = 'sat_prevExtCmp';

const createCookie = (name: string, value: string, days: number) => {
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  } else {
    expires = '';
  }

  document.cookie = `${name}=${value}${expires}; path=/`;
};

const readCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  createCookie(name, '', -1);
};

type HeaderToolsProps = {
  user: { name: string; token: string };
};

const HeaderTools: React.FC<HeaderToolsProps> = ({ user }) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState<boolean>(false);
  const history = useHistory();

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    document.cookie = `${TEST_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    setUserMenuOpen(false);
    history.push('/');
  };
  const handleShowCookies = () => {
    console.dir(document.cookie);
    console.log(readCookie('_jeffTestCookie'));
    setUserMenuOpen(false);
  };
  const handleAddCookie = () => {
    createCookie('_jeffTestCookie', 'Wtf_Wtf', 3);
    setUserMenuOpen(false);
  };
  const handleDeleteCookie = () => {
    eraseCookie('_jeffTestCookie');
    setUserMenuOpen(false);
  };

  const userMenuItems = [
    <DropdownItem key="logout" onClick={handleLogout}>
      Log out
    </DropdownItem>,
    <DropdownItem key="cookies" onClick={handleShowCookies}>
      Show Cookies
    </DropdownItem>,
    <DropdownItem key="add" onClick={handleAddCookie}>
      Add Cookie
    </DropdownItem>,
    <DropdownItem key="delete" onClick={handleDeleteCookie}>
      Delete Cookie
    </DropdownItem>,
  ];
  const userName = React.useMemo(() => {
    return user?.name?.split('/')?.[0];
  }, [user]);

  return (
    <PageHeaderTools>
      <PageHeaderToolsGroup className="hidden-xs">
        <PageHeaderToolsItem>
          <Dropdown
            toggle={
              <DropdownToggle
                id="toggle-id"
                onToggle={() => setUserMenuOpen(!userMenuOpen)}
                toggleIndicator={CaretDownIcon}
              >
                {userName}
              </DropdownToggle>
            }
            isOpen={userMenuOpen}
            dropdownItems={userMenuItems}
          />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );
};

const mapStateToProps = (state) => ({
  user: state.appReducer.user,
});

export default connect(mapStateToProps)(HeaderTools);
