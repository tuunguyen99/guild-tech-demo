"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../../lib/AntdRegistry";
import "./globals.scss";
import { useLayoutEffect, useState } from "react";
import { ShardsTechCore } from "@mirailabs-co/shards-tech";
import { HomeContext } from "./context";
import { Button, Input, message, Space } from "antd";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Shards.tech || SDK",
//   description:
//     "Trade Teams Like Tokens - Back your favorite teams, get exclusive access to their inner circle, and win a share of their earnings.",
// };

const GAME_SERVER_URL = "https://game-server-production-8ab8.up.railway.app/";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shardsTechCore, setShardsTechCore] = useState<any | null>(null);
  const [shardsTechConnected, setShardsTechConnected] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<any>("");
  const [miraiId, setMiraiId] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();

  const submitDeviceId = async () => {
    const endpoint = `${GAME_SERVER_URL}auth/loginGuest`;
    const data = {
      deviceId: deviceId,
    };
    const response = await axios.post(endpoint, data);
    sessionStorage.setItem("accessToken", response.data.accessToken);
    // reload page
    window.location.reload();
  };

  const handleLinkMiraiId = async () => {
    try {
      const res = await axios.post(
        `${GAME_SERVER_URL}users/linkMiraiId`,
        {
          miraiId: miraiId,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res) {
        throw new Error("Link Mirai ID fail");
      }
      messageApi.open({
        content: "Link Mirai ID success",
        type: "success",
        style: {
          color: "#52c41a",
        },
      });
      setMiraiId("");
    } catch (error: any) {
      messageApi.open({
        content: error.toString() || "Fail",
        type: "error",
        style: {
          color: "#FF4D4F",
        },
      });
      console.log("error :>> ", error);
    }
  };

  const initShardsTechCore = async () => {
    try {
      const shardsTech = await ShardsTechCore.init({
        clientId: "7421609e-545a-4256-99da-12f3308713b0",
        // env: "production",
      });
      const [shardsTechCore, shardsTechConnection] = await shardsTech.connect({
        accessToken:
          sessionStorage.getItem("accessToken") ||
          process.env.NEXT_PUBLIC_GUILD_TECH_ACCESS_TOKEN ||
          "",
      });
      await shardsTechCore.getGuildOfUser();
      setShardsTechCore(shardsTechCore);
      setShardsTechConnected(shardsTechConnection);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    initShardsTechCore();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        shardsTechCore: shardsTechCore,
        shardsTechConnection: shardsTechConnected,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <StyledComponentsRegistry>
            <Space.Compact
              style={{
                marginRight: "16px",
                marginLeft: "16px",
                marginTop: "16px",
              }}
            >
              {contextHolder}
              <Input
                placeholder="Enter device ID"
                value={deviceId}
                onChange={(value) => setDeviceId(value?.target.value)}
                style={{ borderRadius: "8px", marginRight: "8px" }}
              />
              <Button
                type="primary"
                onClick={() => submitDeviceId()}
                style={{ marginRight: "16px", borderRadius: "8px" }}
              >
                Login Another Account
              </Button>
              <Input
                placeholder="Enter Mirai ID"
                value={miraiId}
                onChange={(value) => setMiraiId(value?.target.value)}
                style={{ borderRadius: "8px", marginRight: "8px" }}
              />
              <Button
                type="primary"
                onClick={handleLinkMiraiId}
                style={{ borderRadius: "8px" }}
              >
                Link Mirai ID
              </Button>
            </Space.Compact>
            {children}
          </StyledComponentsRegistry>
        </body>
      </html>
    </HomeContext.Provider>
  );
}
