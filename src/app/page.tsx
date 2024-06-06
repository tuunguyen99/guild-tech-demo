"use client";
import { PictureFilled } from "@ant-design/icons";
import { ShardsTechCore } from "@mirailabs-co/shards-tech";
import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useSessionStorageState from "use-session-storage-state";
import ShardsTabChat from "./shards-tech/_TabChat";
import LeaderBoards from "./components/LeaderBoards";
import MyGuild from "./components/MyGuild";

export default function Home() {
  const shortAddress = (address: string) => {
    if (typeof address !== "string" || address.length < 10) {
      return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const [deviceId, setDeviceId] = useState<any>("");

  const [shardsTechCore, setShardsTechCore] = useState<any | null>(null);

  const [myShards, setMyShards] = useState<any>(null);
  const [myJoinGuildRequest, setMyJoinGuildRequest] = useState<any>(null);
  const [isOwner, setIsOwner] = useState<any>(false);

  const [joinGuildRequestOfGuild, setJoinGuildRequestOfGuild] =
    useState<any>(null);
  const [mySellSlot, setMySellSlot] = useState<any>(null);

  const [updatePrice, setUpdatePrice] = useState<any>(null);

  const [userOnlinesShards, setUserOnlinesShards] = useState<any>(null);

  const [transactionHistoryOfUser, setTransactionHistoryOfUser] =
    useState<any>(null);
  const [guildsUserHaveShare, setGuildsUserHaveShare] = useState<any>(null);

  const initShardsTechCore = async () => {
    const shardsTech = await ShardsTechCore.init({
      clientId: "7421609e-545a-4256-99da-12f3308713b0",
      // env: "production",
    });
    setShardsTechCore(shardsTech);
  };

  useEffect(() => {
    initShardsTechCore();
  }, []);

  const connectShardsTech = async () => {
    const [core, shardsTechConnection] = await shardsTechCore.connect({
      accessToken,
    });
    const data = await shardsTechCore.getMyFractions();
    setMyShards(data);

    const mySellSlot = await shardsTechCore.getMySellMemberSlot();
    setMySellSlot(mySellSlot);

    const userOnlines = await shardsTechCore.getUserOnlineInGuild();
    setUserOnlinesShards(userOnlines);

    const transactionHistoryOfUser =
      await shardsTechCore.getTransactionHistoryOfUser({
        page: 1,
        limit: 10,
      });

    setTransactionHistoryOfUser(transactionHistoryOfUser?.data);

    const guildsUserHaveShare = await shardsTechCore.getMyFractions();

    setGuildsUserHaveShare(guildsUserHaveShare);

    const myJoinGuildRequest = await shardsTechCore.getJoinGuildOfUser();
    setMyJoinGuildRequest(myJoinGuildRequest);

    const joinGuildRequestOfGuild = shardsTechCore?.userGuild?._id
      ? await shardsTechCore.getJoinGuildRequest(shardsTechCore.userGuild._id)
      : [];
    console.log("joinGuildRequestOfGuild", joinGuildRequestOfGuild);
    setJoinGuildRequestOfGuild(joinGuildRequestOfGuild);

    console.log("shardsTechCore?.userGuild", shardsTechCore?.userGuild);
    console.log("shardsTechCore?.userInfo", shardsTechCore?.userInfo);
    const isOwner =
      shardsTechCore?.userGuild?.owner?._id === shardsTechCore?.userInfo?._id;
    setIsOwner(isOwner);
  };
  const [accessToken, setAccessToken] = useSessionStorageState<any>(
    "accessToken",
    {
      defaultValue: process.env.NEXT_PUBLIC_GUILD_TECH_ACCESS_TOKEN,
    }
  );

  const createJoinGuildRequest = async (guildId: string) => {
    const response = await shardsTechCore.createJoinGuildRequest(guildId);
    const myJoinGuildRequest = await shardsTechCore.getJoinGuildOfUser();
    setMyJoinGuildRequest(myJoinGuildRequest);
  };

  const updatePriceSellSlot = async (sellSlotId: string, price: number) => {
    const response = await shardsTechCore.updateSellSlot(sellSlotId, price);
    await shardsTechCore.getGuildOfUser();
    const mySellSlot = await shardsTechCore.getMySellMemberSlot();
    setMySellSlot(mySellSlot);
    setUpdatePrice(null);
  };

  const userHaveShareColumns = [
    {
      title: "Guild",
      dataIndex: "guild",
      key: "guild",
      render: (guild: any) => {
        return guild?.name;
      },
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Actions",
      dataIndex: "guild",
      key: "action",
      render: (guild: any) => {
        return (
          <Space>
            <Button onClick={() => buyFraction(guild.address, 1, guild.chain)}>
              Buy Fraction
            </Button>
            <Button onClick={() => sellFraction(guild.address, 1, guild.chain)}>
              Sell Fraction
            </Button>
          </Space>
        );
      },
    },
  ];

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
        const isPending = status === "pending";
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

  useEffect(() => {
    if (shardsTechCore) {
      connectShardsTech();
    }
  }, [shardsTechCore]);

  const cancelSellSlot = async (sellSlotId: string) => {
    const response = await shardsTechCore.cancelSellSlot(sellSlotId);
    await shardsTechCore.getGuildOfUser();
    const mySellSlot = await shardsTechCore.getMySellMemberSlot();
    setMySellSlot(mySellSlot);
  };

  const buyFraction = async (
    guildAddress: string,
    amount: number,
    chain?: string
  ) => {
    const response = await shardsTechCore.buyFraction(
      guildAddress,
      amount,
      chain
    );
  };

  const sellFraction = async (
    guildAddress: string,
    amount: number,
    chain?: string
  ) => {
    const response = await shardsTechCore.sellFraction(
      guildAddress,
      amount,
      chain
    );
  };

  const userHistoryColumns = [
    {
      title: "Guild",
      dataIndex: "guild",
      key: "guild",
      render: (guild: any) => {
        return guild.name;
      },
    },
    {
      title: "Action",
      render: (amount: any, record: any) => {
        console.log("record", record);
        return (
          <div>
            {record.type} {record.amount}
          </div>
        );
      },
    },
    {
      title: "Volume",
      dataIndex: "price",
      key: "price",
      render: (price: number) => {
        return price + "ETH";
      },
    },
  ];

  const guildHistoryColumns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => {
        return user?.userId;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const shardItems = [
    {
      key: "1",
      label: "LeaderBoards",
      children: <LeaderBoards />,
    },
    {
      key: "2",
      label: "My Guild",
      children: <MyGuild />,
    },
    {
      key: "join-guild-request",
      label: "Join Guild Request",
      children: joinGuildRequestOfGuild && isOwner && (
        <div>
          <Table
            columns={joinGuildRequestColumns}
            dataSource={joinGuildRequestOfGuild || []}
            rowKey={(record) => record?._id}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "My Sell Slot",
      children: (
        <div className="px-4">
          <Descriptions
            title="Slot"
            items={[
              {
                label: "Guild",
                children: mySellSlot?.guild?.name,
              },
              {
                label: "seller",
                children: mySellSlot?.seller,
              },
              {
                label: "price",
                children: mySellSlot?.price,
              },
            ]}
          />
          <div className="mb-4">
            <Space.Compact style={{ width: "100%" }}>
              <InputNumber
                onChange={(value) => setUpdatePrice(value)}
                value={updatePrice}
                style={{ flexGrow: 1 }}
              />
              <Button
                type="primary"
                onClick={() => updatePriceSellSlot(mySellSlot._id, updatePrice)}
              >
                Update Price
              </Button>
            </Space.Compact>
          </div>
          <Button onClick={() => cancelSellSlot(mySellSlot._id)} danger block>
            Cancel Sell Slot
          </Button>
        </div>
      ),
    },
    {
      key: "user-history",
      label: "My History",
      children: transactionHistoryOfUser && (
        <div>
          <Typography.Title level={5} className="mt-0 mb-4 px-4">
            {transactionHistoryOfUser?.length} Activities
          </Typography.Title>
          {/* <Table
                        columns={userHistoryColumns}
                        dataSource={transactionHistoryOfUser || []}
                        rowKey={(record) => record._id}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    /> */}
          {transactionHistoryOfUser && (
            <Space size={"large"} direction="vertical">
              {transactionHistoryOfUser?.map((item: any, i: number) => (
                <Space size={"middle"} key={i} className="px-4" align="start">
                  <Avatar size={40} shape="square" icon={<PictureFilled />} />
                  <Space direction="vertical" style={{ gap: "0" }}>
                    <Typography.Text className="fw-semibold">
                      You{" "}
                      {item.type === "buy_slot" || item.type === "buy_share" ? (
                        <Typography.Text type="success">Buy</Typography.Text>
                      ) : item.type === "sell_slot" ||
                        item.type === "sell_share" ? (
                        <Typography.Text type="danger">Sell</Typography.Text>
                      ) : item.type === "burn_slot" ? (
                        <Typography.Text type="warning">Burn</Typography.Text>
                      ) : item.type === "cancel_sell_slot" ? (
                        "Cancel selling"
                      ) : (
                        ""
                      )}{" "}
                      {item.type == "buy_share" || item.type == "sell_share"
                        ? item.amount + " Fractions"
                        : "a Slot"}{" "}
                      of guild {item?.guild.name} by {item.price} ETH
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: "11px" }}
                    >
                      {item.createdAt}
                    </Typography.Text>
                  </Space>
                </Space>
              ))}
            </Space>
          )}
        </div>
      ),
    },
    {
      key: "4",
      label: "Chats",
      children: (
        <div className="px-4">
          <Typography.Title level={5} className="my-0">
            {userOnlinesShards?.length} user online
          </Typography.Title>
          <ShardsTabChat shardsTechCore={shardsTechCore} />
        </div>
      ),
    },
  ];

  const submitDeviceId = async () => {
    const endpoint = "http://103.109.37.199:3000/auth/loginGuest";
    const data = {
      deviceId: deviceId,
    };
    const response = await axios.post(endpoint, data);
    setAccessToken(response.data.accessToken);
    // reload page
    window.location.reload();
  };

  return (
    <main>
      {/* <Space.Compact>
            <Input placeholder="deviceId" value={deviceId} onChange={(value) => setDeviceId(value?.target.value)} />
            <Button type="primary" onClick={() => submitDeviceId()}>
                Login Another Account
            </Button>
        </Space.Compact> */}
      {/* <Button type="primary" onClick={() => setHandleFormVisible(true)} style={{ marginBottom: 20 }}>
            Add New Guild
        </Button> */}
      {/* <Tabs defaultActiveKey="1" items={items} /> */}
      <Tabs defaultActiveKey="1" items={shardItems} />
    </main>
  );
}
