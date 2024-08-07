export type GuildType = {
  address: string;
  chain: string;
  clientId: string;
  createdAt: string;
  guildOwnerShare: number;
  isDeleted: boolean;
  maxMembers: number;
  metadata: {
    fee: number;
    guildOwnerShare: number;
    rewardShareForMembers: number;
    slotPrice: number;
    txGuildOwnerShare: number;
    rank?: number;
  };
  name: string;
  numberAllowUpdate: number;
  owner: GuildOwner;
  rewardShareForMembers: number;
  slotPrice: number;
  txGuildOwnerShare: number;
  userCount: number;
  _id: string;
  requireJoinGuildRequest?: boolean;
  avatar?: string;
  level?: number;
  rank?: number;
};

export type GuildOwner = {
  address: string;
  clientId: string;
  createdAt: string;
  userId: string;
  __v: number;
  _id: string;
};

export type ShardsGuildType = {
  guild: GuildType;
  leaderBoard: string;
  metadata: any;
  score: number;
  _id: string;
  __v: string;
};

export type LeaderBoardType = {
  clientId: string;
  isHidden: boolean;
  name: string;
  type: string;
  metadata: {
    description: string;
    image: string;
  };
  _id: string;
  __v: string;
};

export type TransactionGuild = {
  _id: string;
  guild: string;
  user: {
    _id: string;
    clientId: string;
    userId: string;
    address: string;
    createdAt: string;
    __v: number;
  };
  address: string;
  txHash: string;
  type: "buy_share";
  amount: number;
  price: number;
  status: "success";
  clientId: string;
  chain: string;
  createdAt: string;
  __v: number;
};

export type UpdateGuildType = {
  guildName: string;
  slotPrice: number;
  guildMaster: number;
  seatOwners: number;
  fractionOwners: number;
  requireJoinGuildRequest: boolean;
};

export type GuildSlotType = {
  clientId: string;
  price: number;
  seller: string;
  _id: string;
  guild: GuildType;
};
