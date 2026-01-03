import { Layer, Source } from "@vis.gl/react-maplibre";
import { useMapPngImage } from "../ActivityLayer/useMapPngImage";

export const LAYER_IDS = ["lpr-arrows", "mn_dps_bca_lpr", "lpr-circles"];

export const LprLayer = ({
  showLpr,
  showDpsLpr,
}: {
  showLpr: boolean;
  showDpsLpr: boolean;
}) => {
  useMapPngImage("arrow", "./icons/arrow.png");

  return (
    <>
      <Source
        id="lpr"
        type="vector"
        tiles={["https://<tile-server>/lpr_us-v4/{z}/{x}/{y}.pbf"]}
        minzoom={7}
        maxzoom={12}
      >
        <Layer
          type="symbol"
          id="lpr-arrows"
          source-layer="data" // must match tile
          minzoom={12}
          layout={{
            visibility: showLpr ? "visible" : "none",
            "icon-image": "arrow",
            "icon-size": 1,
            // 🔑 rotate arrow using the feature property
            "icon-rotate": [
              "to-number",
              [
                "slice",
                ["get", "direction"],
                0,
                [
                  "case",
                  [">=", ["index-of", ";", ["get", "direction"]], 0],
                  ["index-of", ";", ["get", "direction"]],
                  ["length", ["get", "direction"]],
                ],
              ],
            ],

            // important for map-relative rotation
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          }}
        />

        <Layer
          id="lpr-circles"
          type="circle"
          source-layer="data" // MUST be correct
          layout={{ visibility: showLpr ? "visible" : "none" }}
          paint={{
            "circle-color": "#ff0000",
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.5,
              12,
              1,
            ],
            // set circle size to increase with zoom level
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              12,
              3.5,
            ],
          }}
        />
      </Source>

      <Source
        id="mn_dps_bca_lpr"
        type="vector"
        tiles={["https://<tile-server>/mn_dps_bca_lpr/{z}/{x}/{y}.pbf"]}
        minzoom={7}
        maxzoom={12}
      >
        <Layer
          id="mn_dps_bca_lpr"
          type="circle"
          source-layer="data" // MUST be correct
          layout={{ visibility: showDpsLpr ? "visible" : "none" }}
          paint={{
            "circle-color": "#0000ff",
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              12,
              3,
            ],
            // set circle size to increase with zoom level
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              12,
              3.5,
            ],
          }}
        />
      </Source>
    </>
  );
};
