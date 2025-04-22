import ArcgisMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

// export const graphicsLayer = new GraphicsLayer({
// 	title: "points",
// 	visible: false,
// });

export function createBlankGraphicsLayer() {
	// map.layers.filter((layer) => layer)
	map.layers = [];
	const graphicsLayer = new GraphicsLayer({
		title: "points",
		visible: false,
	});
	map.layers.add(graphicsLayer);

	return graphicsLayer;
}

const map = new ArcgisMap({
	basemap: "osm",
	// layers: [graphicsLayer],
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

export function mountView(el: HTMLDivElement) {
	view.container = el;
}
