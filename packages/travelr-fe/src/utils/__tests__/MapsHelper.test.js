import MapsHelper from '../MapsHelper';
import loadJS from '../loadJS';

jest.mock('../loadJS');

const DUMMY_POSTS = ['post1', 'post2', 'post3'];
const DUMMY_POSTS_ADDED_LAST = [
  'post4',
  'post5',
  'post6',
  'post7',
  'post8',
  'post9',
  'post10',
];

const setGoogleMapsApiMock = () => {
  google = {
    maps: {
      LatLng: jest.fn(),
      Map: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
      })),
      Marker: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        setMap: jest.fn(),
      })),
      InfoWindow: jest.fn(),
    },
  };
  MarkerClusterer = jest.fn().mockImplementation(() => ({
    clearMarkers: jest.fn(),
  }));
};

const deleteGoogleMapsApiMock = () => {
  google = undefined;
};

describe('MapsHelper', () => {
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

  test("loads API file if it's not ready", () => {
    const mapsHelper = new MapsHelper(mapRef); /* eslint-disable-line */

    expect(loadJS).toHaveBeenCalledTimes(1);
    expect(loadJS.mock.calls[0][0]).toContain('maps.googleapis.com/maps/api/');
  });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsHelper = new MapsHelper(mapRef); /* eslint-disable-line */

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('markers are created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsHelper = new MapsHelper(mapRef);

    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS_ADDED_LAST);

    // markers created immediately each time
    expect(google.maps.Marker).toHaveBeenCalledTimes(
      DUMMY_POSTS.length * 2 /* eslint-disable-line */ +
        DUMMY_POSTS_ADDED_LAST.length * 1 /* eslint-disable-line */,
    );
    expect(mapsHelper.queuedPosts).toBe(null);
  });

  test('marker creation is queued until the API is ready', () => {
    const mapsHelper = new MapsHelper(mapRef);

    // only last posts should be queued
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS_ADDED_LAST);
    expect(mapsHelper.queuedPosts).toEqual(DUMMY_POSTS_ADDED_LAST);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsHelper.mapInitializerGenerator(mapRef)();

    // map should be created
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // marker should be created for the lastly queued posts
    expect(google.maps.Marker).toHaveBeenCalledTimes(
      DUMMY_POSTS_ADDED_LAST.length * 1,
    );

    // queue should be reset
    expect(mapsHelper.queuedPosts).toBe(null);
  });
});