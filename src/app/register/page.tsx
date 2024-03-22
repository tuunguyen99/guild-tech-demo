"use client";
/** @jsxImportSource @emotion/react */
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  Layout,
  theme as Theme,
} from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { Content } from "next/font/google";
import { useEffect } from "react";

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  remember?: boolean;
};

const Register = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const userName = Form.useWatch("username", form);
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    console.log(form.getFieldError("username"));
  };
  useEffect(() => {
    console.log(userName);
  }, [userName]);

  const { token } = Theme.useToken();
  const { colorBgContainer } = token;
  const handleSetData = () => {
    form.setFieldsValue({
      username: "admin",
      password: "123456",
    });
    form.setFieldValue("confirmPassword", "123456");
  };
  return (
    <>
      <Card style={{ width: "max-content" }}>card</Card>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, backgroundColor: colorBgContainer }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        autoComplete="on"
      >
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          shouldUpdate
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please input your confirm password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
          validateDebounce={500}
          shouldUpdate
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item shouldUpdate wrapperCol={{ offset: 8, span: 16 }}>
          {({ isFieldsTouched, getFieldsError }) => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !isFieldsTouched(true) ||
                getFieldsError().filter(({ errors }) => errors.length).length >
                  0
              }
            >
              Register in
            </Button>
          )}
        </Form.Item>
      </Form>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
      <Button onClick={() => form.resetFields()}>reset fields</Button>
      <Button onClick={handleSetData}>set fields</Button>
    </>
  );
};

export default Register;
