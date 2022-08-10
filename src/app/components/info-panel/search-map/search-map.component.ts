import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'my-app-search-map',
  templateUrl: './search-map.component.html',
})
export class SearchMapComponent implements AfterViewInit {

  @ViewChild('geocoderSearchContainer') geocoderSearchContainer!: ElementRef; 

  constructor( private mapService: MapService) { }

  ngAfterViewInit(): void {
    this.mapService.buildGeocoderSearch(this.geocoderSearchContainer.nativeElement);
  }

}
