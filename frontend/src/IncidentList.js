import React, { useCallback } from 'react';
import { setIncident } from './redux/actions.js'
import useFilteredIncidents from './redux/useFilteredIncidents.js'
import LocationMarkerWithLink from './components/LocationMarkerWithLink';
import parse from 'html-react-parser';
import wiki2html from './helpers/wiki2html';
import { useSelector } from 'react-redux'
import logo from './images/logo.svg';

const selectTimestamp = (state) => state.timestamp;

const baseurl = 'https://en.wikipedia.org/wiki/'

const IncidentListItem = ({ item }) => {

  const onSelectIncident = useCallback(({ target }) => {
    setIncident(item);
  }, [setIncident, item]);

  return (
    <>
      
      {item.firstOfDate
        ? <span className="incident-list__divider incident-list__divider--date">{item.timestamp.toLocaleString('en-us', {weekday: 'short'})}, {item.timestamp.toLocaleString('en-us', {dateStyle: 'short'})} </span>
        : <div className="incident-list__divider incident-list__divider--divider"></div>
      }
      <div className="incident-list__item" onClick={onSelectIncident}>
        {parse(wiki2html(item.wikitext, baseurl), {
          replace: (node) => {
            if (node.name === "a") {
              const name = node.children[0].data;
              if (name in item.coordinates) {
                const url = node.attribs.href;
                return <LocationMarkerWithLink name={name} url={url} />
              }
            }
          }
        })}
      </div>
    </>
  );
}

const IncidentList = () => {
  const incidents = useFilteredIncidents();
  const timestamp = useSelector(selectTimestamp);

  return (
    <div className="incident-list">

      <img className="header__logo" src={logo} alt="Logo" />

      {
        incidents.map(item => <IncidentListItem key={item.key} item={item} />)
      }

      <footer className="footer">
        Last updated on {timestamp.toLocaleString('en-us', {dateStyle: 'short', timeStyle: 'short'})} using data from <a href="https://en.wikipedia.org/wiki/Portal:Current_events">Wikipedia.org</a>
      </footer>

    </div>
  );
}

export default IncidentList;
