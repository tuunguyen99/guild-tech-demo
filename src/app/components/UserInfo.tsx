import { Button, Dropdown, MenuProps, Typography } from "antd";
import { shortAddress } from "../app-utils";
import { UserOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const UserInfo = ({ shardsTechCore }: { shardsTechCore: any }) => {
  const items: MenuProps["items"] = [
    {
      key: "address",
      label: (
        <Paragraph copyable style={{ margin: 0 }}>
          {shortAddress(shardsTechCore?.userInfo?.address)}
        </Paragraph>
      ),
    },
    {
      key: "userId",
      label: (
        <Paragraph copyable style={{ margin: 0 }}>
          {shardsTechCore?.userInfo?.userId}
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
