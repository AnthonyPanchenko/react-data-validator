import './render-checker.scss';

import { useRef } from 'react';

function generateRandomRgba() {
  const o = Math.round;
  const r = Math.random;
  const s = 255;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.5 + ')';
}

export default function RenderChecker(props: {
  children: React.ReactNode | React.ReactNode[] | null | undefined;
  label?: string;
  className?: string;
}) {
  const renderCounter = useRef(0);

  if (props.label) {
    renderCounter.current += 1;
    console.log('>>> ', props.label, '>>> ', renderCounter.current);
  }

  const style = { '--bg-color': generateRandomRgba() } as React.CSSProperties;

  return (
    <fieldset className={`render-checker ${props.className || ''}`} style={style}>
      {!!props.label && <legend>{props.label}</legend>}
      {props.children}
    </fieldset>
  );
}
