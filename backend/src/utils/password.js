const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

exports.verifyPassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
}; 