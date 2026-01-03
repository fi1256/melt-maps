import fs from "fs";
import codec from "@googlemaps/polyline-codec";

const DEMO_DATA_STR = fs.readFileSync("./demo.json", "utf-8");
const DEMO_DATA = JSON.parse(DEMO_DATA_STR);

const WHIPPLE = { lat: 44.8942296, lng: -93.194857 };

const ROUTES_API_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

const headers = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
  "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline",
};

const morningDeparture = new Date("2026-01-05T14:00:00Z");

const getBody = ({ longitude, latitude }) => ({
  origin: {
    location: {
      latLng: {
        latitude: WHIPPLE.lat,
        longitude: WHIPPLE.lng,
      },
    },
  },
  destination: {
    location: {
      latLng: {
        latitude,
        longitude,
      },
    },
  },
  travelMode: "DRIVE",
  polylineQuality: "OVERVIEW",
  routingPreference: "TRAFFIC_AWARE",
  departureTime: morningDeparture.toISOString(),
});

const getLocationRoute = (record) => {
  const loc = {
    latitude: record.geometry.coordinates[1],
    longitude: record.geometry.coordinates[0],
  };

  const body = getBody(loc);

  return fetch(ROUTES_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .catch((error) => {
      console.error("Error fetching route:", error);
    })
    .then((response) => {
      return response.json().then((data) => {
        if (!response.ok) {
          console.log(JSON.stringify(data, null, 2));
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const topRoute = data.routes[0];

        const decodedPath = codec.decode(topRoute.polyline.encodedPolyline, 5);

        return decodedPath.map((point) => [point[1], point[0]]);
      });
    });
};

const features = [];

for (let i = 0, l = DEMO_DATA.features.length; i < 1; i++) {
  const record = DEMO_DATA.features[i];

  const feature = await getLocationRoute(record).then((coordinates) => {
    const feature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
      properties: {
        map_activity: record.properties.map_activity,
        hour_of_day: record.properties.hour_of_day,
        activity_date: record.properties.activity_date,
      },
    };

    return feature;
  });

  await new Promise((resolve) => setTimeout(resolve, 250)); // rate limit

  features.push(feature);
}

fs.writeFileSync(
  "./whipple-routes.geojson",
  JSON.stringify(
    {
      type: "FeatureCollection",
      metadata: {
        generated: new Date().toISOString(),
        title: "Whipple Routes",
        description: "Routes from Whipple to various locations",
        source: "Google Maps Routes API",
      },
      features: features,
    },
    null,
    2
  )
);
