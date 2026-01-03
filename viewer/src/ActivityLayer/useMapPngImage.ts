import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

type Options = {
  pixelRatio?: number;
  sdf?: boolean;
};

export function useMapPngImage(
  name: string,
  pngUrl: string,
  options: Options = {}
) {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map || !name || !pngUrl) return;

    let cancelled = false;

    const addImage = async () => {
      if (map.hasImage(name)) return;

      try {
        const { data, width, height } = await map.loadImage(pngUrl);

        if (map.hasImage(name)) return;

        map.addImage(name, data, options);
      } catch (err) {
        console.error(`Failed to load image "${name}"`, err);
      }
    };

    addImage();

    const onStyleData = () => {
      if (!map.hasImage(name)) addImage();
    };

    map.on("styledata", onStyleData);

    return () => {
      cancelled = true;
      map.off("styledata", onStyleData);

      if (map.hasImage(name)) {
        try {
          map.removeImage(name);
        } catch {}
      }
    };
  }, [map, name, pngUrl]);
}
