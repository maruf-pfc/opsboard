import User from '../models/User.js';

// Role-based access control middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

// Check if user can modify another user's profile
export const canModifyUser = (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  // Admin can modify any user
  if (currentUser.role === 'ADMIN') {
    return next();
  }

  // Users can only modify their own profile
  if (currentUser._id.toString() === targetUserId) {
    return next();
  }

  // Manager and Trainer can modify member profiles
  if (['MANAGER', 'TRAINER'].includes(currentUser.role)) {
    // Check if target user is a member
    User.findById(targetUserId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        if (user.role === 'MEMBER') {
          return next();
        }
        return res.status(403).json({
          error: 'You can only modify member profiles',
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: 'Server error' });
      });
  } else {
    return res.status(403).json({
      error: 'Access denied. Insufficient permissions.',
    });
  }
};

// Check if user can view another user's profile
export const canViewUser = (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  // Admin can view any user
  if (currentUser.role === 'ADMIN') {
    return next();
  }

  // Users can view their own profile
  if (currentUser._id.toString() === targetUserId) {
    return next();
  }

  // Manager and Trainer can view member profiles
  if (['MANAGER', 'TRAINER'].includes(currentUser.role)) {
    User.findById(targetUserId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        if (user.role === 'MEMBER') {
          return next();
        }
        return res.status(403).json({
          error: 'You can only view member profiles',
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: 'Server error' });
      });
  } else {
    return res.status(403).json({
      error: 'Access denied. Insufficient permissions.',
    });
  }
};
