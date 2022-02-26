import LocationMarker from "./LocationMarker";
import React, { useEffect, useRef } from 'react';

import { addVisibleIncident, removeVisibleIncident } from "../redux/actions";

const useIntersection = (name, element, rootMargin) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                addVisibleIncident(name);
              } else {
                removeVisibleIncident(name);
              }
            }
        );

        if (element && element.current) {
          observer.observe(element.current);
        }

        return () => observer.unobserve(element.current);
    }, []);
};

export default function LocationMarkerWithLink({ name, url }) {

  const ref = useRef();
  useIntersection(name, ref, '0px');

  return <LocationMarker name={name} inline={true}>
    <a ref={ref} href={url} >{name}</a>
  </LocationMarker>
}
