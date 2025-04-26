
const db = require('./db');

const findUserByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};


const findNameByEmail = async (email) => {
  const res = await db.query('SELECT name FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const createUser = async (email, hashedPassword, name) => {
  const result = await db.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, hashedPassword, name]
  );
  return result.rows[0];
};
const updateResetCode = async (email, code, expires) => {
  await db.query('UPDATE users SET reset_code = $1, reset_code_expires = $2 WHERE email = $3', [code, expires, email]);
};

const resetPassword = async (email, newPassword) => {
  await db.query('UPDATE users SET password = $1, reset_code = NULL, reset_code_expires = NULL WHERE email = $2', [newPassword, email]);
};

const deleteUser = async (email) => {
  await db.query('DELETE FROM users WHERE email = $1', [email]);
};

const changePassword = async (email, newPassword) => {
  await db.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
}

module.exports = {
  findUserByEmail,
  findNameByEmail,
  createUser,
  updateResetCode,
  resetPassword,
  deleteUser,
  changePassword
};
