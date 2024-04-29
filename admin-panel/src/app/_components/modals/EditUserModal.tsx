import React from 'react';
import {Flex, Form, Input, InputNumber, Modal, Select} from "antd";
import axios from "axios";


const validateMessages = {
  required: '${label} обязательно!',
  types: {
    number: 'Некорректная цена!',
  },
  number: {
    range: '${label} не должна быть меньше 0',
  },
};

const apiUrl = "https://us-central1-teplotest-d9137.cloudfunctions.net/app";

const EditBoxModal = ({form, isEditModalOpen, setIsEditModalOpen, clickedBox, setOnAction}) => {


  function handleEditOk() {
    form.validateFields()
      .then((values) => {
        console.log(values);
        axios.patch(apiUrl + `/users/${clickedBox.telegramUsername}`, values)
          .then(response => {
            setIsEditModalOpen(false);
            setOnAction(true);
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
  }

  return (
    <Modal title="Редактирование бокса" open={isEditModalOpen} onOk={handleEditOk} onCancel={() => setIsEditModalOpen(false)}>
      <Form
        className={"pt-4"}
        layout="vertical"
        form={form}
        validateMessages={validateMessages}
      >
        <Form.Item
          name='name'
          label="Имя пользователя"
          rules={[
            {
              required: true,
              message: 'Это обязательное поле!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name='telegramUsername'
          label="Телеграм пользователя"
          rules={[
            {
              required: true,
              message: 'Это обязательное поле!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name='role'
          label="Роль"
          rules={[
            {
              required: true,
              message: 'Это обязательное поле!',
            },
          ]}
        >
          <Select>
            <Select.Option value="user">Пользователь</Select.Option>
            <Select.Option value="admin">Администратор</Select.Option>
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default EditBoxModal;