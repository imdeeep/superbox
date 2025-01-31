const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const authSuccess = (req, res) => {
  const token = generateToken(req.user);
  
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true, // Enable in production
    // secure: false, // Enable in development
    sameSite: 'None',  // Enable in production
    // sameSite: "lax", // Enable in development
    maxAge: 24 * 60 * 60 * 1000,  // 1 day
    path:'/'
  });

  res.clearCookie('connect.sid');

  console.log('Setting cookie without domain specification');
  res.redirect(process.env.FRONTEND_URL);
};

const authFailure = (req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed",
  });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error("Session destruction error:", destroyErr);
        return res.status(500).json({ message: 'Session destruction failed' });
      } 
      res.clearCookie('authToken');
      res.json({ message: 'Logged out successfully' });
    });
  });
};

const checkAuth = (req, res) => {
  const token = req.cookies.authToken;
  if (req.user && token) {
    return res.json({ user: req.user, token });
  }

  return res.status(401).json({ message: 'Unauthorized' });
};

const getUserByToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.json({
      success: true,
      user: decoded, 
    });
  });
};


module.exports = {
  authSuccess,
  authFailure,
  checkAuth,
  logout,
  getUserByToken,
};