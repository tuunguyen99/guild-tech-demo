"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../../lib/AntdRegistry";
import "./globals.scss";
import { useLayoutEffect, useState } from "react";
import { ShardsTechCore } from "@mirailabs-co/shards-tech";
import { HomeContext } from "./context";
import { Button, Input, Space } from "antd";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Shards.tech || SDK",
//   description:
//     "Trade Teams Like Tokens - Back your favorite teams, get exclusive access to their inner circle, and win a share of their earnings.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shardsTechCore, setShardsTechCore] = useState<any | null>(null);
  const [shardsTechConnected, setShardsTechConnected] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<any>("");

  const submitDeviceId = async () => {
    const endpoint = "http://103.109.37.199:3000/auth/loginGuest";
    const data = {
      deviceId: deviceId,
    };
    const response = await axios.post(endpoint, data);
    sessionStorage.setItem("accessToken", response.data.accessToken);
    // reload page
    window.location.reload();
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
            <Space.Compact>
              <Input
                placeholder="deviceId"
                value={deviceId}
                onChange={(value) => setDeviceId(value?.target.value)}
              />
              <Button type="primary" onClick={() => submitDeviceId()}>
                Login Another Account
              </Button>
            </Space.Compact>
            {children}
          </StyledComponentsRegistry>
        </body>
      </html>
    </HomeContext.Provider>
  );
}
