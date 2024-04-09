import {Response, Request} from "express";

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

    if (req.body.message.text === "/start") {
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

      const startResponseMessage = {
        method: "sendMessage",
        chat_id: chatId,
        reply_markup: replyKeyboard,
        text: startMessage,
        parse_mode: "Markdown",
      };

      return res.status(200).send(startResponseMessage);
    } else if (req.body.message.text ===
      "Посмотреть заполненность \uD83D\uDC40") {
      const fullnessResponseMessage = viewFullness(chatId);

      return res.status(200).send(fullnessResponseMessage);
    } else if (req.body.message.text ===
      "Подписаться на уведомления \uD83D\uDD14") {
      const subscribeResponseMessage = subscribeForNotifications(chatId);

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

const subscribeForNotifications = (chatId: number) => {
  const subscribeMessage =
    "Временно недоступно";
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: subscribeMessage,
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
