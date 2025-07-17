const db = require('../models');

exports.getSettings = async (req, res) => {
  try {
    const settings = await db.Setting.findAll();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const setting = await db.Setting.findOne({ where: { key } });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    setting.value = value;
    await setting.save();
    res.json({ message: 'Setting updated', setting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 