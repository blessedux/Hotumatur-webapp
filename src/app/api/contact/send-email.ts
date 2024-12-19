import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Extract data from request body
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: 'New Contact Form Submission',
            text: message,
        });

        return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Failed to send email:', error);
        return res.status(500).json({ message: 'Email sending failed.' });
    }
}