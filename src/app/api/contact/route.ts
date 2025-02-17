import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        console.log("📥 Received API Request");

        // Read and log the complete request body
        const body = await req.json();
        console.log("📤 Complete Form Submission:", body);

        // Normalize all fields
        const normalizedBody = {
            firstName: body.nombre || body.firstName,
            lastName: body.apellido || body.lastName,
            email: body.email,
            phone: body.telefono || body.phone,
            inquiryType: body.inquiryType || body.type,
            message: body.message || body.dudas,
        };

        console.log("✅ Normalized Form Data:", normalizedBody);

        // Validate all required fields
        if (!normalizedBody.firstName ||
            !normalizedBody.lastName ||
            !normalizedBody.email ||
            !normalizedBody.phone ||
            !normalizedBody.message) {
            console.error("❌ Missing required fields:", normalizedBody);
            return NextResponse.json({
                message: "All fields are required.",
                receivedData: normalizedBody
            }, { status: 400 });
        }

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
            from: process.env.GMAIL_USER,
            to: process.env.EMAIL_RECEIVER,
            replyTo: normalizedBody.email,
            subject: `New Contact Form Submission from ${normalizedBody.firstName} ${normalizedBody.lastName}`,
            text: `
Contact Form Details:
-------------------
Name: ${normalizedBody.firstName} ${normalizedBody.lastName}
Email: ${normalizedBody.email}
Phone: ${normalizedBody.phone}
Type of Inquiry: ${normalizedBody.inquiryType}

Message:
${normalizedBody.message}
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${normalizedBody.firstName} ${normalizedBody.lastName}</p>
                <p><strong>Email:</strong> ${normalizedBody.email}</p>
                <p><strong>Phone:</strong> ${normalizedBody.phone}</p>
                <p><strong>Type of Inquiry:</strong> ${normalizedBody.inquiryType}</p>
                <h3>Message:</h3>
                <p>${normalizedBody.message}</p>
            `
        });

        console.log("✅ Email sent successfully:", info.response);
        return NextResponse.json({
            message: "Email sent successfully!",
            sentData: normalizedBody  // Include what was actually sent
        }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Error in API:", error.message);
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message,
            receivedData: body  // Include what was received when error occurs
        }, { status: 500 });
    }
}