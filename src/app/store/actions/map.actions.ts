import { DrawMode } from "@mapbox/mapbox-gl-draw";
import { createAction, props } from "@ngrx/store";
import { Feature } from "geojson"
import { Annotation } from "../reducers/map.reducer";

export const setDrawMode = createAction('[Map] Set Draw Mode', props<{mode: DrawMode}>());
export const addAnnotation = createAction('[Map] Add Annotation', props<{annotation: Annotation}>());
export const removeAnnotation = createAction('[Map] Remove Annotation', props<{annotationId: string | number | undefined}>());
