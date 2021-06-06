import { MintInfo } from "@solana/spl-token";
import { Button, Card, Col, Row, Select, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import { GUTTER, LABELS } from "../../constants";
import { cache, ParsedAccount } from "../../contexts/accounts";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useLendingReserves } from "../../hooks";
import { reserveMarketCap, Totals } from "../../models";
import { fromLamports, getTokenName, wadToLamports } from "../../utils/utils";
import { LendingReserveItem } from "./item";
import { BarChartStatistic } from "./../../components/BarChartStatistic";
import "./itemStyle.less";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";
const { Option } = Select;

export const AnalyticsView = () => {

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

  const [selected, setSelected] = useState(pools[0].token1 + "/" + pools[0].token2)
  const [selectedPool1,setPool1] = useState(pools[0].token1)
  const [selectedPool2, setPool2] = useState(pools[0].token2)
  const originalData : Data[] = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      y: [0, 120, 245, 265, 234, 399, 499, 300, 200, 590, 600, 610],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' },
      name: "LP tokens",
      line: { shape: 'spline', 'smoothing': 1.3 }
    },
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      y: [150, 130, 105, 342, 455, 599, 300, 223, 300, 210, 433, 634],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'green' },
      name: selectedPool1,
      line: { shape: 'spline', 'smoothing': 1.3 }
    },
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      y: [600, 343, 120, 215, 123, 432, 150, 173, 234, 467, 324, 430],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'blue' },
      name: selectedPool2,
      line: { shape: 'spline', 'smoothing': 1.3 }
    }
  ]
  const AprPlotData: Data[] = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      y: [20, 70, 80, 90, 80, 120, 140, 150, 200, 170, 190, 343],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' },
      name: "APR",
      line: { shape: 'spline', 'smoothing': 1.3 }
    }
  ]
  const [plotData, setPlotData] = useState<Data[]>(originalData)
  const [clicked,setClicked] = useState(false)

  function handleClick() {
    if(clicked==false){
      setPlotData([...plotData, {
        x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        y: [245, 245, 245, 245, 245, 245, 245, 245, 245, 245, 245, 245],
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
        name: "LP entry value",
        line: { shape: 'spline', 'smoothing': 1.3, dash:'dash'}
      }, {
          x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        y: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
          type: 'scatter',
          mode: 'lines',
          marker: { color: 'blue' },
          name: "USDC entry value",
          line: { shape: 'spline', 'smoothing': 1.3, dash: 'dash' }
        }, {
          x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        y: [105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105],
          type: 'scatter',
          mode: 'lines',
          marker: { color: 'green' },
          name: "SOL entry value",
          line: { shape: 'spline', 'smoothing': 1.3, dash: 'dash' }
        }])
        setClicked(true)
      }else{
        setPlotData([...originalData])
        setClicked(false)
      }
  }

  
  function handleChange(value: any) {
    const selectedPools = value.split("/")
    setSelected(value)
    setPool1(selectedPools[0])
    setPool1(selectedPools[1])
  }

  return (
    <div className="flexColumn">
      <div style={{display:"flex"}}>
      <Select defaultValue={pools[0].token1 + "/" + pools[0].token2} style={{ width: 120, marginBottom: "20px", marginRight:"20px" }} onChange={handleChange}>
        {pools.map((pool) => (
          <Option value={pool.token1 + "/" + pool.token2}>{pool.token1 + "/" + pool.token2}</Option>
        ))}
      </Select>
      <Button style={{width:"200px"}} type="primary" onClick={handleClick}>Show entry value</Button>
      </div>
      <Plot
        data={plotData}
        layout={{
          width: 1200, height: 500, title: selected + " LP", xaxis: { title: 'time' }, yaxis: { title: 'value ($)' }
        }}
        
      />
      <Plot
        data={AprPlotData}
        layout={{
          width: 1200, height: 500, title: selected + " APR", xaxis: { title: 'time' }, yaxis: { title: 'APR %' }
        }}

      />
    </div>
  );
};
