import React from "react";
import { useTokenName, useBorrowingPower } from "../../hooks";
import { calculateBorrowAPY, LendingReserve } from "../../models/lending";
import { TokenIcon } from "../../components/TokenIcon";
import { formatNumber, formatPct } from "../../utils/utils";
import { Button, Card, Col, InputNumber, Popover, Radio, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { LABELS } from "../../constants";
import { useMidPriceInUSD } from "../../contexts/market";
import { SendOutlined, BellFilled } from "@ant-design/icons";

export const FarmingItem = (props: any) => {
  const tgAlertPop = (
    <><div style={{ display: "flex" }}>
      <div>
        <Radio.Group>
          <Space direction="vertical">
            <Radio value={1}>{'>'}</Radio>
            <Radio value={2}>=</Radio>
            <Radio value={3}>{'<'}</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "50%" }}>
        <InputNumber style={{ verticalAlign: "middle", marginRight:"5px" }} min={0} defaultValue={0} />%
      </div>
    </div>
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          icon={<SendOutlined />} />
      </div></>
  );

  const lpTokenPop = (
    <p>1 LP = {props.props.lpTokenValue} $</p>
  )

  const securityPop = (
    <div>
      <div>
        <p>Do you want to signup for security alerts related to this pool?</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          icon={<SendOutlined />} />
      </div>
    </div>
  )
  return (
    <Card style={{marginBottom:"10px"}}>
      <div className="deposit-header" style={{ display: "flex" }}>
        <div style={{ flexShrink: "unset" }}>
          <Row>
            <Col span="3" style={{ display: "flex" }}><TokenIcon style={{ marginLeft: 10, marginRight: 20 }} mintAddress={props.props.mint1} /><TokenIcon mintAddress={props.props.mint2} /></Col>
            <Col span="4" style={{ textAlign: "left" }}>N LP Token / Value:</Col>
            <Col span="4" style={{ textAlign: "left" }}>Yield</Col>
            <Col span="4" style={{ textAlign: "left" }}>Impermanent Loss</Col>
            <Col span="4" style={{ textAlign: "left" }}>Compounding</Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}>First deposit: {props.props.firstDeposit}</Col>
          </Row>
          <Row>
            <Col span="3" style={{ textAlign: "left", color: "rgb(242,193,51)"}}>{props.props.token1} / {props.props.token2}</Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}><Popover content={lpTokenPop} title="Single LP token price" trigger="hover">{props.props.lpNumber} / {props.props.lpTotalValue} $</Popover></Col>
            <Col span="4" style={{ textAlign: "left" }}>From last deposit / withdrawal</Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}>{props.props.ILPercentage}% / {props.props.ILDollar} $</Col>
            <Col span="4" style={{ textAlign: "left" }}>Current fee: {props.props.fee} $</Col>
            <Col span="4" style={{ textAlign: "left" }}>Harvested / Compounded {props.props.harvestCompoundTimes} times</Col>
          </Row>
          <Row>
            <Col span="3" style={{ textAlign: "left" }}> TVL: $ {props.props.tvl} </Col>
            <Col span="4" style={{ textAlign: "left" }}>Distribution:</Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}>{props.props.last}</Col>
            <Col span="4" style={{ textAlign: "left" }}>0 if: {props.props.token1}={props.props.zero1} $ and {props.props.token2}={props.props.zero2}$</Col>
            <Col span="4" style={{ textAlign: "left" }}>Optimal compounding time</Col>
            <Col span="4" style={{ textAlign: "left" }}>Average compounding time: {props.props.avgCompound} days</Col>
          </Row>
          <Row>
            <Col span="3" style={{ textAlign: "left" }}>
              <a href={props.props.liquidityLink} style={{ color: "#0000EE" }}>Add liquidity</a>
            </Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}>{props.props.distribution1} / {props.props.distribution2}</Col>
            <Col span="4" style={{ textAlign: "left" }}>{props.props.yieldToken} token / {props.props.yieldDollar} $</Col>
            <Col span="4" style={{ textAlign: "left" }}>IL alert: <Popover content={tgAlertPop} title="Telegram Alert" trigger="click"><BellFilled style={{ cursor: "pointer", fontSize: "1.5em" }} /></Popover></Col>
            <Col span="4" style={{ textAlign: "left", color: "rgb(242,193,51)" }}>{props.props.optimal} time a day</Col>
            <Col span="4" style={{ textAlign: "left" }}>Total paid fees: {props.props.totalFees} $</Col>
          </Row>
        </div>
        <div style={{ maxWidth: "50px", textAlign: "center", marginTop: "30px" }}><Popover content={securityPop} title="Telegram Alert" trigger="click"><BellFilled style={{ cursor: "pointer", fontSize: "2em" }} /></Popover></div>

      </div>
    </Card>
  );
};
