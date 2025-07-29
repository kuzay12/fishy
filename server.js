require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// /send (ручной текст)
app.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });
    res.json({ status: 'Message sent' });
  } catch (error) {
    console.error('Telegram API error:', error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// /order (автоформат)
app.post('/order', async (req, res) => {
  const { name, phone, address, cart } = req.body;

  if (!name || !phone || !cart || Object.keys(cart).length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let message = `🛒 *Нове замовлення*\n\n👤 Імʼя: ${name}\n📞 Телефон: ${phone}`;
  if (address) {
    message += `\n🏠 Доставка: ${address}`;
  } else {
    message += `\n🚶 Самовивіз`;
  }

  message += `\n\n📦 Замовлено:\n`;
  Object.entries(cart).forEach(([item, data]) => {
    message += `• ${item} — ${data.count} × ${data.price} грн\n`;
  });

  try {
    await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });
    res.json({ status: 'Order sent' });
  } catch (error) {
    console.error('Telegram API error:', error.message);
    res.status(500).json({ error: 'Failed to send order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
