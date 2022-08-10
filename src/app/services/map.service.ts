import { Injectable } from '@angular/core';
import MapboxDraw, { DrawCreateEvent, DrawDeleteEvent } from '@mapbox/mapbox-gl-draw';
import { DrawMode } from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Store, select } from '@ngrx/store';
import  { LngLatLike, Map, Point } from 'mapbox-gl';
import { first, map, Observable, ReplaySubject } from 'rxjs';
import { addAnnotation, removeAnnotation, setDrawMode } from '../store/actions/map.actions';
import { AppState } from '../store/reducers';
import { Annotation, mapFeatureKey } from '../store/reducers/map.reducer';
import { ActionsSubject } from '@ngrx/store';
import { ofType } from "@ngrx/effects";
import { calculateCenterCoordinates, createMapbox, createMapboxDraw, createMapboxGeocoder } from './map.service.helpers';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: Map | undefined;
  private geocoderSearch: MapboxGeocoder | undefined;
  private mapboxDraw: MapboxDraw | undefined;
  private drawMode$: Observable<DrawMode>;
  private initialDrawMode: DrawMode | undefined;
  private annotations$: Observable<Annotation[]>;

  // using replay subject because 1. we don't have a seed value 
  // 2. we may need to replay the last value if the subscription is initialized later 
  private mapReplaySubject = new ReplaySubject<Map>();

  constructor(private store: Store<AppState>, private actionsSubj: ActionsSubject) {
    //assign store drawMode observable
    this.drawMode$ = this.store.pipe(select(mapFeatureKey), map((state) => (state.drawMode)));
    this.subscribeToStoreDrawMode();
    
     //assign store annotations observable
    this.annotations$ = this.store.pipe(select(mapFeatureKey), map((state) => (state.annotations)));
    this.subscribeToStoreAnnotations();
  }

  buildMap(elementId: string) {
    this.map = createMapbox(elementId);
    // mapReplaySubject.next() will only be called once when map is initialized 
    this.mapReplaySubject.next(this.map);

    this.mapboxDraw = createMapboxDraw(this.initialDrawMode!);
    this.map.addControl(this.mapboxDraw);

    this.setupMapEvents();
  }
  
  buildGeocoderSearch(container: HTMLElement) {
    this.geocoderSearch = createMapboxGeocoder();
    this.mapReplaySubject.subscribe((value) => {
      if (value && this.geocoderSearch) {
        container.appendChild(this.geocoderSearch.onAdd(value));
      }
    })
  }

  setupMapEvents() {
    if (!this.map) throw Error('map not initialized')

    this.map.on('draw.create', (event: DrawCreateEvent) => {
      const { features: [feature] } = event;
      const centerCoordinates = calculateCenterCoordinates(feature);
      const annotation = { feature, centerCoordinates };
      this.store.dispatch(addAnnotation({ annotation }))
    });

    this.map.on('draw.modechange', (value) => {
      const { mode } = value;
      this.store.dispatch(setDrawMode({ mode }))
    });
    this.map.on('draw.delete', (event: DrawDeleteEvent) => {
      const { features: [feature] } = event;
      this.store.dispatch(removeAnnotation({ annotationId: feature.id }))
    });
  }

  setCenter(center: LngLatLike) {
    this.map?.flyTo({
      duration: 1000,
      essential: true,
      center
    });
  }

  tearDownMap() {
    //TODO implement
  }

  private subscribeToStoreDrawMode() {
    // assign initialDrawMode from the default value in the store
    // using first() because we should always have a default initial store value 
    this.drawMode$.pipe(first()).subscribe((value) => this.initialDrawMode = value);
    this.drawMode$.subscribe((value) => this.changeMapboxDrawMode(value))
  }

  private subscribeToStoreAnnotations() {
    this.actionsSubj.pipe(
      ofType(removeAnnotation)
    ).subscribe(data => this.mapboxDraw?.delete(data.annotationId as string));
  }

  private changeMapboxDrawMode(value: DrawMode) {
    // avoid infinite event loop if draw mode is already set
    if (this.mapboxDraw?.getMode() === value) return;

    if (value === 'direct_select' || value === 'simple_select') return;

    // these next two if statements are necessary because of bad TS overload types
    // ts-ignore is probably a better idea in this case
    if (value === 'draw_line_string') this.mapboxDraw?.changeMode(value);
    if (value === 'draw_point' || value === 'draw_polygon') this.mapboxDraw?.changeMode(value);
  }
}
