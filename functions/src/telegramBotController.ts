import {Request, Response} from "express";
import {logger} from "firebase-functions";
import {Message} from "node-telegram-bot-api";
import {db} from "./config/firebase";
import {getLastReports} from "./reportController";
import {FullnessItem} from "./dto/reportDto";
import User from "./model/user";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

const onUpdateReceived = async (req: Request, res: Response) => {
  const isTelegramMessage = req.body &&
    req.body.message &&
    req.body.message.chat &&
    req.body.message.chat.id &&
    req.body.message.from &&
    req.body.message.from.first_name;

  if (isTelegramMessage) {
    const chatId = req.body.message.chat.id;
    const message = req.body.message;
    logger.debug(chatId, "Test");
    const chatRef = await db.collection("chats").doc(chatId.toString());
    const chat = await chatRef.get();

    if (!chat.exists) {
      logger.debug("login");
      const startResponseMessage =
        await handleLogin(message, chatRef);
      logger.debug("test", startResponseMessage);
      return res.status(200).send(startResponseMessage);
    }
    const state = chat.data()?.state;
    logger.debug(state, "state");
    if (state == "waiting number") {
      const startResponseMessage =
        await processPhoneNumber(message, chatRef);
      logger.debug("test", startResponseMessage);
      return res.status(200).send(startResponseMessage);
    } else if (state == "authorized") {
      if (req.body.message.text ===
        "Посмотреть заполненность \uD83D\uDC40") {
        const fullnessResponseMessage = await viewFullness(chatId);

        return res.status(200).send(fullnessResponseMessage);
      } else if (req.body.message.text ===
        "Подписаться на уведомления \uD83D\uDD14") {
        const phoneNumber: string = chat.data()?.phoneNumber;
        const subscribeResponseMessage =
          await subscribeForNotifications(req.body.message, phoneNumber);

        return res.status(200).send(subscribeResponseMessage);
      } else if (req.body.message.text ===
        "Отписаться от уведомлений 🔕") {
        const phoneNumber: string = chat.data()?.phoneNumber;
        const subscribeResponseMessage =
          await unsubscribeForNotifications(req.body.message, phoneNumber);

        return res.status(200).send(subscribeResponseMessage);
      } else {
        return res.status(200).send(handleUndefinedCommand(chatId));
      }
    }
  }
  return res.status(200).send({status: "not a telegram message"});
};

const getFullnessColorEmoji = (percent: number): string => {
  let color = "";

  if (percent >= 70) {
    for (let i = 0; i < percent / 10; i++) {
      color += "🟥";
    }
  } else if (percent >= 40) {
    for (let i = 0; i < percent / 10; i++) {
      color += "🟨";
    }
  } else if (percent >= 10) {
    for (let i = 0; i < percent / 10; i++) {
      color += "🟩";
    }
  } else {
    color += "🟩";
  }

  for (let i = 0; i < 10 - percent / 10; i++) {
    color += "⬜️";
  }

  return color.trim();
};

const getFormattedResponseMessage = (list: FullnessItem[]) => {
  let responseMessage = "Информация о заполненности на данный момент\n";

  list.forEach((item, index: number) => {
    responseMessage += `${index + 1}. ${item.name}\n`;
    responseMessage += getFullnessColorEmoji(item.fullness);
    responseMessage += ` ${item.fullness}%\n`;
  });

  return responseMessage;
};

const viewFullness = async (chatId: number) => {
  const fullnessReport: FullnessItem[] = await getLastReports();
  logger.debug("FULLNESS LOG", fullnessReport);
  const responseMessage = getFormattedResponseMessage(fullnessReport);

  logger.info("RESPONSE MESSAGE", responseMessage);
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: responseMessage,
    parse_mode: "Markdown",
  };
};

const subscribeForNotifications = async (
  message: Message,
  phoneNumber: string) => {
  const subscribeMessage =
    "Вы подписались на уведомления о заполненности боксов";
  const userRef = db.collection("users").doc(phoneNumber);
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
};

const unsubscribeForNotifications = async (
  message: Message,
  phoneNumber: string) => {
  const subscribeMessage =
    "Вы отписались от уведомлений 🔕";
  const userRef = db.collection("users").doc(phoneNumber);
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
};

const validatePhoneNumber = (phoneNumber: string) => {
  const pattern = /^\+\d{11}$/;

  return pattern.test(phoneNumber);
};

const handleLogin = async (
  message: Message,
  chatRef: DocumentReference<DocumentData>
) => {
  const enterNumberMessage =
    "Введите свой номер телефона 📲 \n как в примере: +77657654321";

  await chatRef.set({state: "waiting number"});

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: enterNumberMessage,
    parse_mode: "Markdown",
  };
};

const processPhoneNumber = async (
  message: Message,
  chatRef: DocumentReference<DocumentData>
) => {
  const phoneNumber: string | undefined = message.text;

  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "Неверный формат номера",
      parse_mode: "Markdown",
    };
  }

  const userRef = await db.collection("users")
    .doc(<string>phoneNumber?.substring(1));

  const user = await userRef.get();
  if (!user.exists) {
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "Вы не сотрудник организации",
      parse_mode: "Markdown",
    };
  }

  const userData: User = user.data() as User;
  const updatedUser = {
    ...userData,
    telegramUsername: message.chat.username,
    chatId: message.chat.id,
  };

  await userRef.set(updatedUser);

  const startMessage =
    `Приветствую ${userData.name}👋🏽\n\nЯ - ваш персональный бот для` +
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
  await chatRef.set(
    {
      state: "authorized",
      phoneNumber: phoneNumber?.substring(1),
    }
  );

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
