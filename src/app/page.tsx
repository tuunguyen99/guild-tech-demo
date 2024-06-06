"use client";
import {
  CrownTwoTone,
  FireTwoTone,
  InfoCircleTwoTone,
  MinusCircleTwoTone,
  MoreOutlined,
  PictureFilled,
  TagTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import { ShardsTechCore } from "@mirailabs-co/shards-tech";
import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
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
import HandleForm from "./shards-tech/_Form";
import ShardsTabChat from "./shards-tech/_TabChat";
import LeaderBoards from "./components/LeaderBoards";

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
  const [buySlotPrice, setBuySlotPrice] = useState<any>(null);
  const [myJoinGuildRequest, setMyJoinGuildRequest] = useState<any>(null);
  const [isOwner, setIsOwner] = useState<any>(false);

  const [joinGuildRequestOfGuild, setJoinGuildRequestOfGuild] =
    useState<any>(null);
  const [openChangeOwnerModal, setOpenChangeOwnerModal] = useState<any>(null);
  const [openSellSlotModal, setOpenSellSlotModal] = useState<any>(null);
  const [openBuySlotPrice, setOpenBuySlotPrice] = useState<any>(null);
  const [mySellSlot, setMySellSlot] = useState<any>(null);

  const [price, setPrice] = useState<any>(null);
  const [updatePrice, setUpdatePrice] = useState<any>(null);

  const [newOwner, setNewOwner] = useState<any>(null);
  const [userOnlinesShards, setUserOnlinesShards] = useState<any>(null);

  const [transactionHistoryOfUser, setTransactionHistoryOfUser] =
    useState<any>(null);
  const [transactionHistoryOfGuild, setTransactionHistoryOfGuild] =
    useState<any>(null);
  const [guildsUserHaveShare, setGuildsUserHaveShare] = useState<any>(null);

  const [handleFormVisible, setHandleFormVisible] = useState(false);
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

    const transactionHistoryOfGuild =
      await shardsTechCore.getTransactionHistoryOfGuild({
        page: 1,
        limit: 10,
      });

    setTransactionHistoryOfGuild(transactionHistoryOfGuild?.data);

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

  const buyShardSlot = async () => {
    const response = await shardsTechCore.buySlot(
      buySlotPrice.guild.address,
      buySlotPrice.seller,
      buySlotPrice.price,
      buySlotPrice.guild.chain
    );
    await shardsTechCore.getGuildOfUser();
    setOpenBuySlotPrice(false);
  };

  const getSlotPrice = async (guildId: string) => {
    const response = await shardsTechCore.getBuySlotPrice(guildId);
    setBuySlotPrice(response);
    setOpenBuySlotPrice(true);
  };

  const cancelSellSlot = async (sellSlotId: string) => {
    const response = await shardsTechCore.cancelSellSlot(sellSlotId);
    await shardsTechCore.getGuildOfUser();
    const mySellSlot = await shardsTechCore.getMySellMemberSlot();
    setMySellSlot(mySellSlot);
  };

  const burnSlotShard = async (guildId: string) => {
    const response = await shardsTechCore.burnSlot(guildId);
    await shardsTechCore.getGuildOfUser();
  };

  const sellSlot = async (guildId: string, price: number) => {
    const response = await shardsTechCore.sellSlot(guildId, price);
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

  const changeOwner = async (newOwner: string) => {
    const response = await shardsTechCore.changeGuildOwner(
      shardsTechCore.userGuild.address,
      newOwner,
      shardsTechCore.userInfo.userId
    );
  };

  const usersColumns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string) => {
        return shortAddress(address);
      },
    },
    {
      title: "UserId",
      dataIndex: "userId",
      key: "userId",
      render: (uId: string) => {
        return uId.slice(0, 4) + "..." + uId.slice(-4);
      },
    },
    {
      title: "Shards Id",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => {
        return id.slice(0, 4) + "..." + id.slice(-4);
      },
    },
  ];

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
      children: shardsTechCore?.userGuild ? (
        <>
          <div className="px-4">
            <Space align="center" size={"middle"} className="mb-4">
              {shardsTechCore.userGuild.metadata?.avatar ? (
                <Avatar
                  src={shardsTechCore.userGuild.metadata?.avatar}
                  size={64}
                  shape="square"
                />
              ) : (
                <Avatar icon={<PictureFilled />} size={64} shape="square" />
              )}
              <Space direction="vertical" style={{ gap: "0.25rem" }}>
                <Typography.Title className="my-0" level={4}>
                  {shardsTechCore.userGuild.name}
                </Typography.Title>
                <Space>
                  <Badge
                    count={`Lv: ${shardsTechCore.userGuild.metadata?.level}`}
                    color="#1677ff"
                  />
                  <Badge
                    count={`Rank: ${shardsTechCore.userGuild.metadata?.rank}`}
                    color="#52c41a"
                  />
                </Space>
              </Space>
            </Space>
            <Typography.Paragraph type="secondary">
              {shardsTechCore.userGuild.metadata?.description ? (
                shardsTechCore.userGuild.metadata?.description
              ) : (
                <Typography.Text type="secondary">
                  Guild Descriptions...
                </Typography.Text>
              )}
            </Typography.Paragraph>
            <Descriptions
              className="mb-4"
              title="Earning Distribution"
              items={[
                { key: "1", label: "Guild Master", children: "20%" },
                { key: "2", label: "Seat Owners", children: "60%" },
                { key: "3", label: "Fraction Owners", children: "20%" },
              ]}
            ></Descriptions>
          </div>
          <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ right: 24 }}
            icon={<MoreOutlined />}
          >
            <FloatButton
              tooltip={<div>Burn Slot</div>}
              icon={<FireTwoTone twoToneColor={"#FF9900"} />}
              onClick={() => burnSlotShard(shardsTechCore.userGuild._id)}
            />
            <FloatButton
              tooltip={<div>Sell Slot</div>}
              icon={<TagTwoTone twoToneColor={"#f81d22"} />}
              onClick={() => setOpenSellSlotModal(true)}
            />
            <FloatButton
              tooltip={<div>Change Owner</div>}
              icon={<CrownTwoTone />}
              onClick={() => setOpenChangeOwnerModal(true)}
            />
          </FloatButton.Group>
          <Tabs
            defaultActiveKey="1"
            type="card"
            items={[
              {
                key: "1",
                label: "Members",
                children: shardsTechCore.userGuild?.users && (
                  <Table
                    columns={usersColumns}
                    dataSource={shardsTechCore.userGuild?.users || []}
                    rowKey={(record) => record._id}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    className="mb-4"
                  />
                ),
              },
              {
                key: "2",
                label: "Activity",
                children: transactionHistoryOfGuild && (
                  <Space size={"large"} direction="vertical" className="mt-4">
                    {transactionHistoryOfGuild?.map((item: any, i: number) => (
                      <Space
                        size={"middle"}
                        key={i}
                        className="px-4"
                        align="start"
                      >
                        <Avatar size={40} icon={<UserOutlined />} />
                        <Space direction="vertical" style={{ gap: "0" }}>
                          <Typography.Text className="fw-semibold">
                            {`${item?.user?.address.slice(
                              0,
                              6
                            )}...${item?.user?.address.slice(-4)}`}{" "}
                            {item.type === "buy_slot" ||
                            item.type === "buy_share" ? (
                              <Typography.Text type="success">
                                Buy
                              </Typography.Text>
                            ) : item.type === "sell_slot" ||
                              item.type === "sell_share" ? (
                              <Typography.Text type="danger">
                                Sell
                              </Typography.Text>
                            ) : item.type === "burn_slot" ? (
                              <Typography.Text type="warning">
                                Burn
                              </Typography.Text>
                            ) : item.type === "cancel_sell_slot" ? (
                              "Cancel selling"
                            ) : (
                              ""
                            )}{" "}
                            {item.type == "buy_share" ||
                            item.type == "sell_share"
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
                ),
              },
            ]}
          />
        </>
      ) : (
        <>
          <Empty description="" className="p-4">
            <Flex vertical align="center" className="text-center">
              <Typography.Title className="mt-0" level={4}>
                You haven&apos;t joined any guild.
              </Typography.Title>
              <Typography.Paragraph type="secondary">
                Create a new guild or buy a slot from a guild that already
                exists on the system.
              </Typography.Paragraph>
              <Button
                type="primary"
                onClick={() => setHandleFormVisible(true)}
                style={{ marginTop: 8 }}
              >
                Create New Guild
              </Button>
            </Flex>
          </Empty>
        </>
      ),
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
      <HandleForm
        openHandleForm={handleFormVisible}
        setOpenHandleForm={setHandleFormVisible}
        shardsTechCore={shardsTechCore}
      />
      <Modal
        title="Slot Info"
        open={openBuySlotPrice}
        onOk={() => buyShardSlot()}
        onCancel={() => setOpenBuySlotPrice(false)}
      >
        <Space direction="vertical" size="large" className="mt-4">
          <Space align="center" size={"middle"} className="mb-4">
            {buySlotPrice?.guild?.avatar ? (
              <Avatar
                src={buySlotPrice?.guild?.avatar}
                size={48}
                shape="square"
              />
            ) : (
              <Avatar size={48} shape="square" icon={<PictureFilled />} />
            )}
            <Space direction="vertical" style={{ gap: "0.25rem" }}>
              <Typography.Title className="my-0" level={4}>
                {buySlotPrice?.guild?.name}
              </Typography.Title>
              <Space>
                <Badge
                  count={`Lv: ${buySlotPrice?.guild?.level}`}
                  color="#1677ff"
                />
                <Badge
                  count={`Rank: ${buySlotPrice?.guild?.rank}`}
                  color="#52c41a"
                />
              </Space>
            </Space>
          </Space>
          <Space size={"small"} direction="vertical">
            <Typography.Text type="secondary">Seller</Typography.Text>
            <Typography.Text className="fw-semibold">
              {shortAddress(buySlotPrice?.seller)}
            </Typography.Text>
          </Space>
          <Space size={"small"} direction="vertical">
            <Typography.Text type="secondary">Price</Typography.Text>
            <Typography.Text className="fw-semibold">
              {buySlotPrice?.price} ETH
            </Typography.Text>
          </Space>
        </Space>
      </Modal>
      <Modal
        title="Change Owner"
        open={openChangeOwnerModal}
        onOk={() => changeOwner(newOwner)}
        onCancel={() => setOpenChangeOwnerModal(false)}
      >
        <Form layout="vertical" autoComplete="off">
          <Form.Item name="name" label="User ID">
            <Input
              size="large"
              placeholder="enter user id"
              onChange={(e) => setNewOwner(e.target.value)}
              value={newOwner}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sell Slot"
        open={openSellSlotModal}
        onOk={() => sellSlot(shardsTechCore.userGuild._id, price)}
        onCancel={() => setOpenSellSlotModal(false)}
      >
        <Form layout="vertical" autoComplete="off">
          <Form.Item name="sellprice" label="Set price:">
            <InputNumber
              suffix="ETH"
              onChange={(value) => setPrice(value)}
              value={price}
              style={{ width: "100%" }}
              placeholder="0"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
