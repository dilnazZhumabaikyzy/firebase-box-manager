import {FC} from 'react';
import {IUser} from "@/models/IUser";

interface ProfileInfoProps {
  user: IUser | null;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  if (!user) {
    return <p>Пользователь не авторизован</p>;
  }

  return (
    <div className="p-4 rounded">
      <table className="table-auto">
        <tbody>
        <tr>
          <td className="font-semibold pr-4">Имя:</td>
          <td>{user.name}</td>
        </tr>
        {user.telegramUsername && (
          <tr>
            <td className="font-semibold pr-4">Телеграм:</td>
            <td>@{user.telegramUsername}</td>
          </tr>
        )}
        <tr>
          <td className="font-semibold pr-4">Телефон:</td>
          <td>{user.phoneNumber}</td>
        </tr>
        <tr>
          <td className="font-semibold pr-4">Роль:</td>
          <td>{user.role}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfileInfo;