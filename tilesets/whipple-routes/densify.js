import fs from "fs";
import * as turf from "@turf/turf";

const ROUTES = fs.readFileSync("./whipple-routes.geojson", "utf-8");
const ROUTES_GEOJSON = JSON.parse(ROUTES);

// densify each route to ensure better line rendering
const densifyRoute = (route, segmentLengthMiles = 0.01) => {
  const line = turf.lineString(route.geometry.coordinates);
  const dense = turf.lineChunk(line, segmentLengthMiles, { units: "miles" });

  // extract coordinates from the chunks
  const denseCoordinates = [];
  dense.features.forEach((chunk) => {
    denseCoordinates.push(...chunk.geometry.coordinates);
  });

  console.log(
    `Original points: ${route.geometry.coordinates.length}, Densified points: ${denseCoordinates.length}`
  );

  return {
    ...route,
    geometry: {
      ...route.geometry,
      coordinates: denseCoordinates,
    },
  };
};

fs.writeFileSync(
  "./whipple-routes-densified.geojson",
  JSON.stringify({
    type: "FeatureCollection",
    features: ROUTES_GEOJSON.features.map((route) => densifyRoute(route)),
  })
);
