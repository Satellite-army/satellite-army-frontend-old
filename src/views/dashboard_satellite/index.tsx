import { MintInfo, u64 } from "@solana/spl-token";
import { Card, Col, Row, Statistic, Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { GUTTER, LABELS } from "../../constants";
import { cache, ParsedAccount, useAccount } from "../../contexts/accounts";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import {useLendingReserves, useUserAccounts, useUserBalance, useUserCollateralBalance} from "../../hooks";
import { reserveMarketCap, SatelliteTotals, Totals } from "../../models";
import {convert, formatNumber, fromLamports, getTokenIcon, getTokenName, wadToLamports} from "../../utils/utils";
import { LendingReserveItem } from "./item";
import { BarChartStatistic } from "./../../components/BarChartStatistic";
import "./itemStyle.less";
import {MyTokenItem} from "./myToken";
import axios from "axios";
import Paragraph from "antd/lib/typography/Paragraph";
import Plot from "react-plotly.js";

const fetchPriceFromCG = async (mint: any) => {
  let tokenlist = await axios.get(`solana.tokenlist.json`)
  let tokens = tokenlist.data.tokens

  let selectedToken
  for (let token of tokens) {
    if (token.address == mint) {
      selectedToken = token
      break;
    }
  }

  if (selectedToken != undefined && selectedToken.extensions.coingeckoId != undefined) {
    let response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, { params: { ids: selectedToken.extensions.coingeckoId, vs_currencies: "usd" } })
    let price = response.data[selectedToken.extensions.coingeckoId].usd
    return price
  } else {
    return 0
  }
}

export const DashboardSatelliteView = () => {
  const { reserveAccounts } = useLendingReserves();
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { userAccounts } = useUserAccounts();
  const { tokenMap } = useConnectionConfig();


  const [myTokens, setMyTokens] = useState<any[]>([]);

  const [totals, setTotals] = useState<SatelliteTotals>({
    networth: 0,
    totaldebt: 0,
    totaldeposit: 0,
    totalyield: 0
  });
/* fetches price in lamport
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
*/

/*
  // create arrays of mints and number of tokens
  let mint: string
  let amount: any
  const mints = userAccounts.map((account) => {
    mint = typeof account.info.mint === "string" ? account.info.mint : account.info.mint?.toBase58()
    return mint
  })
  const balances = userAccounts.map((account) => {
    amount = account.info.amount
    return amount
  })

  console.log(mints)
  console.log(balances)



  const [balanceInUSD, setBalanceInUSD] = useState(0);
  let this_mint
  let this_balance: number
  let acc
  // to trigger the following useffect
  for (var i = 0; i < mints.length; i++) {
    this_balance = balances[i]
    this_mint = mints[i]
    acc =
  }

  useEffect(() => {
    const updateBalance = async (this_balance: number) => {
      //setBalanceInUSD(balance * midPriceInUSD(mint || ""));
      const value = await fetchPriceFromCG(mint)
      setBalanceInUSD(this_balance * value);
    };

    updateBalance(this_balance);

  }, [this_mint]);

  for (var i = 0; i < mints.length; i++) {
    const {
      balanceInUSD: tokenBalanceInUSD,
    } = useUserBalance(mints[i]);  }

  console.log(mints)
  //console.log(balances)
  */

  useEffect(() => {
    const refreshTotal = async () => {
      let newTotals: SatelliteTotals = {
        networth: 0,
        totaldeposit: 0,
        totaldebt: 0,
        totalyield: 0,
      };

      const myAsyncLoopFunction = async (userAccounts: any[]) => {
        const promises = userAccounts.map(async (account) => {
            const mint = typeof account.info.mint === "string" ? account.info.mint : account.info.mint?.toBase58()
            const price = await fetchPriceFromCG(mint)
            newTotals.networth = newTotals.networth + (convert(account)/1000000000 * price);
        })
        await Promise.all(promises)
      }

      await myAsyncLoopFunction(userAccounts)
      /*
      userAccounts.forEach(async (account) => {
        const mint = typeof account.info.mint === "string" ? account.info.mint : account.info.mint?.toBase58()
        const price = await fetchPriceFromCG(mint)

        //console.log(price)
        console.log("qui")
        newTotals.networth = newTotals.networth + price;

        //console.log(newTotals.networth)
      });*/

      //console.log("qua")
      //console.log(newTotals)

      setTotals(newTotals);
    };

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, setTotals, reserveAccounts, tokenMap, userAccounts]);

  // useEffect(() => {
  //   const refreshTotal = () => {
  //     let newTotals: Totals = {
  //       marketSize: 0,
  //       borrowed: 0,
  //       lentOutPct: 0,
  //       items: [],
  //     };

  //     reserveAccounts.forEach((item) => {
  //       const marketCapLamports = reserveMarketCap(item.info);

  //       const localCache = cache;
  //       const liquidityMint = localCache.get(
  //         item.info.liquidityMint.toBase58()
  //       ) as ParsedAccount<MintInfo>;

  //       if (!liquidityMint) {
  //         return;
  //       }

  //       const price = midPriceInUSD(liquidityMint?.pubkey.toBase58());

  //       let leaf = {
  //         key: item.pubkey.toBase58(),
  //         marketSize:
  //           fromLamports(marketCapLamports, liquidityMint?.info) * price,
  //         borrowed:
  //           fromLamports(
  //             wadToLamports(item.info?.state.borrowedLiquidityWad).toNumber(),
  //             liquidityMint.info
  //           ) * price,
  //         name: getTokenName(tokenMap, item.info.liquidityMint.toBase58()),
  //       };

  //       newTotals.items.push(leaf);

  //       newTotals.marketSize = newTotals.marketSize + leaf.marketSize;
  //       newTotals.borrowed = newTotals.borrowed + leaf.borrowed;
  //     });

  //     newTotals.lentOutPct = newTotals.borrowed / newTotals.marketSize;
  //     newTotals.lentOutPct = Number.isFinite(newTotals.lentOutPct)
  //       ? newTotals.lentOutPct
  //       : 0;
  //     newTotals.items = newTotals.items.sort(
  //       (a, b) => b.marketSize - a.marketSize
  //     );

  //     setTotals(newTotals);
  //   };

  //   const dispose = marketEmitter.onMarket(() => {
  //     refreshTotal();
  //   });

  //   refreshTotal();

  //   return () => {
  //     dispose();
  //   };
  // }, [marketEmitter, midPriceInUSD, setTotals, reserveAccounts, tokenMap]);

  //console.log("final")

  return (
    <div className="flexColumn">
      <Row gutter={GUTTER} className="home-info-row">
        <Col xs={24} xl={6}>
          <Card>
            <Statistic
              title="Net Worth"
              value={totals.networth}
              precision={2}
              valueStyle={{ color: "#3fBB00" }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          <Card>
            <Statistic
              title="Total Deposit"
              value={totals.totaldeposit}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          <Card>
            <Statistic
              title="Total Yield"
              value={totals.totalyield}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          <Card>
            <Statistic
              title="Total Debt"
              value={totals.totaldebt}
              precision={2}
              prefix="$"
            />
          </Card>
          {/*
          <Card>
            <BarChartStatistic
              title="Total Debt"
              name={(item) => item.name}
              getPct={(item) => item.marketSize / totals.marketSize}
              items={totals.items}
            />
          </Card>
          */}
        </Col>
      </Row>
      <Row gutter={GUTTER} className="home-info-row" style={{marginTop:"40"}}>
        <Col xs={24} xl={6}>
          <Button type="primary" href="https://solanabeach.io/">Block Explorer</Button>
          {userAccounts[0] != undefined &&
            <Row gutter={GUTTER} className="home-info-row" style={{marginTop:20}}>
              <Paragraph copyable keyboard>{userAccounts[0]?.pubkey.toString()}</Paragraph>
            </Row>
          }
        </Col>
        <Col xs={24} xl={18}>
          {userAccounts[0] != undefined &&
          <Plot
            data={[
              {
                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                y: [0, 120, 245, 265, 234, 399, 499, 300, 200, 590, 430, 253],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'wallet',
                marker: { color: '#F1C231' },
                line: {shape:'spline', 'smoothing':1.3}
              },
              {
                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                y: [0, 20, 34, 45, 55, 59, 60, 74, 99, 123, 145, 169],
                type: 'scatter',
                name: 'LP tokens',
                mode: 'lines+markers',
                marker: { color: 'green' },
                line: { shape: 'spline', 'smoothing': 1.3 }
              }
            ]}
            layout={{
              width: 1000, height: 500, paper_bgcolor: "#000000", plot_bgcolor: "#000000", title: { text: 'Wallet and LP tokens', font: { color: "#F1C231" } }, legend: { font: { color: "#F1C231" } }, xaxis: { title: 'time', color: "#F1C231", gridcolor: "rgba(244,228,183,0.2)" }, yaxis: { title: 'value ($)', color: "#F1C231", gridcolor:"rgba(244,228,183,0.2)"}
            }} 
          />
          }
        </Col>
      </Row>

      {/*
      <Card>
        <div className="home-item home-header">
          <div>{LABELS.TABLE_TITLE_ASSET}</div>
          <div>{LABELS.TABLE_TITLE_MARKET_SIZE}</div>
          <div>{LABELS.TABLE_TITLE_TOTAL_BORROWED}</div>
          <div>{LABELS.TABLE_TITLE_DEPOSIT_APY}</div>
          <div>{LABELS.TABLE_TITLE_BORROW_APY}</div>
        </div>
      */}
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
        {/*userAccounts.map((account) => (
          <MyTokenItem
            key={account.pubkey.toBase58()}
            userAccount={account}
            // item={totals.items.find(
            //   (item) => item.key === account.pubkey.toBase58()
            // )}
          />
        ))*/}
      {/*</Card> */}
    </div>
  );
};
