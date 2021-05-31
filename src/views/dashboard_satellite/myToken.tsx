import React, { useMemo } from "react";
import {useTokenName, useUserBalance} from "../../hooks";
import {
  calculateBorrowAPY,
  calculateDepositAPY,
  LendingReserve,
} from "../../models/lending";
import { TokenIcon } from "../../components/TokenIcon";
import {
  wadToLamports,
  formatNumber,
  fromLamports,
  formatPct,
} from "../../utils/utils";
import { Link } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { useMint } from "../../contexts/accounts";
import {TokenAccount, TotalItem} from "../../models";

export const MyTokenItem = (props: {
  userAccount: TokenAccount;
  // reserve: LendingReserve;
  // address: PublicKey;
  // item?: TotalItem;
}) => {
  const mint = props.userAccount.info.mint.toBase58()
  const liquidityMint = useMint(mint);
  const name = useTokenName(mint);

  const {
    balance: tokenBalance,
    balanceInUSD: tokenBalanceInUSD,
  } = useUserBalance(mint);

  console.log({liquidityMint})
  console.log({tokenBalance, tokenBalanceInUSD})

  // const availableLiquidity = fromLamports(
  //   props.reserve.state.availableLiquidity,
  //   liquidityMint
  // );

  // const totalBorrows = useMemo(
  //   () =>
  //     fromLamports(
  //       wadToLamports(props.reserve.state.borrowedLiquidityWad),
  //       liquidityMint
  //     ),
  //   [props.reserve, liquidityMint]
  // );
  //
  // const marketSize = availableLiquidity + totalBorrows;

  return (
    <Link to={`/reserve/${mint}`}>
      <div className="home-item">
        <span style={{ display: "flex" }}>
          <TokenIcon mintAddress={mint} />
          {tokenBalance} {name}
          {`--- ${tokenBalanceInUSD} $`}
        </span>
        {/*<div >*/}
        {/*  <div>*/}
        {/*    <div>*/}
        {/*      <em>{formatNumber.format(marketSize)}</em> {name}*/}
        {/*    </div>*/}
        {/*    <div className="dashboard-amount-quote">*/}
        {/*      ${formatNumber.format(props.item?.marketSize)}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div title={totalBorrows.toString()}>*/}
        {/*  <div>*/}
        {/*    <div>*/}
        {/*      <em>{formatNumber.format(totalBorrows)}</em> {name}*/}
        {/*    </div>*/}
        {/*    <div className="dashboard-amount-quote">*/}
        {/*      ${formatNumber.format(props.item?.borrowed)}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </Link>
  );
};
