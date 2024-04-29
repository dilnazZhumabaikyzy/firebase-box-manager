"use client";

import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Progress, Space, Table, TableProps, Tag} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import EditBoxModal from "@/app/_components/modals/EditBoxModal";
import NewBoxModal from "@/app/_components/modals/NewBoxModal";


const apiUrl = "https://us-central1-teplotest-d9137.cloudfunctions.net/app";

interface DataType {
  name: string,
  address: string,
  id: number,
  battery: number,
  sleepTimeMinutes: number,
  fullness: number,
  networkSignal: string,
  isActive: boolean,
}

const Boxes = () => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className={"font-semibold"}>{text}</span>,
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => <span className={"semi-bold"}>{text}</span>,
    },
    {
      title: 'Заполненность',
      dataIndex: 'fullness',
      key: 'fullness',
      render: (fullness: number) => (
        fullness ? <Progress strokeColor={{
          '0%': '#65B741',
          '50%': '#F3B95F',
          '100%': '#D04848',
        }} percent={fullness}/> : "Пока нету данных"
      ),
    },
    {
      title: 'Состояние',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_, {isActive}) => {
        const color = isActive ? "green" : "volcano"
        return (
          <Tag color={color}>
            {isActive ? "Активный" : "Не активный"}
          </Tag>
        );
      }
    },
    {
      title: 'Батарея',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => battery ? <Progress percent={battery} steps={10} size="small" strokeColor={'#65B741'}/> : "Нету данных",
    },
    {
      title: 'Сигнал',
      dataIndex: 'networkSignal',
      key: 'networkSignal',
      render: (text: string) => text ? <span className={"semi-bold"}>{text}</span> : "--",
    },
    {
      title: 'Интервал сна',
      dataIndex: 'sleepTimeMinutes',
      key: 'sleepTimeMinutes',
      render: (text: string) => <span className={"semi-bold"}>{text ? text + " минут" : '--'}</span>,
    },
    {
      title: 'Действия',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Space size="large">
          <EditOutlined onClick={() => handleEditClick(id)} className={'text-[20px] text-blue-700'}/>
          <DeleteOutlined onClick={() => handleDeleteConfirm(id)} className={'text-[20px] text-red-700'}/>
        </Space>
      ),
    },
  ]

  const {confirm} = Modal;
  const {Search} = Input;

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [clickedBox, setClickedBox] = useState();
  const [onAction, setOnAction] = useState(false);

  useEffect(() => {
    let responseData = [];
    axios.get(apiUrl + "/boxes").then((response) => {
      responseData = response.data;
    }).catch((error) => {
      console.log(error);
    });

    axios.get(apiUrl + "/reports").then((response) => {
      let dataWithFullness = responseData.map((item, index) => ({...item, fullness: response.data[index]?.fullness}))
      setDataArray(dataWithFullness);
    }).catch((error) => {
      console.log(error);
    });
  }, [onAction]);

  const onSearch = () => {

  };

  const handleDeleteConfirm = (id: string) => {
    confirm({
      title: 'Вы уверены, что хотите удалить этот бокс?',
      icon: <ExclamationCircleFilled/>,
      content: 'Удаленные боксы невозможно восстановить',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Назад',
      onOk() {
        axios.delete(apiUrl + `/boxes/${id}`)
          .then(response => {
            console.log(response.data);
            setOnAction(!onAction);
            setIsEditModalOpen(false);
          })
          .catch(error => {
            console.log(error)
          });
        console.log('OK');
      },
      onCancel() {
        setIsEditModalOpen(false);
        console.log('Cancel');
      },
      centered: true
    });
  }

  function handleEditClick(id: string) {
    console.log(id)
    let clickedItem = dataArray.filter(item => id === item.id)[0];
    console.log("clicked item", clickedItem);
    setClickedBox(clickedItem);
    const defaultValues = {
      name: clickedItem.name,
      address: clickedItem.address,
      sleepTimeMinutes: clickedItem.sleepTimeMinutes,
      height: clickedItem.height,
      sensorHeight: clickedItem.sensorHeight,
    }

    editForm.setFieldsValue(defaultValues);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <div className={'w-full flex justify-between'}>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)} icon={<PlusOutlined/>}>
          Добавить бокс
        </Button>
        <div>
          <Search placeholder="input search text" allowClear onSearch={onSearch} enterButton/>
        </div>
      </div>
      <Table className={'w-full mt-5'} columns={columns} dataSource={dataArray}/>
      <EditBoxModal
        form={editForm}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        clickedBox={clickedBox}
        setOnAction={setOnAction}
      />
      <NewBoxModal
        form={addForm}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        clickedBox={clickedBox}
        setOnAction={setOnAction}/>
    </>
  );
};

export default Boxes;