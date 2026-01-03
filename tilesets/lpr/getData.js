import { tileToBBOX } from "@mapbox/tilebelt";
import fs from "fs";

const MAX_ATTEMPTS = 10;
const WAIT_BETWEEN_ATTEMPTS_MS = 10_000;

const US_TILES = [
  { z: 3, x: 1, y: 2 },
  { z: 3, x: 2, y: 2 },
  { z: 3, x: 3, y: 2 },

  { z: 3, x: 1, y: 3 },
  { z: 3, x: 2, y: 3 },
  { z: 3, x: 3, y: 3 },

  { z: 3, x: 1, y: 4 },
  { z: 3, x: 2, y: 4 },
  { z: 3, x: 3, y: 4 },
];

/**
 * Convert OSM Overpass response → GeoJSON FeatureCollection
 */
function overpassToGeoJSON(elements) {
  return {
    type: "FeatureCollection",
    features: elements
      .filter((el) => el.type === "node" && el.lat && el.lon)
      .map((el) => ({
        type: "Feature",
        id: el.id,
        properties: el.tags || {},
        geometry: {
          type: "Point",
          coordinates: [el.lon, el.lat],
        },
      })),
  };
}

const getTileFeatures = async (zNum, xNum, yNum) => {
  // ---- Tile bbox (lon/lat) ----
  const bbox = tileToBBOX([xNum, yNum, zNum]);
  // Overpass bbox: south,west,north,east
  const overpassBBox = `${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]}`;

  // ---- Overpass query ----
  const query = `
      [out:json][timeout:25];
      (
        node["surveillance"="ALPR"](${overpassBBox});
        node["surveillance:type"="ALPR"](${overpassBBox});
        node["camera:type"="ALPR"](${overpassBBox});
      );
      out body;
    `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  const body = await response.text();

  try {
    const json = JSON.parse(body);
    const geojson = overpassToGeoJSON(json.elements);

    return geojson;
  } catch (e) {
    console.error("Failed to parse Overpass response:", body);
    throw e;
  }
};

const allFeatures = [];

for (const tile of US_TILES) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const resp = await getTileFeatures(tile.z, tile.x, tile.y);

      console.log(
        `Tile z:${tile.z} x:${tile.x} y:${tile.y} => `,
        resp.features.length
      );

      allFeatures.push(...(resp.features || []));

      break; // exit the retry loop on success
    } catch (error) {
      console.error(
        `Error fetching tile z:${tile.z} x:${tile.x} y:${tile.y} (attempt ${attempt}):`
      );

      if (attempt === MAX_ATTEMPTS) {
        console.error("Max attempts reached.");

        process.exit(1);
      } else {
        console.log("Retrying...");
        await new Promise((resolve) =>
          setTimeout(resolve, WAIT_BETWEEN_ATTEMPTS_MS)
        ); // wait 5 seconds before retrying

        continue;
      }
    }
  }

  // Be kind to Overpass API
  await new Promise((resolve) => setTimeout(resolve, WAIT_BETWEEN_ATTEMPTS_MS));
}

fs.writeFileSync(
  "lpr_us_features.geojson",
  JSON.stringify(
    {
      type: "FeatureCollection",
      features: allFeatures,
      metadata: {
        source: "OpenStreetMap Overpass API",
        created_at: new Date().toISOString(),
        source_url: "https://overpass-api.de/",
      },
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Total features collected: ${allFeatures.length}`);
