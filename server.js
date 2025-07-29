require('dotenv').config();
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Разрешаем запросы с любого источника (можно настроить домен)
app.use(express.json());

app.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !chatId) {
    return res.status(500).json({ error: 'Bot token or chat ID not set' });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());

app.post('/order', async (req, res) => {
  const { name, phone, address, cart } = req.body;

  if (!name || !phone || !cart || Object.keys(cart).length === 0) {
    return res.status(400).send({ error: 'Missing required fields' });
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
});
