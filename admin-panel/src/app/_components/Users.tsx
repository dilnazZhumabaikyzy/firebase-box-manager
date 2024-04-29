"use client";

import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Space, Table, TableProps} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import EditUserModal from "@/app/_components/modals/EditUserModal";


interface DataType {
  name: string,
  role: string,
  telegramUsername: string,
  phoneNumber: number,
  receiveNotifications: boolean,
}

const apiUrl = "https://us-central1-teplotest-d9137.cloudfunctions.net/app";


const Users = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className={"font-bold"}>{text}</span>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <span className={"semi-bold"}>{text}</span>,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => <span className={"semi-bold"}>{text ? text : "--"}</span>
    },
    {
      title: 'Телеграм',
      dataIndex: 'telegramUsername',
      key: 'telegramUsername',
      render: (text) => <span className={"italic"}>{'@' + text}</span>
    },
    {
      title: 'Действия',
      dataIndex: 'telegramUsername',
      key: 'telegramUsername',
      render: (name: string) => (
        <Space size="large">
          <EditOutlined onClick={() => handleEditUser(name)} className={'text-[20px] text-blue-700'}/>
          <DeleteOutlined onClick={() => handleDeleteUser(name)} className={'text-[20px] text-red-700'}/>
        </Space>
      ),
    },
  ]

  const [users, setUsers] = useState();
  const [onAction, setOnAction] = useState(false);
  const [clickedBox, setClickedBox] = useState();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const [editUserForm] = Form.useForm();

  const {Search} = Input;
  const {confirm} = Modal;

  useEffect(() => {
    axios.get(apiUrl + "/users")
      .then(response => {
        console.log(response.data)
        setUsers(response.data)
      })
      .catch(error => console.log(error.message))
  }, [onAction]);

  const handleDeleteUser = (name: string) => {
    console.log(name);
    confirm({
      title: 'Вы уверены, что хотите удалить данного пользователя?',
      icon: <ExclamationCircleFilled/>,
      content: 'Удаленных пользователей невозможно восстановить',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Назад',
      onOk() {
        axios.delete(apiUrl + `/users/${name}`)
          .then(response => {
            console.log(response.data);
            setOnAction(!onAction);
          })
          .catch(error => {
            console.log(error)
          });
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
      centered: true
    });
  };

  function handleEditUser(name: string) {
    let clickedItem = users.filter(item => name === item.telegramUsername)[0];
    console.log("clicked item", clickedItem);
    setClickedBox(clickedItem);

    editUserForm.setFieldsValue(clickedItem);
    setIsEditModalOpen(true);
  }

  const onSearch = () => {

  };

  return (
    <>
      <div className={'w-full flex justify-between'}>
        <Button type="primary" icon={<PlusOutlined/>}>
          Добавить пользователя
        </Button>
        <div>
          <Search placeholder="input search text" allowClear onSearch={onSearch} enterButton/>
        </div>
      </div>
      <Table className={'w-full mt-5'} columns={columns} dataSource={users}/>
      <EditUserModal
        form={editUserForm}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        clickedBox={clickedBox}
        setOnAction={setOnAction}
      />
    </>
  );
};

export default Users;