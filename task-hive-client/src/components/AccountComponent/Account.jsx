import React, { useState } from 'react';
import { Mention } from 'primereact/mention';
import './account.model.css';
import Users from '../ModalComponents/Users';
import { useAuth } from '../Context/AuthContext';

export default function BasicDemo() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Hello {user.userName}</h1>
    </div>
  );
}
