import { FC } from 'react';

const Page: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Вы успешно зарегистрировались!
        </h1>
        <h1 className="text-xl text-gray-800 mb-4">
          Пока что у вас нету разрешений для полного функционала.
        </h1>
        <p className="text-gray-600 mb-6">
          Запрос на разрешение отправлен Админу.
        </p>
        <a
          href="https://t.me/pogreb01bot" target="_blank"
          className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          У вас есть доступ только к телеграм боту!
        </a>
      </div>
    </div>
  );
};


export default Page;