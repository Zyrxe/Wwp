import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Token verifikasi Meta
const VERIFY_TOKEN = "CmAKHAj60cjZ8fCxAhIGZW50OndhIgN2cnhQstPnvgYaQN4mDODDUu80jnRq5TpEJVAKjWQpNwcpzGbECKGoOroH64cFB5ZWBlRO3l7roAFde45eFPQi4xzAVM+wfwRDBw0SLm03XcfilI7U81q1tJqkbCicWOblVcfYr5UrP06tPKaGKaYmwHq0WxGsPmTd8Yg=";

// Token & Chat ID Telegram (ganti dengan milik Anda)
const TELEGRAM_BOT_TOKEN = "7739949975:AAE5zEOZdMGi4paSUUe_cMmIGLxcU15HxJ4";
const TELEGRAM_CHAT_ID = "7923815784";

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Verifikasi Webhook Meta
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }

    if (req.method === "POST") {
        // Tangkap pesan dari WhatsApp API
        console.log("Pesan masuk:", JSON.stringify(req.body, null, 2));

        if (req.body.entry) {
            const data = req.body.entry[0].changes[0].value.messages;
            if (data && data.length > 0) {
                const text = data[0].text.body;
                const from = data[0].from;

                // Kirim pesan ke Telegram
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: `Pesan baru dari ${from}: ${text}`
                });
            }
        }

        return res.sendStatus(200);
    }

    res.sendStatus(405);
}
