import { useQuery } from "@tanstack/react-query";
import JSON from "./demo.json";
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import { FeatureCollection } from "geojson";
import { useMapPngImage } from "./useMapPngImage";
import { ExpressionSpecification } from "maplibre-gl";

export const ACTIVITIES = [
  "Raid",
  "Abduction/Attempt",
  "Threat",
  "Stakeout",
  "Gathering/Staging",
  "Driving/Observed",
  "Drone",
  "Helicopter",
  "Misc/Unknown",
];

export const LAYER_IDS = [
  "activity-layer-threat",
  "activity-layer-misc",
  "activity-layer-driving-observed",
  "activity-layer-helicopter",
  "activity-layer-stakeout",
  "activity-layer-drone",
  "activity-layer-gathering",
  "activity-layer-raid-unknown",
  "activity-layer-raid-no",
  "activity-layer-raid-yes",
  "activity-layer-abduction-unknown",
  "activity-layer-abduction-no",
  "activity-layer-abduction-yes",
];

export const ActivityLayer = ({
  startDate,
  endDate,
  selectedActivities,
  hoursRange,
  displayType,
}: {
  startDate: string | null;
  endDate: string | null;
  selectedActivities: string[];
  hoursRange: number[];
  displayType: string;
}) => {
  const filters: ExpressionSpecification[] = [];
  if (startDate) {
    filters.push([">=", ["get", "activity_date"], startDate]);
  }
  if (endDate) {
    filters.push(["<=", ["get", "activity_date"], endDate]);
  }

  filters.push([">=", ["get", "hour_of_day"], Math.round(hoursRange[0])]);
  filters.push(["<=", ["get", "hour_of_day"], Math.round(hoursRange[1])]);

  const pointFilters: ExpressionSpecification[] = [
    ...filters,
    [
      "==",
      ["get", "activity_date"],
      displayType === "heatmap" ? "hide" : ["get", "activity_date"],
    ],
  ];

  const data = useQuery({
    queryKey: ["activityData"],
    queryFn: () => {
      return Promise.resolve(JSON);
    },
  });

  useMapPngImage("bullseye", "./icons/bullseye.png", { pixelRatio: 2 });
  useMapPngImage("drone", "./icons/drone.png");
  useMapPngImage("helicopter", "./icons/helicopter.png");
  useMapPngImage("stakeout", "./icons/stakeout.png");
  useMapPngImage("hexagon-red", "./icons/hexagon-red.png");
  useMapPngImage("hexagon-gray", "./icons/hexagon-gray.png");
  useMapPngImage("hexagon-white", "./icons/hexagon-white.png");
  useMapPngImage("triangle-red", "./icons/triangle-red.png");
  useMapPngImage("triangle-gray", "./icons/triangle-gray.png");
  useMapPngImage("triangle-white", "./icons/triangle-white.png");
  if (!data.data) {
    return null;
  }

  return (
    <Source
      id="activity-data"
      type="geojson"
      data={data.data! as FeatureCollection}
    >
      <Layer
        id="activity-heatmap-layer"
        type="heatmap"
        paint={{
          "heatmap-intensity": 0.1,
        }}
        layout={{
          visibility: displayType === "points" ? "none" : "visible",
        }}
        filter={[
          "all",
          // simpligied_actiity is in the selected activities
          [
            "in",
            ["get", "simplified_activity"],
            ["literal", selectedActivities],
          ],
          ...filters,
        ]}
      />

      <Layer
        type="circle"
        id="activity-layer-threat"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Threat"],
          ...pointFilters,
        ]}
        paint={{
          "circle-radius": 5,
          "circle-color": "red",
          "circle-stroke-color": "black",
          "circle-stroke-width": 1,
        }}
        layout={{
          visibility: selectedActivities.includes("Threat")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="circle"
        id="activity-layer-misc"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Misc/Unknown"],
          ...pointFilters,
        ]}
        paint={{
          "circle-radius": 5,
          "circle-color": "gray",
          "circle-stroke-color": "black",
          "circle-stroke-width": 1,
        }}
        layout={{
          visibility: selectedActivities.includes("Misc/Unknown")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="circle"
        id="activity-layer-driving-observed"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Driving/Observed"],
          ...pointFilters,
        ]}
        paint={{
          "circle-radius": 4,
          "circle-color": "black",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
        }}
        layout={{
          visibility: selectedActivities.includes("Driving/Observed")
            ? "visible"
            : "none",
        }}
      />

      <Layer
        type="symbol"
        id="activity-layer-helicopter"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Helicopter"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "helicopter",
          "icon-size": 0.05,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Helicopter")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-stakeout"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Stakeout"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "stakeout",
          "icon-size": 0.26,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Stakeout")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-drone"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Drone"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "drone",
          "icon-size": 0.1,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Drone") ? "visible" : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-gathering"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Gathering/Staging"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "bullseye",
          "icon-size": 0.18,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Gathering/Staging")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-raid-unknown"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Raid"],
          ["==", ["get", "abducted_yn"], "Unknown"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "hexagon-gray",
          "icon-size": 0.18,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Raid") ? "visible" : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-raid-no"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Raid"],
          ["==", ["get", "abducted_yn"], "No"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "hexagon-white",
          "icon-size": 0.18,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Raid") ? "visible" : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-raid-yes"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Raid"],
          ["==", ["get", "abducted_yn"], "Yes"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "hexagon-red",
          "icon-size": 0.18,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Raid") ? "visible" : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-abduction-unknown"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Abduction/Attempt"],
          ["==", ["get", "abducted_yn"], "Unknown"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "triangle-gray",
          "icon-size": 0.16,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Abduction/Attempt")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-abduction-no"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Abduction/Attempt"],
          ["==", ["get", "abducted_yn"], "No"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "triangle-white",
          "icon-size": 0.16,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Abduction/Attempt")
            ? "visible"
            : "none",
        }}
      />
      <Layer
        type="symbol"
        id="activity-layer-abduction-yes"
        filter={[
          "all",
          ["==", ["get", "simplified_activity"], "Abduction/Attempt"],
          ["==", ["get", "abducted_yn"], "Yes"],
          ...pointFilters,
        ]}
        layout={{
          "icon-image": "triangle-red",
          "icon-size": 0.16,
          "icon-allow-overlap": true,
          visibility: selectedActivities.includes("Abduction/Attempt")
            ? "visible"
            : "none",
        }}
      />
    </Source>
  );
};
