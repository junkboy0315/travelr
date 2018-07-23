import { LatLng } from '../config/types';

class MapsPickPosition {
  callback: (position: LatLng) => any; // called when the pin position is changed

  defaultPosition: LatLng;

  handleMapClick: any;

  handleMarkerDragend: any;

  map: google.maps.Map; // reference to map instance

  marker: google.maps.Marker; // reference marker instances

  constructor(
    mapRef: HTMLElement,
    callback: (position: LatLng) => any,
    options?: {
      defaultPosition?: LatLng;
    },
  ) {
    this.callback = callback;

    const defaultPosition = options && options.defaultPosition;

    this.defaultPosition = {
      lat: (defaultPosition && defaultPosition.lat) || 35.681235,
      lng: (defaultPosition && defaultPosition.lng) || 139.763995,
    };
    // initial feedback
    callback(this.defaultPosition);

    const mapInitializer = this.mapInitializerGenerator(mapRef);

    // if API is not ready yet, pend tasks and exit constructor
    if (typeof google !== 'object') {
      // @ts-ignore
      window.mapInitializer = mapInitializer;
      return;
    }

    // instantiate the map if API is ready.
    mapInitializer();
  }

  mapInitializerGenerator = (mapRef: HTMLElement) => () => {
    const { lat, lng } = this.defaultPosition;
    const latLng = new google.maps.LatLng(lat, lng);

    // create map
    this.map = new google.maps.Map(mapRef, {
      center: latLng,
      zoom: 5,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: true,
    });

    // create marker
    this.marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      draggable: true,
    });

    // on drag
    this.handleMarkerDragend = e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.map.panTo(position);
      this.callback(position);
    };
    this.marker.addListener('dragend', this.handleMarkerDragend);

    // on click
    this.handleMapClick = e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.marker.setPosition(position);
      this.map.panTo(position);
      this.callback(position);
    };
    this.map.addListener('click', this.handleMapClick);
  };

  setPosition = (position: LatLng) => {
    this.marker.setPosition(position);
    this.map.panTo(position);
    this.map.setZoom(15);
  };
}

export default MapsPickPosition;
