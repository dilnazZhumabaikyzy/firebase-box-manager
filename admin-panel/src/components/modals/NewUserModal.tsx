import React, {FC} from 'react';
import {Flex, Form, Input, InputNumber, Modal, Select, SelectProps} from "antd";
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

const NewBoxModal: FC<{
  form: any,
  isAddModalOpen: boolean,
  setIsAddModalOpen: any,
  clickedBox: any,
  setOnAction: any
}> = ({form, isAddModalOpen, setIsAddModalOpen, clickedBox, setOnAction}) => {

  function handleEditOk() {
    form.validateFields()
      .then((values: any) => {
        console.log(values);

        axios.post(apiUrl + `/users/`, {...values})
          .then(response => {
            setIsAddModalOpen(false);
            setOnAction(true);
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
  }

  const options: SelectProps['options'] = [
    {value: "user", label: "Пользователь"},
    {value: "admin", label: "Администратор"}
  ];

  return (
    <Modal title="Редактирование бокса" open={isAddModalOpen} onOk={handleEditOk}
           onCancel={() => setIsAddModalOpen(false)}>
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
          label="Имя пользователя в телеграме"
          rules={[
            {
              required: true,
              message: 'Это обязательное поле!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Flex>
          <Form.Item
            name='phoneNumber'
            label="Номер телефона"
            rules={[]}
          >
            <InputNumber addonBefore={"+7"} maxLength={10}/>
          </Form.Item>
          <Form.Item name="role" label="Роль" className={"ml-4"}>
            <Select
              defaultValue="role"
              style={{width: 120}}
              options={options}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default NewBoxModal;