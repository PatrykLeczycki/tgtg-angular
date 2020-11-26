interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

export interface LocationInterface {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}
