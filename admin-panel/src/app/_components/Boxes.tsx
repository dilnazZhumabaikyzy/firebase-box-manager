import React from 'react';
import {Button, Input, Progress, Space, Table, TableProps, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";


interface DataType {
  address: string,
  id: number,
  battery: number,
  sleepInterval: number,
  fullness: number,
  connectionLevel: string,
  state: string,
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Адрес',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <span className={"semi-bold"}>{text}</span>,
  },
  {
    title: 'Заполненность',
    dataIndex: 'fullness',
    key: 'fullness',
    render: (fullness) => <Progress strokeColor={{
      '0%': '#65B741',
      '50%': '#F3B95F',
      '100%': '#D04848',
    }} percent={fullness}/>,
  },
  {
    title: 'Состояние',
    dataIndex: 'state',
    key: 'state',
    render: (_, {state}) => {
      const color = state === "active" ? "green" : "volcano"
      return (
        <Tag color={color} key={state}>
          {state.toUpperCase()}
        </Tag>
      );
    }
  },
  {
    title: 'Батарея',
    dataIndex: 'battery',
    key: 'battery',
    render: (battery) => <Progress percent={battery} steps={10} size="small" strokeColor={'#65B741'}/>,
  },
  {
    title: 'Сигнал',
    dataIndex: 'connectionLevel',
    key: 'connectionLevel',
    render: (text) => <span className={"semi-bold"}>{text}</span>,
  },
  {
    title: 'Интервал сна',
    dataIndex: 'sleepInterval',
    key: 'sleepInterval',
    render: (text) => <span className={"semi-bold"}>{text ? text + " минут" : ''}</span>,
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

const Boxes = () => {

  const dataArray: DataType[] = [
    {
      address: "1234 Main Street, Suite 100",
      id: 1,
      battery: 80,
      connectionLevel: "high",
      sleepInterval: 15,
      fullness: 75,
      state: "active"
    },
    {
      address: "5678 Elm Avenue, Apartment 2B",
      id: 2,
      battery: 60,
      connectionLevel: "medium",
      sleepInterval: 15,
      fullness: 75,
      state: "inactive"
    },
    {
      address: "91011 Oak Boulevard, Building A",
      id: 3,
      battery: 90,
      connectionLevel: "high",
      sleepInterval: 15,
      fullness: 75,
      state: "active"
    },
    {
      address: "121314 Pine Lane, Floor 3",
      id: 4,
      battery: 75,
      connectionLevel: "low",
      sleepInterval: 15,
      fullness: 75,
      state: "active"
    },
    {
      address: "151617 Maple Drive, Unit 20",
      id: 5,
      battery: 50,
      connectionLevel: "low",
      sleepInterval: 15,
      fullness: 75,
      state: "inactive"
    },
    {
      address: "181920 Cedar Road, Room 102",
      id: 6,
      battery: 95,
      connectionLevel: "high",
      sleepInterval: 15,
      fullness: 75,
      state: "active"
    }
  ];
  const {Search} = Input;
  const onSearch = () => {

  };

  return (
    <>
      <div className={'w-full flex justify-between'}>
        <Button type="primary" icon={<PlusOutlined />} >
          Добавить бокс
        </Button>
        <div>
          <Search placeholder="input search text" allowClear onSearch={onSearch} enterButton />
        </div>
      </div>
      <Table className={'w-full mt-5'} columns={columns} dataSource={dataArray}/>
    </>
  );
};

export default Boxes;