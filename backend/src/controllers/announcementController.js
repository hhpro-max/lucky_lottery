const db = require('../models');

exports.getAnnouncements = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};
    if (active !== undefined) where.active = active === 'true';
    const announcements = await db.Announcement.findAll({
      where,
      order: [['published_at', 'DESC']]
    });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, published_at, active } = req.body;
    const announcement = await db.Announcement.create({
      title,
      message,
      published_at: published_at || new Date(),
      active: active !== undefined ? active : true
    });
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, published_at, active } = req.body;
    const announcement = await db.Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    if (title !== undefined) announcement.title = title;
    if (message !== undefined) announcement.message = message;
    if (published_at !== undefined) announcement.published_at = published_at;
    if (active !== undefined) announcement.active = active;
    await announcement.save();
    res.json({ message: 'Announcement updated', announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await db.Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    await announcement.destroy();
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 