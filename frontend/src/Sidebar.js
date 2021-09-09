import React from 'react';
import LocationSearch from './LocationSearch';
import IncidentList from './IncidentList';
import logo from './images/logo.svg';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <header className="header">
        <img className="header__logo" src={logo}/>
        <h1 className="header__title">global-conflicts.org</h1>
      </header>
      <hr />
      <LocationSearch />
      <hr />
      <IncidentList />
    </div>
  );
}

export default Sidebar;
