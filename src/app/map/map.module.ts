import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import {MapComponent} from './map.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [MapComponent],
  exports: [
    MapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule
  ], providers: [
    GoogleMapsAPIWrapper
  ]
})
export class MapModule { }
