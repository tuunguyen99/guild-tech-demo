"use client";
import { Button, Space, Tabs, Typography } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import useSessionStorageState from "use-session-storage-state";
import ShardsTabChat from "./shards-tech/_TabChat";
import LeaderBoards from "./components/LeaderBoards";
import MyGuild from "./components/MyGuild";
import JoinGuildRequest from "./components/JoinGuildRequest";
import MySellSlot from "./components/MySellSlot";
import MyHistory from "./components/MyHistory";
import { HomeContext } from "./layout";

export default function Home() {
  const { shardsTechCore } = useContext(HomeContext);

  const [deviceId, setDeviceId] = useState<any>("");

  const [myShards, setMyShards] = useState<any>(null);

  const [userOnlinesShards, setUserOnlinesShards] = useState<any>(null);

  const [transactionHistoryOfUser, setTransactionHistoryOfUser] =
    useState<any>(null);
  const [guildsUserHaveShare, setGuildsUserHaveShare] = useState<any>(null);

  const connectShardsTech = async () => {
    const data = await shardsTechCore.getMyFractions();
    setMyShards(data);

    const userOnlines = await shardsTechCore.getUserOnlineInGuild();
    setUserOnlinesShards(userOnlines);

    const guildsUserHaveShare = await shardsTechCore.getMyFractions();

    setGuildsUserHaveShare(guildsUserHaveShare);
  };
  const [accessToken, setAccessToken] = useSessionStorageState<any>(
    "accessToken",
    {
      defaultValue: process.env.NEXT_PUBLIC_GUILD_TECH_ACCESS_TOKEN,
    }
  );

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

  useEffect(() => {
    if (shardsTechCore) {
      connectShardsTech();
    }
  }, [shardsTechCore]);

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
      children: <JoinGuildRequest />,
    },
    {
      key: "3",
      label: "My Sell Slot",
      children: <MySellSlot />,
    },
    {
      key: "user-history",
      label: "My History",
      children: <MyHistory />,
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
