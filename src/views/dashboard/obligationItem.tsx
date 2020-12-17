import React, { useMemo } from "react";
import { EnrichedLendingObligation, useTokenName } from "../../hooks";
import {
  calculateBorrowAPY,
  collateralToLiquidity,
  LendingReserve,
} from "../../models/lending";
import { TokenIcon } from "../../components/TokenIcon";
import {
  wadToLamports,
  formatNumber,
  fromLamports,
  formatPct,
} from "../../utils/utils";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
import { cache, ParsedAccount, useMint } from "../../contexts/accounts";

export const ObligationItem = (props: {
  obligation: EnrichedLendingObligation;
}) => {
  const { obligation } = props;

  const borrowReserve = cache.get(
    obligation.info.borrowReserve
  ) as ParsedAccount<LendingReserve>;

  const collateralReserve = cache.get(
    obligation.info.collateralReserve
  ) as ParsedAccount<LendingReserve>;

  const liquidityMint = useMint(borrowReserve.info.liquidityMint);
  const collateralMint = useMint(collateralReserve.info.liquidityMint);

  const borrowAmount = fromLamports(
    wadToLamports(obligation.info.borrowAmountWad),
    liquidityMint
  );

  const borrowAPY = useMemo(() => calculateBorrowAPY(borrowReserve.info), [
    borrowReserve,
  ]);

  const collateralLamports = collateralToLiquidity(
    obligation.info.depositedCollateral,
    borrowReserve.info
  );
  const collateral = fromLamports(collateralLamports, collateralMint);

  const borrowName = useTokenName(borrowReserve?.info.liquidityMint);
  const collateralName = useTokenName(collateralReserve?.info.liquidityMint);

  return (
    <Card>
      <div className="dashboard-item">
        <span style={{ display: "flex", marginLeft: 5 }}>
          <div
            style={{ display: "flex" }}
            title={`${collateralName}→${borrowName}`}
          >
            <TokenIcon
              mintAddress={collateralReserve?.info.liquidityMint}
              style={{ marginRight: "-0.5rem" }}
            />
            <TokenIcon mintAddress={borrowReserve?.info.liquidityMint} />
          </div>
        </span>
        <div>
          {formatNumber.format(borrowAmount)} {borrowName}
        </div>
        <div>
          {formatNumber.format(collateral)} {collateralName}
        </div>
        <div>{formatPct.format(borrowAPY)}</div>
        <div>{formatPct.format(obligation.info.ltv / 100)}</div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to={`/borrow/${borrowReserve.pubkey.toBase58()}`}>
            <Button>
              <span>Borrow</span>
            </Button>
          </Link>
          <Link to={`/repay/loan/${obligation.account.pubkey.toBase58()}`}>
            <Button>
              <span>Repay</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
