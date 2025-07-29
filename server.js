require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

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

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Telegram error:', error.message);
    res.status(500).send({ error: 'Не вдалося надіслати повідомлення' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // <-- Разрешает запросы с любого домена
app.use(express.json());

app.post('/order', (req, res) => {
  const { text } = req.body;
  // логика отправки в телегу...

  res.json({ status: 'ok' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
});
