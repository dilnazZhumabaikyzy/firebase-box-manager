interface User {
  name: string;
  telegramUsername?: string;
  password?: string;
  phoneNumber: string;
  role: string;
  receiveNotifications: boolean;
  chatId?: number,
}

export default User;
