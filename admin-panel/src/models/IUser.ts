export interface IUser {
  name: string;
  telegramUsername?: string;
  password?: string;
  phoneNumber: string;
  role: string;
  receiveNotifications: boolean;
  chatId?: number,

}