import {  Component, ElementRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { Annotation, mapFeatureKey } from 'src/app/store/reducers/map.reducer';
import { removeAnnotation } from 'src/app/store/actions/map.actions';
import { MapService } from '../../../services/map.service';
import { LngLatLike } from 'mapbox-gl';

@Component({
  selector: 'my-app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.scss']
})
export class AnnotationListComponent {
  annotations$: Observable<Annotation[]>;
  @ViewChild('list', { read: ElementRef })  list!: ElementRef<HTMLDivElement>;

  constructor(private store: Store<AppState>, private mapService: MapService) {
    this.annotations$ = this.store.pipe(select(mapFeatureKey), map((state) => (state.annotations)));
  }

  deleteItem(id: string | number | undefined){
    this.store.dispatch(removeAnnotation({ annotationId: id }))
  }

  centerMap(center: LngLatLike){
    this.mapService.setCenter(center)
  }
}


