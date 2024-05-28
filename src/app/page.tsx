"use client";
import {
    InfoCircleTwoTone,
    MinusCircleTwoTone,
    MoreOutlined,
    PictureFilled,
    PlusCircleTwoTone,
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
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tabs,
    Typography,
} from "antd";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSessionStorageState from "use-session-storage-state";
import HandleForm from "./shards-tech/_Form";
import ShardsTabChat from "./shards-tech/_TabChat";

export default function Home() {
    const [accessToken, setAccessToken] = useSessionStorageState<any>("accessToken", {
        defaultValue: process.env.NEXT_PUBLIC_GUILD_TECH_ACCESS_TOKEN,
    });

    const [deviceId, setDeviceId] = useState<any>("");

    const [shardsTechCore, setShardsTechCore] = useState<any>(null);

    const [shardsTechConnected, setShardsTechConnected] = useState<any>(null);
    const [shardsTechLeaderBoards, setShardsTechLeaderBoards] = useState<any>(null);
    const [selectedShardsLeaderBoard, setSelectedShardsLeaderBoard] = useState<any>(null);
    const [listShards, setListShards] = useState<any>(null);
    const [myShards, setMyShards] = useState<any>(null);
    const [buySlotPrice, setBuySlotPrice] = useState<any>(null);
    const [openBuySlotPrice, setOpenBuySlotPrice] = useState<any>(null);
    const [mySellSlot, setMySellSlot] = useState<any>(null);

    const [price, setPrice] = useState<any>(null);
    const [updatePrice, setUpdatePrice] = useState<any>(null);

    const [newOwner, setNewOwner] = useState<any>(null);
    const [userOnlinesShards, setUserOnlinesShards] = useState<any>(null);

    const [transactionHistoryOfUser, setTransactionHistoryOfUser] = useState<any>(null);
    const [transactionHistoryOfGuild, setTransactionHistoryOfGuild] = useState<any>(null);

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
        setShardsTechConnected(shardsTechConnection);
        await shardsTechCore.getGuildOfUser();
        const data = await shardsTechCore.getMyFractions();
        setMyShards(data);

        const leaderBoards = await shardsTechCore.getLeaderBoards();
        setShardsTechLeaderBoards(leaderBoards);
        setSelectedShardsLeaderBoard(leaderBoards[0]._id);

        const mySellSlot = await shardsTechCore.getMySellMemberSlot();
        setMySellSlot(mySellSlot);

        const userOnlines = await shardsTechCore.getUserOnlineInGuild();
        setUserOnlinesShards(userOnlines);

        const transactionHistoryOfUser = await shardsTechCore.getTransactionHistoryOfUser({
            page: 1,
            limit: 10,
        });

        setTransactionHistoryOfUser(transactionHistoryOfUser.data);

        const transactionHistoryOfGuild = await shardsTechCore.getTransactionHistoryOfGuild({
            page: 1,
            limit: 10,
        });

        setTransactionHistoryOfGuild(transactionHistoryOfGuild.data);
    };

    useEffect(() => {
        if (shardsTechCore) {
            connectShardsTech();
        }
    }, [shardsTechCore]);

    const getShardsGuilds = async () => {
        if (!shardsTechConnected) {
            console.log("ShardsTech not connected");
            return;
        }
        const shards = await shardsTechCore.getGuildScores({
            leaderBoardId: selectedShardsLeaderBoard,
            page: 1,
            limit: 100,
            sort: "desc",
        });
        setListShards(shards.data);
    };

    useEffect(() => {
        if (shardsTechLeaderBoards) {
            getShardsGuilds();
        }
    }, [shardsTechLeaderBoards]);

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

    const updatePriceSellSlot = async (sellSlotId: string, price: number) => {
        const response = await shardsTechCore.updateSellSlot(sellSlotId, price);
        await shardsTechCore.getGuildOfUser();
        const mySellSlot = await shardsTechCore.getMySellMemberSlot();
        setMySellSlot(mySellSlot);
        setUpdatePrice(null);
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

    const buyFraction = async (guildAddress: string, amount: number, chain?: string) => {
        const response = await shardsTechCore.buyFraction(guildAddress, amount, chain);
    };

    const sellFraction = async (guildAddress: string, amount: number, chain?: string) => {
        const response = await shardsTechCore.sellFraction(guildAddress, amount, chain);
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
        },
        {
            title: "UserId",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Shards Tech Id",
            dataIndex: "_id",
            key: "_id",
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

    const guildHistoryColumns = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            render: (user: any) => {
                return user.userId;
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

    const shardsGuildsColumns = [
        {
            title: "Rank",
            dataIndex: "guild",
            key: "rank",
            render: (guild: any, record: any, index: number) => {
                return guild?.metadata?.rank;
            },
        },
        {
            title: "Guild",
            dataIndex: "guild",
            key: "guild",
            render: (guild: any) => {
                return guild.name;
            },
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
        },
        {
            title: "",
            dataIndex: "guild",
            key: "action",
            align: "right ",
            render: (guild: any) => {
                return (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: <span onClick={() => getSlotPrice(guild._id)}>Get Slot Price</span>,
                                    icon: <InfoCircleTwoTone style={{ fontSize: "0.875rem" }} />,
                                },
                                {
                                    key: "2",
                                    label: (
                                        <span onClick={() => buyFraction(guild.address, 1, guild.chain)}>
                                            Buy Fraction
                                        </span>
                                    ),
                                    icon: <PlusCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "0.875rem" }} />,
                                },
                                {
                                    key: "3",
                                    label: (
                                        <span onClick={() => sellFraction(guild.address, 1, guild.chain)}>
                                            Sell Fraction
                                        </span>
                                    ),
                                    icon: (
                                        <MinusCircleTwoTone twoToneColor="#f81d22" style={{ fontSize: "0.875rem" }} />
                                    ),
                                },
                            ],
                        }}
                    >
                        <Button shape="circle" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    const shardItems = [
        {
            key: "1",
            label: "LeaderBoards",
            children: (
                <div>
                    <div className="px-4 mb-4">
                        <Select
                            placeholder="Select leader board"
                            onChange={(value) => setSelectedShardsLeaderBoard(value)}
                        >
                            {shardsTechLeaderBoards?.map((leaderBoard: any) => {
                                return (
                                    <Select.Option key={leaderBoard._id} value={leaderBoard._id}>
                                        {leaderBoard.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </div>
                    {listShards && (
                        <Table
                            columns={shardsGuildsColumns}
                            dataSource={listShards}
                            rowKey={(record) => record.guild._id}
                            pagination={false}
                        />
                    )}
                </div>
            ),
        },
        {
            key: "2",
            label: "My Guild",
            children: shardsTechCore?.userGuild ? (
                <div className="px-4">
                    <Space align="center" size={"middle"} className="mb-4">
                        {shardsTechCore.userGuild.metadata?.avatar ? (
                            <Avatar src={shardsTechCore.userGuild.metadata?.avatar} size={48} shape="square" />
                        ) : (
                            <Avatar icon={<PictureFilled />} size={48} shape="square" />
                        )}
                        <Space direction="vertical" style={{ gap: "0.25rem" }}>
                            <Typography.Title className="my-0" level={4}>
                                {shardsTechCore.userGuild.name}
                            </Typography.Title>
                            <Space>
                                <Badge count={`Lv: ${shardsTechCore.userGuild.metadata?.level}`} color="#1677ff" />
                                <Badge count={`Rank: ${shardsTechCore.userGuild.metadata?.rank}`} color="#52c41a" />
                            </Space>
                        </Space>
                    </Space>
                    <Typography.Paragraph type="secondary">
                        {shardsTechCore.userGuild.metadata?.description}
                    </Typography.Paragraph>
                    <Table
                        columns={usersColumns}
                        dataSource={shardsTechCore.userGuild?.users || []}
                        rowKey={(record) => record._id}
                        pagination={false}
                    />
                    <Space>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                onChange={(e) => setNewOwner(e.target.value)}
                                value={newOwner}
                                // newOwner is Shards Tech Id of member who will be new owner
                            />
                            <Button type="primary" onClick={() => changeOwner(newOwner)}>
                                Change Owner
                            </Button>
                        </Space.Compact>
                        <Space.Compact style={{ width: "100%" }}>
                            <InputNumber onChange={(value) => setPrice(value)} value={price} />
                            <Button type="primary" onClick={() => sellSlot(shardsTechCore.userGuild._id, price)}>
                                Sell Slot
                            </Button>
                        </Space.Compact>
                        <Button onClick={() => burnSlotShard(shardsTechCore.userGuild._id)} danger>
                            Burn Slot
                        </Button>
                    </Space>
                </div>
            ) : (
                <Empty description="" className="p-4">
                    <Flex vertical align="center" className="text-center">
                        <Typography.Title className="mt-0" level={4}>
                            You haven&apos;t joined any guild.
                        </Typography.Title>
                        <Typography.Paragraph type="secondary">
                            Create a new guild or buy a slot from a guild that already exists on the system.
                        </Typography.Paragraph>
                        <Button type="primary" onClick={() => setHandleFormVisible(true)} style={{ marginBottom: 20 }}>
                            Create New Guild
                        </Button>
                    </Flex>
                </Empty>
            ),
        },
        {
            key: "guild-history",
            label: "Guild History",
            children: transactionHistoryOfGuild && (
                <div>
                    <Table
                        columns={guildHistoryColumns}
                        dataSource={transactionHistoryOfGuild || []}
                        rowKey={(record) => record._id}
                        pagination={false}
                    />
                </div>
            ),
        },
        {
            key: "3",
            label: "My Sell Slot",
            children: (
                <>
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
                    <Space>
                        <Space.Compact style={{ width: "100%" }}>
                            <InputNumber onChange={(value) => setUpdatePrice(value)} value={updatePrice} />
                            <Button type="primary" onClick={() => updatePriceSellSlot(mySellSlot._id, updatePrice)}>
                                Update Price
                            </Button>
                        </Space.Compact>
                        <Button onClick={() => cancelSellSlot(mySellSlot._id)} danger>
                            Cancel Sell Slot
                        </Button>
                    </Space>
                </>
            ),
        },
        {
            key: "user-history",
            label: "My History",
            children: transactionHistoryOfUser && (
                <div>
                    <Table
                        columns={userHistoryColumns}
                        dataSource={transactionHistoryOfUser || []}
                        rowKey={(record) => record._id}
                        pagination={false}
                    />
                </div>
            ),
        },
        {
            key: "4",
            label: "Chats",
            children: (
                <div>
                    {userOnlinesShards?.length} user online
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
                            <Avatar src={buySlotPrice?.guild?.avatar} size={48} shape="square" />
                        ) : (
                            <Avatar size={48} shape="square" icon={<PictureFilled />} />
                        )}
                        <Space direction="vertical" style={{ gap: "0.25rem" }}>
                            <Typography.Title className="my-0" level={4}>
                                {buySlotPrice?.guild?.name}
                            </Typography.Title>
                            <Space>
                                <Badge count={`Lv: ${buySlotPrice?.guild?.level}`} color="#1677ff" />
                                <Badge count={`Rank: ${buySlotPrice?.guild?.rank}`} color="#52c41a" />
                            </Space>
                        </Space>
                    </Space>
                    <Space size={"small"} direction="vertical">
                        <Typography.Text type="secondary">Seller</Typography.Text>
                        <Typography.Text className="fw-semibold">
                            {buySlotPrice?.seller.slice(0, 6)}...{buySlotPrice?.seller.slice(-4)}
                            {/* {buySlotPrice?.seller} */}
                        </Typography.Text>
                    </Space>
                    <Space size={"small"} direction="vertical">
                        <Typography.Text type="secondary">Price</Typography.Text>
                        <Typography.Text className="fw-semibold">{buySlotPrice?.price} ETH</Typography.Text>
                    </Space>
                </Space>
            </Modal>
        </main>
    );
}
