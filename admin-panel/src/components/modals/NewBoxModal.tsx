import React, {FC} from 'react';
import {Flex, Form, Input, InputNumber, Modal, Switch} from "antd";
import axios from "axios";
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

        $api.post(`/boxes`, {...values, width: 1, length: 1, type: "STREET", isActive: true})
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
          label="Название бокса"
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
          name='address'
          label="Адрес"
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
          name='sleepTimeMinutes'
          label="Время для сна в минутах"
          rules={[
            {
              required: true,
              message: 'Это обязательное поле!',
            },
          ]}
        >
          <InputNumber/>
        </Form.Item>
        <Flex>
          <Form.Item
            name='height'
            label="Допустимая высота"
            rules={[
              {
                required: true,
                message: 'Это обязательное поле!',
              },
            ]}
          >
            <InputNumber/>
          </Form.Item>
          <Form.Item
            name='sensorHeight'
            label="Высота сенсора"
            rules={[
              {
                required: true,
                message: 'Это обязательное поле!',
              },
            ]}
          >
            <InputNumber/>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default NewBoxModal;