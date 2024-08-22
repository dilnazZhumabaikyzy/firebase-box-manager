import React, {FC} from 'react';
import {Form, Input, Modal, Select} from "antd";
import $api from "@/http";


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

const EditUserModal: FC<{
  form: any,
  isEditModalOpen: boolean,
  setIsEditModalOpen: any,
  clickedBox: any,
  setOnAction: any
}> = ({form, isEditModalOpen, setIsEditModalOpen, clickedBox, setOnAction}) => {


  function handleEditOk() {
    form.validateFields()
      .then((values: any) => {
        console.log(values);
        $api.patch(apiUrl + `/users/${clickedBox.phoneNumber}`, values)
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

export default EditUserModal;