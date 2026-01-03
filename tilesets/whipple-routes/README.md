1. getRoutes.js
2. densify.js
3. tippecanoe

#### getRoutes.js

Google API key required with the routes API enabled.

```
GOOGLE_MAPS_API_KEY=<your key> node ./getRoutes.js
```

#### densify.js

Fill in lots of points between route points to make heatmap continuous-ish

```
node ./densify.js
```

#### tippecanoe

Make sure tippecanoe does not remove the densified points that make the heatmap continuous.

```
tippecanoe whipple-routes-densified.geojson -l data --no-line-simplification -o whipple-routes-densified.pmtiles
```
