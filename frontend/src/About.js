import React from 'react';

const About = ({ close }) => (
  <>
    <h1>About</h1>
    <p><a href="#" onClick={close}>global-conflicts.com</a> is a geovisualization of armed conflicts around the world.</p>
    <p>Data is gathered from the <a href="https://en.wikipedia.org/wiki/Portal:Current_events">Wikipedia Current Events Portal</a> in combination with geodata from <a href="https://www.wikidata.org">Wikidata</a>.</p>
    <p>The Current Events Portal summarizes current news incidents on a daily basis, together with links to sources and related Wikipedia articles.</p>
    <p>The Portal's <a href="https://en.wikipedia.org/wiki/Wikipedia:How_the_Current_events_page_works">guidlines</a> strive for <a href="https://en.wikipedia.org/wiki/Wikipedia:Neutral_point_of_view">neutral reporting</a> and citing <a href="https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources">reliable sources</a>. </p>
    <p>Copyright by Wikipedia and Wikidata editors and contributors under the under the terms of the <a href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License">Creative Commons 4.0 License</a> and, unless otherwise noted, the <a href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_GNU_Free_Documentation_License">GNU Free Documentation License.</a></p>
    <p>This project is developed by <a href="https://jan-bausch.com/">Jan Bausch</a>, originally as part of a University thesis called &#187;<a href="https://raw.githubusercontent.com/Global-Conflicts/thesis/master/Thesis.pdf">Geospatial visualization of Wikipedia news reports about armed conflicts</a>&#171;.</p>
    <p>The source code can be found on <a href="https://github.com/Global-Conflicts/global-conflicts">Github</a>.</p>
  </>
);

export default About;
