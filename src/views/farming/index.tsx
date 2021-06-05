import { Button, Card, Col, InputNumber, Popover, Radio, Row, Space } from "antd";
import React from "react";
import { TokenIcon } from "../../components/TokenIcon";
import { LABELS } from "../../constants";
import { useLendingReserves } from "../../hooks";
import "./itemStyle.less";
import { SendOutlined, BellFilled } from "@ant-design/icons";
import { FarmingItem } from "./item";


export const FarmingView = () => {
  // bell popup content

  const pools = [{
    liquidityLink: "https://raydium.io/liquidity/?ammId=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
    lpTokenValue: 1.08,
    mint1: "So11111111111111111111111111111111111111112",
    mint2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token1: "SOL",
    token2: "USDC",
    tvl: "11,546,870.35",
    lpNumber: 46.4,
    lpTotalValue: 50,
    distribution1: 80,
    distribution2: 0.5,
    last: "03/06/2021",
    yieldToken: 140,
    yieldDollar: 150,
    ILPercentage: 3,
    ILDollar: 300,
    fee: 0.5,
    optimal: 1,
    zero1: 40,
    zero2: 1,
    firstDeposit: "01/05/2021",
    harvestCompoundTimes: 3,
    avgCompound: 5,
    totalFees: 500
  }]


  return (
    <div className="flexColumn">
       {pools.map((pool) => (
         <FarmingItem props={pool} />
       ))}
      
    </div>
  );
};
