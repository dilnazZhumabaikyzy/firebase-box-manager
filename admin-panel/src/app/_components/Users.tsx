import React from 'react';
import {Button, Input, Space, Table, TableProps} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";


interface DataType {
  id: number,
  name: string,
  role: string,
  telegramUsername: string,
  phoneNumber: number,
}

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
    render: (text) => <span className={"semi-bold"}>{text}</span>
  },
  {
    title: 'Телеграм',
    dataIndex: 'telegramUsername',
    key: 'telegramUsername',
    render: (text) => <span className={"semi-bold"}>{text}</span>
  },
  {
    title: 'Действия',
    dataIndex: 'action',
    key: 'action',
    render: () => (
      <Space size="large">
        <EditOutlined className={'text-[20px] text-blue-700'}/>
        <DeleteOutlined className={'text-[20px] text-red-700'}/>
      </Space>
    ),
  },
]


const Users = () => {

  const users = [
    {
      id: 1,
      name: "John Doe",
      role: "Admin",
      telegramUsername: "@johndoe",
      phoneNumber: 1234567890,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "User",
      telegramUsername: "@janesmith",
      phoneNumber: 9876543210,
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "User",
      telegramUsername: "@alicej",
      phoneNumber: 5551234567,
    },
    {
      id: 4,
      name: "Bob Brown",
      role: "User",
      telegramUsername: "@bobb",
      phoneNumber: 9998887777,
    },
    {
      id: 5,
      name: "Eve White",
      role: "User",
      telegramUsername: "@evewhite",
      phoneNumber: 1112223333,
    },
    {
      id: 6,
      name: "Charlie Green",
      role: "User",
      telegramUsername: "@charlieg",
      phoneNumber: 4445556666,
    },
    {
      id: 7,
      name: "David Black",
      role: "User",
      telegramUsername: "@davidb",
      phoneNumber: 7776665555,
    },
    {
      id: 8,
      name: "Grace Red",
      role: "User",
      telegramUsername: "@gracer",
      phoneNumber: 2223334444,
    },
    {
      id: 9,
      name: "Frank Orange",
      role: "User",
      telegramUsername: "@franko",
      phoneNumber: 8889990000,
    },
    {
      id: 10,
      name: "Hannah Purple",
      role: "User",
      telegramUsername: "@hannahp",
      phoneNumber: 6667778888,
    }
  ];
  const {Search} = Input;
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
    </>
  );
};

export default Users;