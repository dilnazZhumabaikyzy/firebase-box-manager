"use client"

import React, {useState} from 'react';
import {LockOutlined} from '@ant-design/icons';
import {Button, Form, Input} from 'antd';
import {useRouter} from "next/navigation";
import {useUserStore} from "@/store/store";
import Link from "next/link";

const App: React.FC = () => {
  const router = useRouter();
  const {login} = useUserStore((state) => state);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await login(values.phoneNumber, values.password);
    console.log("response", response)
    if (response) {
      setError(response);
    } else {
      router.push("/");
    }
    setLoading(false);

  };

  const onChange = () => {
    setError('')
  };

  return (
    <Form
      name="normal_login"
      className="login-form min-w-[300px]"
      initialValues={{remember: true}}
      onFinish={onFinish}
      onChange={onChange}
    >
      <h1 className={"text-xl font-semibold text-center mb-6"}>Вход</h1>
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
        rules={[{required: true, message: 'Введите пароль'}]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon"/>}
          type="password"
          placeholder="Пароль"
        />
      </Form.Item>
      <p className={"text-red-500 pt-[-10px] pb-3"}>
        {error}
      </p>
      <Form.Item>
        <Form.Item>
          <div className={"w-full flex justify-between items-center"}>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              Войти
            </Button>
            <Link href={"/registration"}>
              Зарегистрироваться
            </Link>
          </div>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default App;