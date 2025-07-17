const db = require('../models');
const { Op } = require('sequelize');

// --- Support Ticket Management ---

exports.createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ 
        message: 'Subject and message are required' 
      });
    }

    // Validate subject length
    if (subject.length > 255) {
      return res.status(400).json({ 
        message: 'Subject must be 255 characters or less' 
      });
    }

    // Create support ticket
    const ticket = await db.SupportTicket.create({
      user_id: userId,
      subject,
      message,
      status: 'open'
    });

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        created_at: ticket.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    // Build where clause
    const where = { user_id: userId };
    
    if (status) {
      where.status = status;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const tickets = await db.SupportTicket.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    res.json({
      tickets: tickets.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(tickets.count / limit),
        total_items: tickets.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find ticket and ensure it belongs to the user
    const ticket = await db.SupportTicket.findOne({
      where: { 
        id: id,
        user_id: userId 
      },
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Admin Functions for Support Management ---

exports.getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, user_id } = req.query;

    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const tickets = await db.SupportTicket.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    res.json({
      tickets: tickets.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(tickets.count / limit),
        total_items: tickets.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_reply } = req.body;

    // Find ticket
    const ticket = await db.SupportTicket.findByPk(id, {
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Update ticket
    const updateData = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'closed') {
        updateData.closed_at = new Date();
      }
    }

    if (admin_reply) {
      // For now, we'll append the admin reply to the message
      // In a real implementation, you might want a separate table for replies
      updateData.message = `${ticket.message}\n\n--- Admin Reply ---\n${admin_reply}`;
    }

    await ticket.update(updateData);

    res.json({
      message: 'Support ticket updated successfully',
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        created_at: ticket.created_at,
        closed_at: ticket.closed_at,
        user: ticket.User
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTicketStats = async (req, res) => {
  try {
    // Get ticket statistics
    const totalTickets = await db.SupportTicket.count();
    const openTickets = await db.SupportTicket.count({ where: { status: 'open' } });
    const pendingTickets = await db.SupportTicket.count({ where: { status: 'pending' } });
    const closedTickets = await db.SupportTicket.count({ where: { status: 'closed' } });

    // Get recent tickets (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTickets = await db.SupportTicket.count({
      where: {
        created_at: { [Op.gte]: sevenDaysAgo }
      }
    });

    res.json({
      total_tickets: totalTickets,
      open_tickets: openTickets,
      pending_tickets: pendingTickets,
      closed_tickets: closedTickets,
      recent_tickets: recentTickets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 