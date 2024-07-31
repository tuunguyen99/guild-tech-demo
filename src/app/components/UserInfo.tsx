import { Button, Dropdown, MenuProps, Typography } from "antd";
import { shortAddress } from "../app-utils";
import { UserOutlined } from "@ant-design/icons";
const crypto = require("crypto");

const { Paragraph } = Typography;

const UserInfo = ({ shardsTechCore }: { shardsTechCore: any }) => {
  const encrypt = (userId: string) => {
    const randomString = userId || "";
    const encryptKey = "VlbEROErE26MHoKdKEMgM2kgeWobvNjr";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptKey),
      iv
    );
    let encrypted = cipher.update(randomString);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  };

  const items: MenuProps["items"] = [
    {
      key: "address",
      label: (
        <Paragraph
          copyable={{ text: shardsTechCore?.userInfo?.address }}
          style={{ margin: 0 }}
          ellipsis
        >
          Address:{" "}
          <span style={{ fontWeight: 600 }}>
            {shortAddress(shardsTechCore?.userInfo?.address) || "--"}
          </span>
        </Paragraph>
      ),
    },
    {
      key: "userId",
      label: (
        <Paragraph
          style={{ margin: 0 }}
          copyable={{ text: shardsTechCore?.userInfo?.userId }}
        >
          User ID:{" "}
          <span style={{ fontWeight: 600 }}>
            {shortAddress(shardsTechCore?.userInfo?.userId) || "--"}
          </span>
        </Paragraph>
      ),
    },
    {
      key: "shardsId",
      label: (
        <Paragraph
          style={{ margin: 0 }}
          copyable={{ text: shardsTechCore?.userInfo?._id }}
        >
          Shards ID:{" "}
          <span style={{ fontWeight: 600 }}>
            {shortAddress(shardsTechCore?.userInfo?._id) || "--"}
          </span>
        </Paragraph>
      ),
    },
    {
      key: "encrypt",
      label: (
        <Paragraph
          style={{ margin: 0 }}
          copyable={{ text: encrypt(shardsTechCore?.userInfo?.userId) }}
        >
          Encrypt:{" "}
          <span style={{ fontWeight: 600 }}>
            {shortAddress(encrypt(shardsTechCore?.userInfo?.userId)) || "--"}
          </span>
        </Paragraph>
      ),
    },
  ];

  if (!shardsTechCore) {
    return null;
  }

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
      <Button
        icon={<UserOutlined />}
        iconPosition="end"
        style={{ marginLeft: "16px" }}
      >
        User Info
      </Button>
    </Dropdown>
  );
};

export default UserInfo;
