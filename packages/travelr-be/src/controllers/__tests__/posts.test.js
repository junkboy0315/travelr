const request = require('supertest');

const config = require('../../../config');
const app = require('../../index');
const dbHelper = require('../../helper/db');
const {
  DUMMY_POSTS,
  DUMMY_USER_DISPLAY_NAME,
  DUMMY_USER_ID,
} = require('../../dummies/dummies');
const { db, pgPromise } = dbHelper;

const deleteDummyPosts = async () => {
  // delete posts
  DUMMY_POSTS.forEach(async post => {
    await db.oneOrNone(
      'DELETE FROM posts WHERE user_id = $1 RETURNING *',
      DUMMY_USER_ID,
    );
  });

  // delete user
  await db.oneOrNone(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    DUMMY_USER_ID,
  );
};

const createDummyPosts = async () => {
  // delete posts and user
  await deleteDummyPosts();

  // create user
  await db.one(
    'INSERT INTO users(id, display_name) VALUES ($1, $2) RETURNING *;',
    [DUMMY_USER_ID, DUMMY_USER_DISPLAY_NAME],
  );

  // create posts
  const column = [
    'user_id',
    'old_image_url',
    'new_image_url',
    'description',
    'shoot_date',
    {
      name: 'geom',
      mod: '^', // format as raw text
    },
    'view_count',
  ];
  const columnSet = new pgPromise.helpers.ColumnSet(column, {
    table: 'posts',
  });
  const query = pgPromise.helpers.insert(DUMMY_POSTS, columnSet);
  await db.none(query);
};

afterAll(() => {
  pgPromise.end();
});

beforeAll(async () => {
  await createDummyPosts();
});

describe('GET /posts', async () => {
  test('returns 200 if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
  });

  test('returns array if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.body instanceof Array).toBeTruthy();
  });

  test('returns valid body if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.body[0]).toHaveProperty('postId');
    expect(res.body[0]).toHaveProperty('userId');
    expect(res.body[0]).toHaveProperty('oldImageUrl');
    expect(res.body[0]).toHaveProperty('newImageUrl');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('shootDate');
    expect(res.body[0]).toHaveProperty('lng');
    expect(res.body[0]).toHaveProperty('lat');
    expect(res.body[0]).toHaveProperty('viewCount');
    expect(res.body[0]).toHaveProperty('displayName');
    expect(res.body[0]).toHaveProperty('likedCount');
    expect(res.body[0]).toHaveProperty('commentsCount');
  });

  test('returns empty array if no data found', async () => {
    const res = await request(app).get('/posts?user_id=someInvalidId');

    expect(res.body).toEqual([]);
  });

  test('returns data filtered by user_id', async () => {
    const res = await request(app).get(`/posts?user_id=${DUMMY_USER_ID}`);

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by display_name', async () => {
    const res = await request(app).get(
      `/posts?display_name=${DUMMY_USER_DISPLAY_NAME}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by description', async () => {
    const serachWord = '_description';
    const res = await request(app).get(`/posts?description=${serachWord}`);

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by date', async () => {
    const minDate = '1800-01-01';
    const maxDate = '1800-02-02';
    const res = await request(app).get(
      `/posts?min_date=${minDate}&max_date=${maxDate}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by lng, lat, radius', async () => {
    const lng = 10.001;
    const lat = 20.001;
    const radius = 500; // by meter
    const res = await request(app).get(
      `/posts?lng=${lng}&lat=${lat}&radius=${radius}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by view count', async () => {
    const min = 50000;
    const max = 50001;
    const res = await request(app).get(
      `/posts?min_view_count=${min}&max_view_count=${max}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by liked count', async () => {
    const min = 5;
    const max = 10;
    const res = await request(app).get(
      `/posts?min_liked_count=${min}&max_liked_count=${max}`,
    );

    if (!res.body.length) throw new Error('insufficient data');

    const fault =
      res.body.find(item => item.likedCount > max) ||
      res.body.find(item => item.likedCount < min);

    expect(fault).toBeFalsy();
  });

  test('returns data filtered by comments count', async () => {
    const min = 1;
    const max = 2;
    const res = await request(app).get(
      `/posts?min_comments_count=${min}&max_comments_count=${max}`,
    );

    if (!res.body.length) throw new Error('insufficient data');

    const fault =
      res.body.find(item => item.commentsCount > max) ||
      res.body.find(item => item.commentsCount < min);

    expect(fault).toBeFalsy();
  });
});
