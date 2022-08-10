import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DrawMode } from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { MapboxOptions, Map as Mapbox, LngLatLike } from "mapbox-gl";
import { environment } from "src/environments/environment";
import { center } from '@turf/turf'


export const createMapbox = (elementId: string) => {
    const mapOptions: MapboxOptions = {
        container: elementId,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [6.172652, 45.899977],
        zoom: 12,
        accessToken: environment.mapbox.accessToken
    }

    const map = new Mapbox(mapOptions);
    return map;
}

export const createMapboxDraw = (drawMode: DrawMode) => {
    const mapboxDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            point: true,
            line_string: true,
            polygon: true,
            trash: true
        },
        defaultMode: drawMode
    });
    return mapboxDraw;
}

export const createMapboxGeocoder = () => {
    const geocoder = new MapboxGeocoder({
        accessToken: environment.mapbox.accessToken,
        marker: false,
        // comment below line will enlarge the range of search result
        bbox: [-77.210763, 38.803367, -76.853675, 39.052643],
    });
    return geocoder;
}

export const calculateCenterCoordinates = (feature: GeoJSON.Feature<any>): LngLatLike => {
    const centerFeature = center(feature);
    return centerFeature.geometry.coordinates as LngLatLike;
}