import { Button, Empty, Space, Table, Tabs } from "antd";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../context";

const JoinGuildRequest = () => {
  const { shardsTechCore } = useContext(HomeContext);

  const [joinGuildRequestOfGuild, setJoinGuildRequestOfGuild] =
    useState<any[]>();
  const [listInvitation, setListInvitation] = useState<any[]>([]);

  const getListResquest = async () => {
    try {
      if (!shardsTechCore?.userGuild) {
        const res = await shardsTechCore?.getJoinGuildOfUser();
        setListInvitation(
          res?.filter((item: any) => item?.metadata?.type === "invite")
        );
        setJoinGuildRequestOfGuild(
          res?.filter((item: any) => item?.metadata?.type !== "invite")
        );
      } else {
        const joinGuildRequestOfGuild = shardsTechCore?.userGuild?._id
          ? await shardsTechCore.getJoinGuildRequest(
              shardsTechCore.userGuild._id
            )
          : [];
        setJoinGuildRequestOfGuild(joinGuildRequestOfGuild);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (shardsTechCore) {
      getListResquest();
    }
  }, [shardsTechCore]);

  const joinGuildRequestColumns = [
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      //   render: (user: any) => {
      //     return user && user.userId;
      //   },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      dataIndex: "status",
      key: "action",
      render: (status: any, record: any) => {
        const isAccepted = status === "accepted";
        const isRejected = status === "rejected";

        if (
          !shardsTechCore?.userGuild ||
          shardsTechCore?.userGuild?.owner?._id !==
            shardsTechCore?.userInfo?._id
        ) {
          return null;
        }
        if (isAccepted) {
          return <Button disabled>Accepted</Button>;
        }
        if (isRejected) {
          return <Button disabled>Rejected</Button>;
        }
        return (
          <Space>
            <Button
              onClick={() =>
                shardsTechCore.acceptJoinGuildRequest(
                  record.userId,
                  record.guild
                )
              }
            >
              Accept
            </Button>
            <Button
              onClick={() =>
                shardsTechCore.rejectJoinGuildRequest(
                  record.userId,
                  record.guild
                )
              }
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

  const listInvitationColumns = [
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      //   render: (user: any) => {
      //     return user && user.userId;
      //   },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  if (
    shardsTechCore?.userGuild &&
    shardsTechCore.userGuild?.owner?._id === shardsTechCore?.userInfo?._id
  ) {
    if (!joinGuildRequestOfGuild?.length) {
      return <Empty />;
    }
    return (
      <Table
        columns={joinGuildRequestColumns}
        dataSource={joinGuildRequestOfGuild || []}
        rowKey={(record) => record?._id}
        pagination={false}
      />
    );
  }

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      items={[
        {
          key: "1",
          label: "Request",
          children: joinGuildRequestOfGuild?.length ? (
            <Table
              columns={joinGuildRequestColumns}
              dataSource={joinGuildRequestOfGuild || []}
              rowKey={(record) => record?._id}
              pagination={false}
            />
          ) : (
            <Empty />
          ),
        },
        {
          key: "2",
          label: "Invited",
          children: listInvitation?.length ? (
            <Table
              columns={listInvitationColumns}
              dataSource={listInvitation || []}
              rowKey={(record) => record?._id}
              pagination={false}
            />
          ) : (
            <Empty />
          ),
        },
      ]}
    />
  );
};

export default JoinGuildRequest;
