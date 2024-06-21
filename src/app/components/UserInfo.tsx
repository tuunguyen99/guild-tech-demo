import { Button, Dropdown, MenuProps, Typography } from "antd";
import { shortAddress } from "../app-utils";
import { UserOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const UserInfo = ({ shardsTechCore }: { shardsTechCore: any }) => {
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
