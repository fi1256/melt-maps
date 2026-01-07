import { useMap } from "@vis.gl/react-maplibre";
import { useCallback } from "react";
import SnapshotIcon from "./assets/snapshot.jpg";
import html2canvas from "html2canvas";

// Function to capture the WebGL context and convert to an image
function captureMapToImage(gl) {
  // Get the WebGL canvas dimensions
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;

  // Create a temporary framebuffer to read the activity buffer
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  // Create a texture to store the image data
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );

  // Attach the texture to the framebuffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  // Read the pixels from the WebGL context into the texture
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  // Create an image from the pixel data
  const image = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  // Write the pixels to the canvas context
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // Set the image source to the data from the canvas
  image.src = canvas.toDataURL("image/png");

  // Optional: Display the image in the document
  document.body.appendChild(image);

  // Create a download link
  // document.getElementById('downloadButton').addEventListener('click', function () {
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "map_snapshot.png";
  a.click();
  // });
}

export const SnapshotButton = () => {
  const map = useMap();

  const takeSnapshot = useCallback(() => {
    if (!map.activity) return;

    map.activity.preserveDrawingBuffer = true;
    map.activity.triggerRepaint();

    const dataUrl = map.activity.getCanvas().toDataURL("image/png");

    // If the image string is valid, create a download link
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "map_snapshot.png";
    a.click();
  }, [map.activity]);

  const handleScreenshot = () => {
    if (map.activity) {
      const html = map.activity.getContainer();

      if (html) {
        map.activity.once("render", async () => {
          html2canvas(html, { useCORS: true }).then((canvas) => {
            canvas.toBlob((blob) => {
              if (blob) {
                // saveAs(blob, `gsmIdleLockData_MCI_${inspectionId}.png`);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "map_snapshot.png";
                a.click();
                URL.revokeObjectURL(url);
              }
            });
          });
        });
        // map.activity.panTo([lastLng, lastLat])
        map.activity.triggerRepaint();
      }
    }
  };

  return (
    <button
      id="snapshotButton"
      onClick={() => handleScreenshot()}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 0,
      }}
    >
      <img src={SnapshotIcon} alt="Take snapshot" width={44} />
    </button>
  );
};
