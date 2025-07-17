const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

async function fixUserSequence() {
  try {
    const [[{ max }]] = await sequelize.query('SELECT MAX(id) as max FROM users');
    if (max) {
      await sequelize.query(`SELECT setval('users_id_seq', ${max})`);
      console.log(`users_id_seq set to ${max}`);
    } else {
      console.log('No users found, sequence not updated.');
    }
  } catch (err) {
    console.error('Error fixing user sequence:', err);
  } finally {
    await sequelize.close();
  }
}

fixUserSequence(); 