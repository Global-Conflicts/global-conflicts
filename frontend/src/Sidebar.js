import React from 'react';
import LocationSearch from './LocationSearch';
import IncidentList from './IncidentList';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <header className="header">
        <img className="header__logo" src=""/>
        <h1 className="header__title">Global Conflicts</h1>
      </header>
      <hr />
      <LocationSearch />
      <hr />
      <IncidentList />
    </div>
  );
}

export default Sidebar;
