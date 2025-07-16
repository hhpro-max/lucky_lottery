const db = require('../models');

exports.listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: 'Roles must be a non-empty array' });
    }
    // Optionally: validate roles against allowed roles
    const allowedRoles = ['player', 'admin'];
    if (!roles.every(r => allowedRoles.includes(r))) {
      return res.status(400).json({ message: 'Invalid role(s) specified' });
    }
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.roles = roles;
    await user.save();
    res.json({ message: 'User roles updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 