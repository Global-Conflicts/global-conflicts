import LocationMarker from "./LocationMarker";
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { addVisibleIncident, removeVisibleIncident } from "../redux/actions";

export default function LocationMarkerWithLink({ name, url }) {

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        addVisibleIncident(name);
      } else {
        removeVisibleIncident(name);
      }
    },
  });

  return <LocationMarker name={name} inline={true} onClick={window.alert}>
    <a ref={ref} href={url} >{name}</a>
  </LocationMarker>
}
