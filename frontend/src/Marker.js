import React from 'react';

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
    <span className="marker__timestamp">{timestamp.toLocaleDateString('en-CA')}</span>
    {
      regions.map((region) => (
        <span className="marker__region">{region}</span>
      ))
    }
    <span className="marker__richtext">{richtext}</span>
    <a className="marker__richtext" href={link}>Source</a>
  </div>
);

export default Marker;
