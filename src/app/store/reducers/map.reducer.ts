import {
  createReducer,
  on
} from '@ngrx/store';
import { setDrawMode, addAnnotation, removeAnnotation } from '../actions/map.actions';
import { Feature } from 'geojson';
import { DrawMode } from '@mapbox/mapbox-gl-draw';
import { LngLatLike } from 'mapbox-gl';

export const mapFeatureKey = 'map';

export interface Annotation {
  feature: Feature,
  centerCoordinates: LngLatLike
}

export interface State {
  drawMode: DrawMode;
  annotations: Annotation[];
}

export const initialState: State = {
  drawMode: 'draw_point',
  annotations: [],
};

export const mapReducer = createReducer(
  initialState,
  on(setDrawMode, (state, { mode }) => ({ ...state, drawMode: mode })),
  on(addAnnotation, (state, { annotation }) => ({ ...state, annotations: [...state.annotations, annotation] })),
  on(removeAnnotation, (state, { annotationId }) => {
    const annotations = state.annotations.filter((value) => value.feature.id !== annotationId);
    return { ...state, annotations }
  })
);
