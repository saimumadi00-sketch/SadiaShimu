import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password must be 128 characters or fewer')
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
}

router.post('/login', loginValidation, validateRequest, async (req, res, next) => {
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
