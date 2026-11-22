import React from 'react';
import arrivalMap from './ink-arrival.webp';

// The three channels store consecutive thirds of the reveal. Summing them
// gives the edge finer timing than an ordinary 256-level grayscale mask.
const thresholdMatrix = (threshold) => [
  '0 0 0 0 1',
  '0 0 0 0 1',
  '0 0 0 0 1',
  `-48 -48 -48 0 ${threshold}`,
].join(' ');

const hidden = thresholdMatrix(0);
const revealed = thresholdMatrix(145);

export default function InkMask({ svgRef, imageRef, id, duration }) {
  const filterId = id + '-threshold';

  return (
    <svg ref={svgRef} aria-hidden="true" focusable="false" width="0" height="0"
      style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <filter id={filterId} x="0" y="0" width="100%" height="100%"
          colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={hidden}>
            <animate attributeName="values" from={hidden} to={revealed}
              begin="0s" dur={duration + 'ms'} fill="freeze" />
          </feColorMatrix>
        </filter>
        <mask id={id} x="0" y="0" width="1" height="1"
          maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox"
          style={{ maskType: 'alpha' }}>
          <image ref={imageRef} href={arrivalMap} width="1" height="1"
            preserveAspectRatio="none" filter={'url(#' + filterId + ')'} />
        </mask>
      </defs>
    </svg>
  );
}

// The seed lies two thirds of the way along each axis in the recorded map.
// Turn the map on portrait screens so the longer tendrils follow the long edge.
export function alignInkMask(image, button) {
  const { left, top, width, height } = button.getBoundingClientRect();
  const scaleX = ((left + width / 2) / window.innerWidth) * 1.5;
  const scaleY = ((top + height / 2) / window.innerHeight) * 1.5;
  const matrix = window.innerHeight > window.innerWidth
    ? `matrix(0 ${scaleY} ${scaleX} 0 0 0)`
    : `matrix(${scaleX} 0 0 ${scaleY} 0 0)`;

  image.setAttribute('transform', matrix);
}
