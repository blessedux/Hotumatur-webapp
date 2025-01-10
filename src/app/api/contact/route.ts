import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        console.log("📥 Received API Request");
        console.log("🔍 Method:", req.method);
        console.log("🔍 Headers:", JSON.stringify([...req.headers.entries()]));

        // Read the body **only once**
        const body = await req.json();
        console.log("📤 Parsed JSON Body:", body);

        // Normalize field names (Map frontend fields to expected API fields)
        const normalizedBody = {
            name: body.nombre || body.name,  // Support both "nombre" and "name"
            email: body.email,
            message: body.message || body.dudas, // "message" should take priority, fallback to "dudas"
        };

        console.log("✅ Normalized Request Body:", normalizedBody);

        // Validate required fields
        if (!normalizedBody.name || !normalizedBody.email || !normalizedBody.message) {
            console.error("❌ Missing required fields:", normalizedBody);
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        console.log("✅ Valid request. Proceeding to send email...");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
            tls: { rejectUnauthorized: false },
        });

        const info = await transporter.sendMail({
            from: `"${normalizedBody.name}" <${normalizedBody.email}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: "New Contact Form Submission",
            text: normalizedBody.message,
        });

        console.log("✅ Email sent successfully:", info.response);
        return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Error in API:", error.message);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}