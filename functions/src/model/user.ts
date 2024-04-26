interface User {
  name?: string;
  telegramUsername: string;
  password?: string;
  phoneNumber?: number;
  role: string;
  receiveNotifications?: boolean;
  chatId?: number,
}

export default User;
