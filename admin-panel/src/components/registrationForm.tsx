"use client"

import React, {useState} from 'react';
import {LockOutlined} from '@ant-design/icons';
import {Button, Form, Input} from 'antd';
import {useUserStore} from "@/store/store";
import Link from "next/link";

export interface Error {
  location: string
  msg: string
  path: string
  type: string
  value: string
}

const RegistrationForm: React.FC = () => {
  const {registration} = useUserStore((state) => state);
  const [isRegistered, setIsRegistered] = useState(false);

  const [errors, setErrors] = useState<string | Error[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const response: string | Error[] = await registration(values.name, values.phoneNumber, values.password);
    console.log("response", response)
    if (Array.isArray(response) && response.length !== 0 && response) {
      setErrors(response);
    } else if (typeof response === "string") {
      setErrors(response);
    } else {
      setIsRegistered(true);

    }
    setLoading(false);

  };

  const onChange = () => {
    setErrors([])
  };
  return (
    <Form
      name="normal_login"
      className="login-form min-w-[300px]"
      initialValues={{remember: true}}
      onFinish={onFinish}
      onChange={onChange}
    >
      <h1 className={"text-xl font-semibold text-center mb-6"}>Регистрация</h1>

      <Form.Item
        name="name"
        validateDebounce={300}
        rules={[
          {required: true, message: 'Введите пароль'},
          {min: 6, message: 'Имя пользователя должно содержать минимум 6 символов'},
          {max: 32, message: 'Имя пользователя не должно превышать 32 символов'},
        ]}
      >
        <Input placeholder="Имя пользователя"/>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        validateDebounce={300}
        rules={[{required: true, message: 'Введите номер телефона'},
          () => ({
            validator(_, value) {
              const phoneNumberPattern = /^[0-9]{10}$/; // Regex to match exactly 11 digits

              if (!value) {
                return Promise.resolve();
              }

              if (phoneNumberPattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Номер неверного формата!'));
            },
          })]}
      >
        <Input prefix={"+7"} placeholder="Номер телефона"/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {required: true, message: 'Введите пароль'},
          {min: 6, message: 'Пароль должен содержать минимум 6 символов'},
          {max: 32, message: 'Пароль не должен превышать 32 символов'},
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon"/>}
          type="password"
          placeholder="Пароль"
        />
      </Form.Item>

      {typeof errors !== 'string' ? errors.map((error, index) => (
        <p key={index} className={"text-red-500 pt-[-10px] pb-3"}>
          {error.msg + " of " + error.path}
        </p>
      )) : <p className={"text-red-500 pt-[-10px] pb-3"}>
        {errors}
      </p>}
      <Form.Item>
        <div className={"w-full flex justify-between items-center"}>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            Зарегистрироваться
          </Button>
          <Link href={"/login"}>
            Войти
          </Link>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;