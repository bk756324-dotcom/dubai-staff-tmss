import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { generateToken, authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { User, ApiResponse } from '../../types/index.js';

export const authRouter = Router();

// Sign-In
authRouter.post('/sign-in', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
      return;
    }

    const user = db.findOne('users', (u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact transport operations administration.',
      });
      return;
    }

    // Check password
    const storedHash = db.getUserPasswordHash(user.email);
    let isPasswordValid = false;

    if (storedHash) {
      isPasswordValid = await bcrypt.compare(password, storedHash);
    }

    // Developer convenience: allow default testing password 'admin123' or 'password123'
    if (!isPasswordValid && (password === 'admin123' || password === 'password123')) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const token = generateToken(user);

    const response: ApiResponse<{ user: User; token: string; expiresAt: string }> = {
      success: true,
      data: {
        user,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      message: `Welcome back, ${user.name}!`,
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error during authentication.',
    });
  }
});

// Sign-Up
authRouter.post('/sign-up', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, role, department, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and password are required fields.',
      });
      return;
    }

    const existing = db.findOne('users', (u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    const newUser: User = db.create('users', {
      name,
      email,
      phone: phone || '+971 50 000 0000',
      role: role || 'CLIENT',
      status: 'ACTIVE',
      department: department || 'General Corporate',
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      message: 'Account created successfully.',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create user account.',
    });
  }
});

// Get current authenticated user
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    data: req.user,
  });
});

// Sign-Out
authRouter.post('/sign-out', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Signed out successfully.',
  });
});
