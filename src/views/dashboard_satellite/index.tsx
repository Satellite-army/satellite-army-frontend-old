import { MintInfo } from "@solana/spl-token";
import { Card, Col, Row, Statistic } from "antd";
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
import {MyTokenItem} from "./myToken";

export const DashboardSatelliteView = () => {
  const { reserveAccounts } = useLendingReserves();
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { userAccounts } = useUserAccounts();
  const { tokenMap } = useConnectionConfig();


  const [myTokens, setMyTokens] = useState<any[]>([]);


  console.log({userAccounts})
  console.log({marketEmitter, midPriceInUSD})


  const [totals, setTotals] = useState<Totals>({
    marketSize: 0,
    borrowed: 0,
    lentOutPct: 0,
    items: [],
  });

  useEffect(() => {
    const tokens = userAccounts.map((tokenAccount => {
      console.log({price: midPriceInUSD(tokenAccount.info.mint.toBase58())})

      const mintAddress = tokenAccount.info.mint.toBase58()

      return {
        value: convert(tokenAccount).toFixed(6),
        name: getTokenName(tokenMap, mintAddress),
        icon: getTokenIcon(tokenMap, mintAddress),
      }
      // return useUserBalance(tokenAccount.info.liquidityMint);

    }))

    const reserveAccountsTokensss = reserveAccounts.map((tokenAccount => {
      console.log({proce: midPriceInUSD(tokenAccount.info.liquidityMint.toBase58())})

      // return useUserBalance(tokenAccount.info.liquidityMint);

    }))

    setMyTokens(tokens)

    console.log({tokens})
  }, [userAccounts, reserveAccounts])

  useEffect(() => {
    const refreshTotal = () => {
      let newTotals: Totals = {
        marketSize: 0,
        borrowed: 0,
        lentOutPct: 0,
        items: [],
      };

      reserveAccounts.forEach((item) => {
        const marketCapLamports = reserveMarketCap(item.info);

        const localCache = cache;
        const liquidityMint = localCache.get(
          item.info.liquidityMint.toBase58()
        ) as ParsedAccount<MintInfo>;

        if (!liquidityMint) {
          return;
        }

        const price = midPriceInUSD(liquidityMint?.pubkey.toBase58());

        let leaf = {
          key: item.pubkey.toBase58(),
          marketSize:
            fromLamports(marketCapLamports, liquidityMint?.info) * price,
          borrowed:
            fromLamports(
              wadToLamports(item.info?.state.borrowedLiquidityWad).toNumber(),
              liquidityMint.info
            ) * price,
          name: getTokenName(tokenMap, item.info.liquidityMint.toBase58()),
        };

        newTotals.items.push(leaf);

        newTotals.marketSize = newTotals.marketSize + leaf.marketSize;
        newTotals.borrowed = newTotals.borrowed + leaf.borrowed;
      });

      newTotals.lentOutPct = newTotals.borrowed / newTotals.marketSize;
      newTotals.lentOutPct = Number.isFinite(newTotals.lentOutPct)
        ? newTotals.lentOutPct
        : 0;
      newTotals.items = newTotals.items.sort(
        (a, b) => b.marketSize - a.marketSize
      );

      setTotals(newTotals);
    };

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, setTotals, reserveAccounts, tokenMap]);

  console.log({totals})
  return (
    <div className="flexColumn">
      <Row gutter={GUTTER} className="home-info-row">
        <Col xs={24} xl={5}>
          <Card>
            <Statistic
              title="Current market size s"
              value={totals.marketSize}
              precision={2}
              valueStyle={{ color: "#3fBB00" }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} xl={5}>
          <Card>
            <Statistic
              title="Total borrowed"
              value={totals.borrowed}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} xl={5}>
          <Card>
            <Statistic
              title="% Lent out"
              value={totals.lentOutPct * 100}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card>
            <BarChartStatistic
              title="Market composition"
              name={(item) => item.name}
              getPct={(item) => item.marketSize / totals.marketSize}
              items={totals.items}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="home-item home-header">
          <div>{LABELS.TABLE_TITLE_ASSET}</div>
          <div>{LABELS.TABLE_TITLE_MARKET_SIZE}</div>
          <div>{LABELS.TABLE_TITLE_TOTAL_BORROWED}</div>
          <div>{LABELS.TABLE_TITLE_DEPOSIT_APY}</div>
          <div>{LABELS.TABLE_TITLE_BORROW_APY}</div>
        </div>
        {/*{reserveAccounts.map((account) => (*/}
        {/*  <LendingReserveItem*/}
        {/*    key={account.pubkey.toBase58()}*/}
        {/*    reserve={account.info}*/}
        {/*    address={account.pubkey}*/}
        {/*    item={totals.items.find(*/}
        {/*      (item) => item.key === account.pubkey.toBase58()*/}
        {/*    )}*/}
        {/*  />*/}
        {/*))}*/}
        {userAccounts.map((account) => (
          <MyTokenItem
            key={account.pubkey.toBase58()}
            userAccount={account}
            // item={totals.items.find(
            //   (item) => item.key === account.pubkey.toBase58()
            // )}
          />
        ))}
      </Card>
    </div>
  );
};
