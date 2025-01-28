import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const forgotPasswordApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'No user found with this email' });
      }

      // Create reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

      // Save token in DB
      await db.collection('users').updateOne(
        { email },
        { $set: { resetToken, resetTokenExpiration } }
      );

      // Create reset link
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

      // Send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });

      await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Please use the following link to reset your password: ${resetLink}`,
      });

      res.status(200).json({ message: 'Email sent. Please check your inbox' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default forgotPasswordApi;
