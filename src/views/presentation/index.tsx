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
import Lottie from 'react-lottie';
import planet1 from '../../assets/animation/planet1.json'
import planet2 from '../../assets/animation/planet2.json'
import planet3 from '../../assets/animation/planet3.json'

export const PresentationPage = () => {
  const { reserveAccounts } = useLendingReserves();
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { userAccounts } = useUserAccounts();
  const { tokenMap } = useConnectionConfig();


  const renderAnimation = (animationData: any) => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <Lottie options={defaultOptions}
              height={150}
              width={150}
              isStopped={false}
              isPaused={false}/>
    )
  }

  return (
    <div className="home-background">
      <Card className="header">
        <img className="header-icon" src={Icon}/>
      </Card>

      <div className="body">
        <div className="title" ><img src="/scritta.png" width="400" height="145"/></div>
        <div className="subtitle">The most complete tracking tool for DeFi, native to Solana</div>

        <div className="features">
          <div className="feature feature-top">
            {renderAnimation(planet1)}
            <div className="circle">
              <div className="feature-title">Feature 1</div>
            </div>
            <div className="feature-description">lorem ipsum dolor sit amet</div>
          </div>
          <div className="feature">
            {renderAnimation(planet2)}
            <div className="circle">
              <div className="feature-title">Feature 2</div>
            </div>
            <div className="feature-description">lorem ipsum dolor sit amet</div>
          </div>
          <div className="feature feature-top">
            {renderAnimation(planet3)}
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