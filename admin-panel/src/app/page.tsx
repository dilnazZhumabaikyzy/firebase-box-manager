"use client"

import {Button, Radio, RadioChangeEvent} from 'antd';
import React, {useEffect, useState} from "react";
import Boxes from "@/components/Boxes";
import Users from "@/components/Users";
import Image from "next/image";
import logo from '../../public/logo.png';
import {useUserStore} from "@/store/store";
import {useRouter} from "next/navigation";
import ProfileInfo from "@/components/ProfileInfo";
import {LogoutOutlined} from "@ant-design/icons";

export default function Home() {
  const router = useRouter();
  const {user, isAuth, checkAuth, logout} = useUserStore((state) => state);

  const [option, setOption] = useState('boxes');

  useEffect(() => {
    useUserStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (localStorage.getItem("access")) {
      checkAuth();
    } else {
      router.push("/login");
    }
    console.log(isAuth, "AUTH")
  }, [isAuth]);

  const onChange = ({target: {value}}: RadioChangeEvent) => {
    console.log(value);
    setOption(value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className={'flex items-center justify-between w-full mb-8'}>
        <div className={"flex items-center"}>
          <Image src={logo} alt={'TEPLO'} width={100}/>
          <h1 className={'text-3xl ml-5'}>Панель управления</h1>
        </div>
        <ProfileInfo user={user}/>
        <Button type="primary" icon={<LogoutOutlined />} onClick={() => logout(user?.phoneNumber)}>
          Выйти
        </Button>
      </div>
      <Radio.Group
        onChange={onChange}
        value={option}
        optionType="button"
        buttonStyle="solid"
        style={{width: '70%', marginBottom: '32px'}}
      >
        <Radio.Button className={'w-1/2 text-center text-lg'} value="boxes">Боксы</Radio.Button>
        <Radio.Button className={'w-1/2 text-center text-lg'} value="users">Пользователи</Radio.Button>
      </Radio.Group>
      {option === 'boxes' && <Boxes/>}
      {option === 'users' && <Users/>}
    </main>
  );
}
