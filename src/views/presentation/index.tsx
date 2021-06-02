import { MintInfo } from "@solana/spl-token";
import {Button, Card, Col, Popover, Row, Statistic} from "antd";
import React, { useEffect, useState } from "react";
import { GUTTER, LABELS } from "../../constants";
import { cache, ParsedAccount } from "../../contexts/accounts";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import {useLendingReserves, useUserAccounts, useUserBalance, useUserCollateralBalance} from "../../hooks";
import { reserveMarketCap, Totals } from "../../models";
import {convert, formatNumber, fromLamports, getTokenIcon, getTokenName, wadToLamports} from "../../utils/utils";
import { LendingReserveItem } from "./item";
import { BarChartStatistic } from "./../../components/BarChartStatistic";
import "./itemStyle.less";
import {Icon} from "../../assets";
import {Link} from "react-router-dom";

export const PresentationPage = () => {
  const { reserveAccounts } = useLendingReserves();
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { userAccounts } = useUserAccounts();
  const { tokenMap } = useConnectionConfig();


  console.log('aodsoadoaosdo')
  return (
    <div className="home-background">
      <Card className="header">
        <img className="header-icon" src={Icon}/>
      </Card>
      <div className="body">
        <div className="title">Satellite.army</div>
        <div className="subtitle">The most complete tracking tool for DeFi, native to Solana</div>

        <div className="features">
          <div className="feature feature-top">
            <div className="circle">
              <div className="feature-title">Feature 1</div>
            </div>
            <div className="feature-description">lorem ipsum dolor sit amet</div>
          </div>
          <div className="feature">
            <div className="circle">
              <div className="feature-title">Feature 2</div>
            </div>
            <div className="feature-description">lorem ipsum dolor sit amet</div>
          </div>
          <div className="feature feature-top">
            <div className="circle">
              <div className="feature-title">Feature 3</div>
            </div>
            <div className="feature-description">lorem ipsum dolor sit amet</div>
          </div>
        </div>
        <div className="buttons">
          <Link to="/dashboard">
            <Button type="primary" className="button-connect">Connect to the galaxy</Button>
          </Link>
          <Link to="/dashboard">
            <Button type="primary">Not sure? take a look to our demo</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
