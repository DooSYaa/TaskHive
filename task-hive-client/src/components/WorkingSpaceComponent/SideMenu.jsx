import { useState } from 'react';
import './sideMenu.css';
import Button from '../ButtonComponent/Button';

function SideMenu({ activeTab, setActiveTab, menuItems }) {
  return (
    <div className="side-menu">
      {menuItems.map(item => (
        <Button
          key={item.id}
          variant={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export default SideMenu;
