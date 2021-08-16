import React from 'react';
import parse from 'html-react-parser';

const Marker = ({
  id,
  timestamp,
  plaintext,
  richtext,
  regions,
  coordinates,
  link
}) => (
  <div className="marker__container">
    <div className="marker__tags">
      <span className="marker__timestamp">{timestamp.toLocaleDateString('en-CA')}</span>
      {
        regions.map((region) => (
          <span className="marker__region">{region}</span>
        ))
      }
    </div>
    <span className="marker__richtext">{parse(richtext)}</span>
    <a className="marker__source" href={link}>Source</a>
  </div>
);

export default Marker;
