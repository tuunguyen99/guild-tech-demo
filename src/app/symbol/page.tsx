'use client';
import { faker } from '@faker-js/faker';
/** @jsxImportSource @emotion/react */
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  Space,
  theme as Theme
} from 'antd';
import { useEffect, useState } from 'react';

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  remember?: boolean;
};
interface IFormValue {
  symbol?: string;
  slippage?: string;
  time?: number;
  block?: boolean;
}
const initialValues: IFormValue[] = Array.from(new Array(100)).map(() => ({
  symbol: faker.finance.currencyCode(),
  slippage: faker.lorem.text(),
  time: faker.helpers.rangeToNumber({ min: 1, max: 60 }),
  block: faker.datatype.boolean()
}));

const Register = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const handleClearAllField = () => {
    const formValueClear = Array.from(new Array(100)).map(() => ({
      symbol: faker.finance.currencyCode(),
      slippage: faker.lorem.text(),
      time: faker.helpers.rangeToNumber({ min: 1, max: 60 }),
      block: faker.datatype.boolean()
    }));
    form.setFieldsValue({ symbolForm: formValueClear });
  };

  return (
    <Form
      name='array form'
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete='off'
      form={form}
    >
      <Form.List name='symbolForm' initialValue={initialValues}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align='baseline'
              >
                <Form.Item
                  {...restField}
                  name={[name, 'symbol']}
                  rules={[{ required: true, message: 'Missing Symbol' }]}
                >
                  <Input placeholder='Symbol' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'slippage']}
                  rules={[{ required: true, message: 'Missing Slippage' }]}
                >
                  <Input placeholder='Slippage' />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'time']}>
                  <Input placeholder='Time' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'block']}
                  valuePropName='checked'
                >
                  <Checkbox>block</Checkbox>
                </Form.Item>
                <span onClick={() => remove(name)}>Delete</span>
              </Space>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block>
                Add field
              </Button>
              <Button type='dashed' onClick={() => handleClearAllField()} block>
                Add new data
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type='primary' htmlType='submit' style={{ maxWidth: 100 }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
