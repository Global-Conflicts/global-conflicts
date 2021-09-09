import React from 'react';
import parse from 'html-react-parser';
import wiki2html from './helpers/wiki2html';

const baseurl = 'https://en.wikipedia.org/wiki/'

const Marker = ({
  id,
  date,
  plaintext,
  wikitext,
  regions,
  coordinates,
  casualty_count,
  casualty_description,
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
      {casualty_description &&
        <span className="marker__casualties">{casualty_description}</span>
      }
    </div>
    <span className="marker__richtext">{parse(wiki2html(wikitext, baseurl))}</span>
    <a className="marker__source" href={url} target="_blank">Link to Wikipedia</a>
  </div>
);

export default Marker;
