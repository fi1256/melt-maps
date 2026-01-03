export function svgToDataUrl(svg: string) {
  return "data:image/svg+xml;base64," + btoa(svg);
}
export function hexagonSVG(fill: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<polygon points="50,3 93,25 93,75 50,97 7,75 7,25" fill="${fill}" stroke="black" stroke-width="6"/>` +
    `</svg>`;
  return svgToDataUrl(svg);
}
export function bullseyeSVG() {
  const svg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Outermost, thickest ring -->
      <circle cx="100" cy="100" r="90" fill="none" stroke="black" stroke-width="10"/>

      <!-- Middle ring -->
      <circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="3"/>

      <!-- Innermost, thinnest ring -->
      <circle cx="100" cy="100" r="30" fill="none" stroke="black" stroke-width="3"/>
    </svg>`;
  return svgToDataUrl(svg);
}
export function stakeoutSVG() {
  const svg = `<svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Watch Straps -->
      <path d="M16 3H8V7H16V3Z" fill="black"/>
      <path d="M16 17H8V21H16V17Z" fill="black"/>

      <!-- Watch Face -->
      <circle cx="12" cy="12" r="6" stroke="black" stroke-width="2"/>

      <!-- Watch Hands -->
      <path d="M12 9V12H15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  return svgToDataUrl(svg);
}
export function droneSVG() {
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <!-- Center point is (100, 100) -->

      <!-- Thick black ring (annulus) -->
      <!-- Outer circle radius 40, inner circle radius 25 -->
      <circle cx="100" cy="100" r="25" fill="black"/>
      <circle cx="100" cy="100" r="15" fill="white"/>

      <!-- Three equally spaced ovals (fan blades) -->
      <!-- Each blade is rotated by 120 degrees relative to the center -->

      <!-- Blade 1 (top/vertical, rotated 0 deg) -->
      <!-- Placed to touch the outer edge of the ring -->
      <g transform="translate(100, 100) rotate(0)">
        <ellipse cx="0" cy="-70" rx="12" ry="45" fill="black"/>
      </g>

      <!-- Blade 2 (rotated 120 deg) -->
      <g transform="translate(100, 100) rotate(120)">
        <ellipse cx="0" cy="-70" rx="12" ry="45" fill="black"/>
      </g>

      <!-- Blade 3 (rotated 240 deg) -->
      <g transform="translate(100, 100) rotate(240)">
        <ellipse cx="0" cy="-70" rx="12" ry="45" fill="black"/>
      </g>
    </svg>`;
  return svgToDataUrl(svg);
}
export function helicopterSVG() {
  // Use a simplified path and ensure all necessary XML attributes are present
  const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 286.813">
        <path d="M287.12 12.626h193.281a6.847 6.847 0 110 13.694H287.242v11.337h21.872a6.98 6.98 0 014.941 2.051 6.984 6.984 0 012.051 4.94v7.15c2.782.178 5.555.396 8.315.667 55.399 5.449 105.954 30.012 140.257 84.2 5.134 8.114 12.659 30.595 16.421 51.281 2.909 16.003 3.578 31.32-.698 39.208l-.008.016c-2.495 4.619-6.418 8.161-11.734 10.539-4.827 2.161-10.82 3.317-17.946 3.395h-.04v.019H425.39l11.846 29.106c12.503.476 23.835.188 33.726-2.117 10.346-2.411 19.261-7.146 26.547-15.822a8.202 8.202 0 0112.58 10.526c-9.85 11.731-21.721 18.088-35.405 21.278-12.733 2.969-26.862 3.084-42.368 2.319l-236.909.004v-.018c-12.695.544-22.933-.918-32.644-4.667-9.66-3.729-18.44-9.589-28.367-17.889a8.202 8.202 0 0110.527-12.58c8.622 7.209 16.021 12.211 23.746 15.193 6.232 2.407 12.925 3.587 20.959 3.664l12.186-33.771c.255-.714.6-1.368 1.016-1.959l-85.845-84.957H51.448l-18.475 56.598a3.585 3.585 0 01-3.471 2.696H3.572a5.369 5.369 0 01-.573-.057 3.572 3.572 0 01-2.952-4.099l10.463-64.339a30.051 30.051 0 01-7.014-19.329 30.061 30.061 0 016.662-18.908L.047 39.82a3.572 3.572 0 013.525-4.145l25.93-.011a3.585 3.585 0 013.471 2.696L52.11 96.987a30.63 30.63 0 012.917 2.563l.033.033c.377.378.744.767 1.102 1.165h61.652c33.923-17.727 72.362-32.656 111.574-41.336a3.628 3.628 0 01-.013-.297V44.648c0-1.773.68-3.406 1.792-4.648l.261-.291a6.973 6.973 0 014.94-2.052h21.871V26.32H65.082a6.848 6.848 0 010-13.694h193.279a14.499 14.499 0 014.135-8.369A14.469 14.469 0 01272.741 0c3.991 0 7.618 1.632 10.244 4.257a14.49 14.49 0 014.135 8.369zm120.581 228.497H217.445a8.18 8.18 0 01-.227.746l-10.145 28.115h212.344l-11.483-28.213a8.222 8.222 0 01-.233-.648zM33.693 101.748c10.579 0 19.155 8.576 19.155 19.154 0 10.58-8.576 19.155-19.155 19.155-10.578 0-19.153-8.575-19.153-19.155 0-10.578 8.575-19.154 19.153-19.154zm291.391-36.167c66.086 8.663 117.425 40.241 142.14 103.47h-142.14V65.581z"/>
        </svg>`.trim();
  return svgString;
  // Convert to Base64 to ensure compatibility with ArcGIS PictureMarkerSymbol
  const base64 = btoa(svgString);
  return `data:image/svg+xml;base64,${base64}`;
}
