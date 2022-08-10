import {  Component } from '@angular/core';
import { DrawMode } from '@mapbox/mapbox-gl-draw';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { setDrawMode } from 'src/app/store/actions/map.actions';
import { AppState } from 'src/app/store/reducers';
import { mapFeatureKey, State as MapState } from '../../../store/reducers/map.reducer'

@Component({
  selector: 'my-app-draw-mode-toggle',
  templateUrl: './draw-mode-toggle.component.html',
})


export class DrawModeToggleComponent{
  drawMode$: Observable<DrawMode>;

  constructor(private store: Store<AppState>) {
    this.drawMode$ = this.store.pipe(select(mapFeatureKey), map((state) => (state.drawMode)));
    this.drawMode$.subscribe((value)=> console.log('change toggle button state', value))
  }

  onChange(value: DrawMode): void {
    this.store.dispatch(setDrawMode({ mode: value }))
  }
}
