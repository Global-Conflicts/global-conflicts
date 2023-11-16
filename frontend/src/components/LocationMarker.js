import React from 'react';

function randomNumberFromString(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function numberToColor(number) {
  return `hsl(${number % 360}, 70%, 50%)`;
}


export default function LocationMarker({ name, children, inline, onClick }) {
  const randomNumber = randomNumberFromString(name);
  const color = numberToColor(randomNumber);
  const letter = name[0];
  const id = `${letter}${randomNumber}${inline ? '-inline': ''}`
  return <span className="location-marker">
    <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <defs>
        <mask id={id}>
          <path d="m-1-1h12v16h-12z" fill="white"/>
          <text className="location-marker__text" x="5" y="8">{letter}</text>
        </mask>
      </defs>
      <path d="m0 5a5 5 0 1 1 10 0c0 3.025-3.28 6.713-5 9-1.72-2.287-5-5.975-5-9z" fill={color} mask={`url(#${id})`}/>
    </svg>
    {children}
  </span>
}

