import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import {
  AnnotationListComponent,
  SearchMapComponent,
  MapComponent,
  DrawModeToggleComponent,
  InfoPanelComponent
} from './components';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar'
import { mapFeatureKey, mapReducer } from './store/reducers/map.reducer';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AnnotationListComponent,
    InfoPanelComponent,
    DrawModeToggleComponent,
    SearchMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    StoreModule.forRoot({
      [mapFeatureKey]: mapReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
