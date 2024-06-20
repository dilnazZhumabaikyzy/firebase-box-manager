"use client";

import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Space, Table, TableProps, Tag} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined} from "@ant-design/icons";
import EditUserModal from "@/components/modals/EditUserModal";
import NewUserModal from "@/components/modals/NewUserModal";
import $api from "@/http";


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
      render: (_, {role}) => {
        const color = role === "admin" ? "green" : "blue"
        return (
          <Tag color={color}>
            {role === "admin" ? "Администратор" : "Пользователь"}
          </Tag>
        );
      }
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => <span className={"semi-bold"}>{text ? "+7 " + text : "--"}</span>
    },
    {
      title: 'Телеграм',
      dataIndex: 'telegramUsername',
      key: 'telegramUsername',
      render: (text) => <span className={"italic"}>{'@' + text}</span>
    },
    {
      title: 'Действия',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phoneNumber: string) => (
        <Space size="large">
          <EditOutlined onClick={() => handleEditUser(phoneNumber)} className={'text-[20px] text-blue-700'}/>
          <DeleteOutlined onClick={() => handleDeleteUser(phoneNumber)} className={'text-[20px] text-red-700'}/>
        </Space>
      ),
    },
  ]

  const [users, setUsers] = useState();
  const [onAction, setOnAction] = useState(false);
  const [clickedBox, setClickedBox] = useState();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editUserForm] = Form.useForm();
  const [addUserForm] = Form.useForm();

  const {Search} = Input;
  const {confirm} = Modal;

  useEffect(() => {
    setLoading(true);
    $api.get( "/users")
      .then(response => {
        console.log(response.data)
        setLoading(false);
        setUsers(response.data)
      })
      .catch(error => {
        console.log(error.message)
        setLoading(false);
      })
  }, [onAction]);

  const handleDeleteUser = (phoneNumber: string) => {
    console.log(phoneNumber);
    confirm({
      title: 'Вы уверены, что хотите удалить данного пользователя?',
      icon: <ExclamationCircleFilled/>,
      content: 'Удаленных пользователей невозможно восстановить',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Назад',
      onOk() {
        $api.delete(apiUrl + `/users/${phoneNumber}`)
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

  function handleEditUser(phoneNumber: string) {
    console.log(phoneNumber, "name");
    let clickedItem = users.filter(item => phoneNumber === item.phoneNumber)[0];
    console.log("clicked item", clickedItem);
    clickedItem = clickedItem.telegramUsername ? clickedItem : {...clickedItem, telegramUsername: ""}
    setClickedBox(clickedItem);

    editUserForm.setFieldsValue(clickedItem);
    setIsEditModalOpen(true);
  }

  const onSearch = () => {

  };

  return (
    <>
      <div className={'w-full flex justify-between'}>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)} icon={<PlusOutlined/>}>
          Добавить пользователя
        </Button>
        <div>
          <Search placeholder="input search text" allowClear onSearch={onSearch} enterButton/>
        </div>
      </div>
      <Table className={'w-full mt-5'} columns={columns} dataSource={users} loading={loading}/>
      <EditUserModal
        form={editUserForm}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        clickedBox={clickedBox}
        setOnAction={setOnAction}
      />
      <NewUserModal
        form={addUserForm}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        clickedBox={clickedBox}
        setOnAction={setOnAction}/>
    </>
  );
};

export default Users;