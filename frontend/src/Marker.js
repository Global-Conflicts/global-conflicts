import React from 'react';
import parse from 'html-react-parser';

const Marker = ({
  id,
  date,
  plaintext,
  richtext,
  regions,
  coordinates,
  url
}) => (
  <div className="marker__container">
    <div className="marker__tags">
      <span className="marker__timestamp">{date}</span>
      {
        regions.map((region) => (
          <span className="marker__region">{region}</span>
        ))
      }
    </div>
    <span className="marker__richtext">{plaintext}</span>
    <a className="marker__source" href={url} target="_blank">Source</a>
  </div>
);

export default Marker;
