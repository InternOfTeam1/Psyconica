

export const sendTelegramMessage = async (clientName: any, ClientEmail: any, psyName: any) => {
  const botToken = '7050284789:AAG_R5_OkZYbacR8FhzRCl33QGUYfNYH7RU';
  const chatId = '-1002024817599';


  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const message = `Здравствуйте ${psyName},

  Меня зовут ${clientName}. Я хотел(а) бы записаться на консультацию.
  
  Мои контактные данные:
Email: ${ClientEmail}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to send message to Telegram: ${responseData.description}`);
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};
