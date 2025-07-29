import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { titulo, mensagem } = req.body;

    if (!titulo || !mensagem) {
        return res.status(400).json({ error: "Título e mensagem são obrigatórios" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Contato do Site" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `Contato: ${titulo}`,
            text: mensagem,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return res.status(500).json({ error: "Erro ao enviar email." });
    }
}
