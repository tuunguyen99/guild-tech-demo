import { Button, Form, Input, Modal, Row, Select, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { UpdateGuildType } from "../app-constants/type";
import { calcGuildConfig } from "../app-utils";

interface FormUpdateGuildProps {
  openHandleForm: boolean;
  setOpenHandleForm: (visible: boolean) => void;
  shardsTechCore: any;
  data?: UpdateGuildType;
}

const FormUpdateGuild = ({
  openHandleForm,
  setOpenHandleForm,
  shardsTechCore,
  data,
}: FormUpdateGuildProps) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // const [loading, setLoading] = useState<boolean>(false)

  const onClose = () => {
    form.resetFields();
    setOpenHandleForm(false);
  };

  const isCanUpdate = useMemo(() => {
    let canUpdateFields: { [key: string]: boolean } = {
      name: false,
      slotPrice: false,
      earningDistribution: false,
    };

    const allowUpdateFields: string[] =
      shardsTechCore?.gameConfig?.allowUpdateFields || [];

    const guildConfig = shardsTechCore?.userGuild;
    const now: number = Date.now() / 1000;
    const timeFrameUpdates: boolean =
      now <= guildConfig?.endAllowUpdateTimestamp &&
      now >= guildConfig?.startAllowUpdateTimestamp;

    //within time frame update and remaining update count
    if (timeFrameUpdates && guildConfig?.numberAllowUpdate > 0) {
      return (canUpdateFields = {
        name: true,
        slotPrice: true,
        earningDistribution: true,
      });
    }

    //check field can update by game config
    if (allowUpdateFields && allowUpdateFields.length) {
      for (let field of allowUpdateFields) {
        canUpdateFields[`${field}`] = true;
      }
    }
    return canUpdateFields;
  }, [shardsTechCore?.userGuild]);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      const guildConfig = calcGuildConfig(
        Number(values.seatOwners / 100),
        Number(values.guildMaster / 100)
      );

      const data = {
        name: values.guildName,
        slotPrice: Number(values.slotPrice),
        rewardShareForMembers: guildConfig.rewardShareForMember,
        guildOwnerShare: guildConfig.guildOwnerShare,
      };
      const res = await shardsTechCore.userUpdateGuild(
        shardsTechCore?.userGuild?._id,
        data
      );
      console.log(res);
      if (!res) {
        throw new Error("Update guild fail");
      }
      messageApi.open({
        content: "Update guild success",
        type: "success",
        style: {
          color: "#52c41a",
        },
      });
      await shardsTechCore.getGuildOfUser();
      form.setFieldsValue(data);
      setOpenHandleForm(false);
      // onClose();
    } catch (error) {
      console.log(error);
      messageApi.open({
        content: "Update guild fail",
        type: "error",
        style: {
          color: "#FF4D4F",
        },
      });
    }
  };

  const handleMyFieldChange = () => {
    const guildMaster = form.getFieldValue("guildMaster");
    const seatOwners = form.getFieldValue("seatOwners");
    form.setFieldsValue({
      fractionOwners: 100 - (guildMaster || 0) - (seatOwners || 0),
    });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelWrap
      labelAlign="left"
      initialValues={data}
    >
      {contextHolder}
      <Modal
        open={openHandleForm}
        onCancel={onClose}
        title={"Update Guild"}
        onOk={() => form.submit()}
        width={620}
      >
        {isCanUpdate.name ? (
          <Form.Item
            label="Guild Name"
            name="guildName"
            rules={[{ required: true, message: "Please input Guild Name!" }]}
          >
            <Input />
          </Form.Item>
        ) : null}

        {isCanUpdate.slotPrice ? (
          <Form.Item
            label="Slot Price"
            name="slotPrice"
            rules={[
              { required: true, message: "Please input Slot Price!" },
              {
                pattern: /[+-]?([0-9]*[.])?[0-9]+/,
                message: "Please input valid number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : null}

        {isCanUpdate.earningDistribution ? (
          <>
            <Form.Item
              label="Guild Master"
              name="guildMaster"
              rules={[
                {
                  required: true,
                  message: "Please input guild master!",
                },
                {
                  type: "number",
                  max: 100,
                  message: "Guild Master must be less than or equal to 100%",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
                {
                  type: "number",
                  min: 0,
                  message: "Guild Master must be greater than or equal to 0",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
              ]}
            >
              <Input
                type="Number"
                suffix={<div>%</div>}
                onChange={handleMyFieldChange}
              />
            </Form.Item>
            <Form.Item
              label="Seat Owners"
              name="seatOwners"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
                {
                  type: "number",
                  max: 100,
                  message: "Seat Owners must be less than or equal to 100%",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
                {
                  type: "number",
                  min: 0,
                  message: "Seat Owners must be greater than or equal to 0",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
              ]}
            >
              <Input
                type="Number"
                suffix={<div>%</div>}
                onChange={handleMyFieldChange}
              />
            </Form.Item>
            <Form.Item
              name="fractionOwners"
              label="Fraction Owners"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
                {
                  type: "number",
                  max: 100,
                  message: "Fraction Owners must be less than or equal to 100%",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
                {
                  type: "number",
                  min: 0,
                  message: "Fraction Owners must be greater than or equal to 0",
                  transform: (value) => Number(value), // Ensure the value is transformed to a number
                },
              ]}
            >
              <Input type="Number" disabled suffix={<div>%</div>} />
            </Form.Item>
          </>
        ) : null}
      </Modal>
    </Form>
  );
};

export default FormUpdateGuild;
