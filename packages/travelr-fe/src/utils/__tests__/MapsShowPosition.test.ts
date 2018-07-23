import MapsShowPosition from '../MapsShowPosition';
import { deleteGoogleMapsApiMock, setGoogleMapsApiMock } from '../testHelper';

const DUMMY_POSITION = { lng: 135.0, lat: 35.0 };

describe('MapsShowPosition', () => {
  let mapRef;

  beforeEach(() => {
    jest.clearAllMocks();

    document.body.innerHTML =
      '<div>' +
      '  <script />' +
      '  <span id="username" />' +
      '  <button id="button" />' +
      '  <div id="maps" />' +
      '</div>';

    mapRef = document.getElementById('maps');
  });

  afterEach(() => {
    deleteGoogleMapsApiMock();
  });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    // eslint-disable-next-line
    const mapsShowPosition = new MapsShowPosition(mapRef, DUMMY_POSITION);

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('marker is created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    // eslint-disable-next-line
    const mapsShowPosition = new MapsShowPosition(mapRef, DUMMY_POSITION);

    // markers created immediately each time
    expect(google.maps.Marker).toHaveBeenCalledTimes(1);
  });

  test('marker creation is queued until the API an map instance is ready', () => {
    const mapsShowPosition = new MapsShowPosition(mapRef, DUMMY_POSITION);

    expect(google).toBe(undefined);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsShowPosition.mapInitializerGenerator(mapRef, DUMMY_POSITION)();

    // map should be created
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // marker should be created for the lastly queued posts
    expect(google.maps.Marker).toHaveBeenCalledTimes(1);
  });
});
