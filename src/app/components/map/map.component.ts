import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MapService } from '../../services/map.service';


@Component({
  selector: 'my-app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  elementId = 'myMap';

  constructor(private mapService: MapService) { }
  ngAfterViewInit() {
    this.mapService.buildMap(this.elementId);
  }

  ngOnDestroy() {
    this.mapService.tearDownMap();
  }
}
