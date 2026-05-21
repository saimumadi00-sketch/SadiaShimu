import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const writer = req.app.locals.writer;

    if (!writer || email !== writer.email) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, writer.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user = { email: writer.email };

    return res.status(200).json({
      loggedIn: true,
      email: writer.email
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(200).json({ loggedIn: false });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: 'Could not log out' });
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({ loggedIn: false });
  });
});

router.get('/me', (req, res) => {
  const loggedIn = Boolean(req.session && req.session.user);

  return res.status(200).json({
    loggedIn,
    email: loggedIn ? req.session.user.email : null
  });
});

export default router;
