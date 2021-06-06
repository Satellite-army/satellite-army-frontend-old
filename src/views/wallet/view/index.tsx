import { Card } from "antd";
import React from "react";
//import { useLendingReserves } from "../../../hooks";
import { useUserAccounts } from "../../../hooks";
import { WalletItem } from "./item";
import "./itemStyle.less";

import axios from 'axios';

export const WalletView = () => {
  //const { reserveAccounts } = useLendingReserves();
  const { userAccounts } = useUserAccounts();

  return (
    <div className="flexColumn">
      <Card>
        <div className="deposit-item deposit-header">
          <div style={{ width: "10%", textAlign: "center", fontSize:"1.5em", textDecoration:"bold"}}>#</div>
          <div style={{ width: "30%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold"}}>Asset</div>
          <div style={{ width: "10%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold"}}>N</div>
          <div style={{ width: "10%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold"}}>Value</div>
          <div style={{ width: "10%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold" }}>Total Value</div>
          <div style={{ width: "10%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold"}}>Alerts</div>
          <div style={{ width: "20%", textAlign: "center", fontSize: "1.5em", textDecoration: "bold"}}>24h change</div>
        </div>  
        {userAccounts.map((account, index) => ( 
          <WalletItem
            //key={account.pubkey.toBase58()}
            index={index+1}
            mintAddress={account.info.mint}
            //address={account.pubkey}
          />
        ))}
      </Card>
    </div>
  );
};
