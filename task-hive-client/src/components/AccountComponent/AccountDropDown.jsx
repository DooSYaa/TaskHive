import React from 'react';
import Button from '../ButtonComponent/Button';
import { useRef, useEffect } from 'react';

function AccountDropDown({ children }) {
  return <div className="account-dropdown-menu">{children}</div>;
}

export default AccountDropDown;
