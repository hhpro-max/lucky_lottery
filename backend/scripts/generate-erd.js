const sequelizeErd = require('sequelize-erd');
const db = require('../src/models');
const fs = require('fs');

(async function() {
  try {
    const svg = await sequelizeErd({ source: db.sequelize });
    fs.writeFileSync('../schema-erd.svg', svg);
    console.log('ER diagram saved as schema-erd.svg');
  } catch (err) {
    console.error('Failed to generate ERD:', err);
  }
})(); 