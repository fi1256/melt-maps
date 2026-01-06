import { useQuery } from "@tanstack/react-query";

export const useActivityData = () =>
  useQuery({
    queryKey: ["activity-data"],
    queryFn: async () => {
      const response = await fetch(
        "https://activity.fi1256.workers.dev/table/All%20Data"
      );

      const records = await response.json();

      return {
        type: "FeatureCollection",
        features: records.map((record: any) => ({
          type: "Feature",
          properties: {
            ...record.fields,
          },
          geometry: {
            type: "Point",
            coordinates: [record.fields.long, record.fields.lat],
          },
        })),
      };
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
