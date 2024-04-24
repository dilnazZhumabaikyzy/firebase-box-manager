import {Request, Response} from "express";
import {logger} from "firebase-functions";
import {Message} from "node-telegram-bot-api";
import User from "./model/user";
import {db} from "./config/firebase";

const onUpdateReceived = async (req: Request, res: Response) => {
  const isTelegramMessage = req.body &&
    req.body.message &&
    req.body.message.chat &&
    req.body.message.chat.id &&
    req.body.message.from &&
    req.body.message.from.first_name;

  if (isTelegramMessage) {
    const chatId = req.body.message.chat.id;
    const firstName = req.body.message.from.first_name;
    const message = req.body.message;
    if (req.body.message.text === "/start") {
      const startResponseMessage = await handleStartCommand(message, firstName);
      logger.debug("test", startResponseMessage);
      return res.status(200).send(startResponseMessage);
    } else if (req.body.message.text ===
      "Посмотреть заполненность \uD83D\uDC40") {
      const fullnessResponseMessage = viewFullness(chatId);

      return res.status(200).send(fullnessResponseMessage);
    } else if (req.body.message.text ===
      "Подписаться на уведомления \uD83D\uDD14") {
      const subscribeResponseMessage =
        await subscribeForNotifications(req.body.message);

      return res.status(200).send(subscribeResponseMessage);
    } else if (req.body.message.text ===
      "Отписаться от уведомлений 🔕") {
      const subscribeResponseMessage =
        await unsubscribeForNotifications(req.body.message);

      return res.status(200).send(subscribeResponseMessage);
    } else {
      return res.status(200).send(handleUndefinedCommand(chatId));
    }
  }
  return res.status(200).send({status: "not a telegram message"});
};

const viewFullness = (chatId: number) => {
  const occupancyMessage = "Текущая заполненность боксов: ...";
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: occupancyMessage,
    parse_mode: "Markdown",
  };
};

const subscribeForNotifications = async (message: Message) => {
  const username = message.from?.username;

  if (username != null) {
    const subscribeMessage =
      "Вы подписались на уведомления о заполненности боксов";
    const userRef = db.collection("users").doc(username);
    await userRef.update({receiveNotifications: true});

    const replyKeyboard = {
      keyboard: [
        [
          {
            text: "Посмотреть заполненность \uD83D\uDC40",
          },
        ],
        [
          {
            text: "Отписаться от уведомлений 🔕",
          },
        ],
      ],
      resize_keyboard: true,
    };
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      reply_markup: replyKeyboard,
      text: subscribeMessage,
      parse_mode: "Markdown",
    };
  }

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "Что то пошло не так :(",
    parse_mode: "Markdown",
  };
};

const unsubscribeForNotifications = async (message: Message) => {
  const username = message.from?.username;

  if (username != null) {
    const subscribeMessage =
      "Вы отписались от уведомлений 🔕";
    const userRef = db.collection("users").doc(username);
    await userRef.update({receiveNotifications: false});
    const replyKeyboard = {
      keyboard: [
        [
          {
            text: "Посмотреть заполненность \uD83D\uDC40",
          },
        ],
        [
          {
            text: "Подписаться на уведомления \uD83D\uDD14",
          },
        ],
      ],
      resize_keyboard: true,
    };
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      reply_markup: replyKeyboard,
      text: subscribeMessage,
      parse_mode: "Markdown",
    };
  }

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "Что то пошло не так :(",
    parse_mode: "Markdown",
  };
};

const handleStartCommand = async (message: Message, firstName: string) => {
  const user: User = {
    name: message.chat.first_name,
    telegramUsername: message.chat.username || "",
    role: "user",
    receiveNotifications: false,
  };

  if (user.telegramUsername) {
    const userRef = db.collection("users").doc(user.telegramUsername);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({...user});
    }
  }

  const startMessage =
    `Приветствую ${firstName}👋🏽\n\nЯ - ваш персональный бот для` +
    " управления боксами с одеждой благотворительного фонда." +
    "Вот мои основные функции:\n\n" +
    "1. **Просмотреть заполненность\uD83D\uDC40**:" +
    " можете узнать текущий процент заполненности" +
    " боксов в различных точках города, просто отправив мне команду \n" +
    "2. **Подписаться на уведомления\uD83D\uDD14**:" +
    " сможете получать сообщения от меня когда какой " +
    "то из боксов заполнится.\n";

  const replyKeyboard = {
    keyboard: [
      [
        {
          text: "Посмотреть заполненность \uD83D\uDC40",
        },
      ],
      [
        {
          text: "Подписаться на уведомления \uD83D\uDD14",
        },
      ],
    ],
    resize_keyboard: true,
  };

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    reply_markup: replyKeyboard,
    text: startMessage,
    parse_mode: "Markdown",
  };
};

const handleUndefinedCommand = (chatId: number) => {
  const errorMessage = `Простите, я не понимаю эту команду.
  Пожалуйста, используйте доступные команды.`;
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: errorMessage,
    parse_mode: "Markdown",
  };
};


export {onUpdateReceived};
