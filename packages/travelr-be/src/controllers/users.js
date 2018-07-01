const dbHelper = require('../helper/db');

const db = dbHelper.db;

exports.createUser = async (req, res, next) => {
  const { userId } = req;
  const { displayName } = req.body;

  if (!displayName) return res.status(400).send('display name missing');

  try {
    const user = await db.none(
      'INSERT INTO users (id, display_name) values ($1, $2)',
      [userId, displayName],
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await db.oneOrNone(
    'SELECT * FROM get_user WHERE id = $1 LIMIT 1',
    userId,
  );

  if (!user) return res.sendStatus(421);

  res.status(200).send({
    userId: user.id,
    displayName: user.display_name,
    isAdmin: user.is_admin,
    earnedViews: +user.earned_views,
    earnedLikes: +user.earned_likes,
    earnedComments: +user.earned_comments,
  });
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req;
  const { displayName } = req.body;

  const userIdParams = req.params.userId;
  if (userId !== userIdParams) return res.sendStatus(421);

  const user = await db
    .one('UPDATE users SET display_name = $1 WHERE id = $2 RETURNING *', [
      displayName,
      userId,
    ])
    .catch(err => res.status(400).send(err.message));

  res.sendStatus(200);
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req;

  const userIdParams = req.params.userId;
  if (userId !== userIdParams) return res.sendStatus(421);

  const user = await db
    .one('DELETE FROM users WHERE id = $1 RETURNING *;', userId)
    .catch(err => res.status(400).send(err.message));

  res.sendStatus(200);
};
