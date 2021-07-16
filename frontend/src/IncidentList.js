import React, { useCallback } from 'react';
import { setRegion } from './redux/actions.js'
import useFilteredIncidents from './redux/useFilteredIncidents.js'

const IncidentListItem = ({ item }) => {
  return (
    <div className="incident-list__item">
      <span className="incident-list__item-timestamp">{item.timestamp.toLocaleDateString('en-CA')}</span>
      <span className="incident-list__item-preview">{item.plaintext}</span>
    </div>
  );
}

const IncidentList = () => {
  const incidents = useFilteredIncidents();

  const onSelectIncident = useCallback(({ target }) => {
    setRegion(target.value);
  });

  return (
    <div className="incident-list">
      {
        incidents.map(item => <IncidentListItem key={item.id} item={item} />)
      }
    </div>
  );
}

export default IncidentList;
