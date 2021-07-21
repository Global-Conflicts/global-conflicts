import React, { useCallback } from 'react';
import { setRegion, setIncident } from './redux/actions.js'
import useFilteredIncidents from './redux/useFilteredIncidents.js'

const IncidentListItem = ({ item }) => {

  const onSelectIncident = useCallback(({ target }) => {
    setIncident(item);
  }, [setIncident, item]);

  return (
    <div className="incident-list__item" onClick={onSelectIncident}>
      <span className="incident-list__item-timestamp">{item.timestamp.toLocaleDateString('en-CA')}</span>
      <span className="incident-list__item-preview">{item.plaintext}</span>
    </div>
  );
}

const IncidentList = () => {
  const incidents = useFilteredIncidents();

  return (
    <div className="incident-list">
      {
        incidents.map(item => <IncidentListItem key={item.id} item={item} />)
      }
    </div>
  );
}

export default IncidentList;
