import ArcgisMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const map = new ArcgisMap({
	basemap: "osm",
});

const view = new MapView({
	map,
	container: undefined,
	zoom: 10,
	center: [45.2, 40.42],
	constraints: {
		minScale: 3000000,
		geometry: {
			type: "extent",
			xmin: 43.3,
			ymin: 38.8,
			xmax: 46.7,
			ymax: 41.5,
		},
	},
});

export const pointsLayer = new FeatureLayer({
	title: "points",
});

export function mountView(el: HTMLDivElement) {
	view.container = el
}
