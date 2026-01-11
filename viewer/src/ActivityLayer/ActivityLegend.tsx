import "./ActivityLegend.css";

function svgToDataUrl(svg) {
  return "data:image/svg+xml;base64," + btoa(svg);
}

// define an svg of a red circle with black outline
const redCircleSvg = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="6" r="4" fill="red" stroke="black" stroke-width="1"/>
</svg>`;

// define an svg with a black circle with white outline
const blackCircleSvg = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="6" r="4" fill="black" />
</svg>`;

// define a grey circle svg
const grayCircleSvg = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="6" r="4" fill="gray" stroke="black" stroke-width="1" />
</svg>`;

export const ACTIVITY_ITEMS = [
  {
    simplified: "Raid",
    label: "Raid (someone taken)",
    icon: "icons/hexagon-red.png",
  },
  {
    simplified: "Raid",
    label: "Raid (no one confirmed taken)",
    icon: "icons/hexagon-white.png",
  },
  {
    simplified: "Raid",
    label: "Raid (unknown result)",
    icon: "icons/hexagon-gray.png",
  },
  {
    simplified: "Abduction/Attempt",
    label: "Abduction/Attempt (someone taken)",
    icon: "icons/triangle-red.png",
  },
  {
    simplified: "Abduction/Attempt",
    label: "Abduction/Attempt (no one confirmed taken)",
    icon: "icons/triangle-white.png",
  },
  {
    simplified: "Abduction/Attempt",
    label: "Abduction/Attempt (unknown result)",
    icon: "icons/triangle-gray.png",
  },
  { simplified: "Threat", label: "Threat", icon: svgToDataUrl(redCircleSvg) },
  { simplified: "Stakeout", label: "Stakeout", icon: "icons/stakeout.png" },
  {
    simplified: "Gathering/Staging",
    label: "Gathering / Staging",
    icon: "icons/bullseye.png",
  },
  {
    simplified: "Driving",
    label: "Driving",
    icon: svgToDataUrl(blackCircleSvg),
  },
  { simplified: "Drone", label: "Drone", icon: "icons/drone.png" },
  {
    simplified: "Helicopter",
    label: "Helicopter",
    icon: "icons/helicopter.png",
  },
  {
    simplified: "Observed",
    label: "Observed",
    icon: svgToDataUrl(grayCircleSvg),
  },
  {
    simplified: "Threat to Observers",
    label: "Threat to Observers",
    icon: "icons/danger.png",
  },
];

export const ActivityLegend = ({
  selectedActivities,
}: {
  selectedActivities: string[];
}) => {
  return (
    <div>
      <div style={{ fontWeight: "bold", marginBottom: 5 }}>Activity Legend</div>

      {[...ACTIVITY_ITEMS]
        .filter((activity) => selectedActivities.includes(activity.simplified))
        .map((activity) => (
          <div key={activity.label} className="legend-item">
            {activity.icon && (
              <img
                src={activity.icon}
                alt={activity.label}
                className="legend-image"
              />
            )}
            <span>{activity.label}</span>
          </div>
        ))}
    </div>
  );
};
