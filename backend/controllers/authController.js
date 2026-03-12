import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/google
export const googleAuth = async (req, res) => {
    const { credential, accessToken, userInfo } = req.body;

    let googleId, name, email, avatar;

    if (credential) {
        // ID token flow (Google One-Tap)
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        name = payload.name;
        email = payload.email;
        avatar = payload.picture;
    } else if (accessToken && userInfo) {
        // Implicit flow (access_token + prefetched userInfo)
        googleId = userInfo.sub;
        name = userInfo.name;
        email = userInfo.email;
        avatar = userInfo.picture;
    } else {
        return res.status(400).json({ message: 'Missing Google credentials' });
    }

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
        user = await User.create({ googleId, name, email, avatar });
    } else {
        // Update avatar/name in case they changed
        user.name = name;
        user.avatar = avatar;
        await user.save();
    }

    const token = signToken(user._id);
    res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({
        user: { _id: req.user._id, name: req.user.name, email: req.user.email, avatar: req.user.avatar },
    });
};
