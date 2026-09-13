export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

    
        const BOT_TOKEN = '8695303784:AAFcl-3dpr36lT6bzPC26BkT1Nq4wdfsdt8';
        const CHAT_ID = '7928662929';

        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        let payload = `--${boundary}\r\n`;
        payload += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n`;
        payload += `--${boundary}\r\n`;
        payload += `Content-Disposition: form-data; name="photo"; filename="capture.png"\r\n`;
        payload += `Content-Type: image/png\r\n\r\n`;

        const headerBuffer = Buffer.from(payload, 'utf-8');
        const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
        const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

        const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: multipartBody
        });

        const result = await telegramResponse.json();

        if (!result.ok) {
            throw new Error(result.description || 'Failed to send photo to Telegram');
        }

        return res.status(200).json({ success: true, message: 'Image sent to Telegram successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
