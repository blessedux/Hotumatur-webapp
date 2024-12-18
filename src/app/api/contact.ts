import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { nombre, apellido, email, telefono, message, dudas } = req.body;

        // Here, you would handle sending the data (e.g., saving it, sending an email, etc.)
        console.log("Contact Form Data:", { nombre, apellido, email, telefono, message, dudas });

        // Simulate success response
        return res.status(200).json({ success: true, message: "Mensaje enviado correctamente" });
    }

    // Handle invalid methods
    return res.status(405).json({ error: "Método no permitido" });
}