const db = require('../models');

// --- Profile Management ---

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await db.Profile.findOne({
      where: { user_id: userId },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'email_verified', 'status', 'created_at']
      }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      id: profile.id,
      name: profile.name,
      dob: profile.dob,
      address: profile.address,
      phone: profile.phone,
      KYC_status: profile.KYC_status,
      user: profile.User
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dob, address, phone } = req.body;

    // Validate required fields
    if (!name || !dob) {
      return res.status(400).json({ 
        message: 'Name and date of birth are required' 
      });
    }

    // Validate date of birth (must be in the past)
    const dobDate = new Date(dob);
    const today = new Date();
    if (dobDate >= today) {
      return res.status(400).json({ 
        message: 'Date of birth must be in the past' 
      });
    }

    // Find or create profile
    let profile = await db.Profile.findOne({
      where: { user_id: userId }
    });

    if (!profile) {
      profile = await db.Profile.create({
        user_id: userId,
        name,
        dob,
        address,
        phone,
        KYC_status: 'pending'
      });
    } else {
      // Update existing profile
      await profile.update({
        name,
        dob,
        address,
        phone
      });
    }

    res.json({
      message: 'Profile updated successfully',
      profile: {
        id: profile.id,
        name: profile.name,
        dob: profile.dob,
        address: profile.address,
        phone: profile.phone,
        KYC_status: profile.KYC_status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Email Verification ---

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Find email verification record
    const emailVerification = await db.EmailVerification.findOne({
      where: { 
        token: token,
        verified_at: null,
        expires_at: { [db.Sequelize.Op.gt]: new Date() }
      },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'email_verified']
      }]
    });

    if (!emailVerification) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user email verification status
    await emailVerification.User.update({ email_verified: true });
    
    // Mark verification as completed
    await emailVerification.update({ 
      verified_at: new Date() 
    });

    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: emailVerification.User.id,
        email: emailVerification.User.email,
        email_verified: true
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Password Reset ---

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create or update security token
    await db.SecurityToken.upsert({
      user_id: user.id,
      token: resetToken,
      type: 'reset_password',
      expires_at: expiresAt
    });

    // Send reset email (implement your email service here)
    // For now, we'll just return the token in development
    if (process.env.NODE_ENV === 'development') {
      res.json({ 
        message: 'Password reset link sent',
        resetToken: resetToken // Remove this in production
      });
    } else {
      res.json({ 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }

    // Validate password strength
    if (new_password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Find valid reset token
    const securityToken = await db.SecurityToken.findOne({
      where: { 
        token: token,
        type: 'reset_password',
        expires_at: { [db.Sequelize.Op.gt]: new Date() }
      },
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    if (!securityToken) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    // Update user password
    await securityToken.User.update({ 
      password_hash: hashedPassword 
    });

    // Delete the used token
    await securityToken.destroy();

    res.json({ 
      message: 'Password reset successfully' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 