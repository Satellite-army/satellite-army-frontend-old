import React from "react";
import "./../../App.less";
import { Menu } from "antd";
import {
  PieChartOutlined,
  GithubOutlined,
  BankOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HomeOutlined,
  RocketOutlined,
  ForkOutlined,
  UnorderedListOutlined,
  // LineChartOutlined,
  TwitterOutlined,
  WalletOutlined,
  LineChartOutlined,
  SmileOutlined
} from "@ant-design/icons";
import discordIcon from '../../assets/icon/discordIcon.png'
import telegramIcon from '../../assets/icon/telegramIcon.png'
import BasicLayout from "@ant-design/pro-layout";
import { AppBar } from "./../AppBar";
import { Link, useLocation } from "react-router-dom";
import { useConnectionConfig } from "../../contexts/connection";
import { LABELS } from "../../constants";
import config from "./../../../package.json";
import "./layout.less"
import { useHistory } from "react-router-dom";

export const AppLayout = React.memo((props: any) => {
  const { env } = useConnectionConfig();
  const location = useLocation();
  const history = useHistory();


  {/*
  const paths: { [key: string]: string } = {
    "/dashboard": "2",
    "/deposit": "3",
    "/borrow": "4",
    "/liquidate": "5",
    "/margin": "6",
    "/faucet": "7",
    "/transactions": "8",
  };
    */}

  const paths: { [key: string]: string } = {
    "/dashboard": "1",
    "/wallet": "2",
    "/farming": "3",
    "/analytics": "4",
  };

  const current =
    [...Object.keys(paths)].find((key) => location.pathname.startsWith(key)) ||
    "";
  const defaultKey = paths[current] || "1";
  const theme = "dark";

  console.log({current})
  console.log({defaultKey})

  if (current === "") {
    return props.children
  }

  const goToPresentation = () => {
    history.push("/");

  }

  return (
    <div className="App background-base ">
      <div className="Banner">
        <div className="Banner-description">{LABELS.AUDIT_WARNING}</div>
      </div>
      <BasicLayout
        title={LABELS.APP_TITLE}
        footerRender={() => (
          <div className="footer" title={LABELS.FOOTER}>
            {LABELS.FOOTER}
          </div>
        )}
        navTheme={theme}
        headerTheme={theme}
        theme={theme}
        layout="mix"
        fixSiderbar={true}
        primaryColor="#F2C133"
        logo={<div className="App-logo" onClick={goToPresentation} />}
        rightContentRender={() => <AppBar />}
        links={[]}
        menuContentRender={() => {
          return (
            <div className="links">
              <Menu
                theme={theme}
                defaultSelectedKeys={[defaultKey]}
                mode="inline"
              >
		{/*
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  <Link
                    to={{
                      pathname: "/",
                    }}
                  >
                    {LABELS.MENU_HOME}
                  </Link>
                </Menu.Item>
		  */}
                <Menu.Item key="2" icon={<PieChartOutlined />}>
                  <Link
                    to={{
                      pathname: "/dashboard",
                    }}
                    className={defaultKey === "1" ? "label-selected" : "label-primary"}
                  >
                    {LABELS.MENU_DASHBOARD}
                  </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<WalletOutlined />}>
                  <Link
                    to={{
                      pathname: "/wallet",
                    }}
                    className={defaultKey === "2" ? "label-selected" : "label-primary"}
                  >
                    {LABELS.MENU_WALLET}
                  </Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<RocketOutlined />}>
                  <Link
                    to={{
                      pathname: "/farming",
                    }}
                    className={defaultKey === "3" ? "label-selected" : "label-primary"}
                  >
                    {LABELS.MENU_FARMING}
                  </Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<LineChartOutlined />}>
                  <Link
                    to={{
                      pathname: "/analytics",
                    }}
                    className={defaultKey === "4" ? "label-selected" : "label-primary"}
                  >
                    {LABELS.MENU_ANALYTICS}
                  </Link>
                </Menu.Item>
		{/*
                <Menu.Item key="3" icon={<BankOutlined />}>
                  <Link
                    to={{
                      pathname: "/deposit",
                    }}
                  >
                    {LABELS.MENU_DEPOSIT}
                  </Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<LogoutOutlined />}>
                  <Link
                    to={{
                      pathname: "/borrow",
                    }}
                  >
                    {LABELS.MENU_BORROW}
                  </Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<ShoppingOutlined />}>
                  <Link
                    to={{
                      pathname: "/liquidate",
                    }}
                  >
                    {LABELS.MENU_LIQUIDATE}
                  </Link>
                </Menu.Item>
		*/}
                {/* Hide margin option for now  */}
                {/* <Menu.Item key="6"  onItemHover={() => {}}  icon={< LineChartOutlined/>}>
                <Link
                  to={{
                    pathname: "/margin",
                  }}
                >
                  {LABELS.MARGIN_TRADING}
                </Link>
              </Menu.Item> */}
                {env == "devnet" && (
                  <Menu.Item key="7" icon={<SmileOutlined />}>
                    <Link
                      to={{
                        pathname: "/faucet",
                      }}
                      className="label-primary"
                    >
                      {LABELS.MENU_FAUCET}
                    </Link>
                  </Menu.Item>
                )}
                {/*
                <Menu.Item key="8" icon={<UnorderedListOutlined />}>
                  <Link
                    to={{
                      pathname: "/transactions",
                    }}
                  >
                    {LABELS.MENU_TRANSACTION}
                  </Link>
                </Menu.Item>
		*/}
              </Menu>

              <Menu
                theme={theme}
                defaultSelectedKeys={[defaultKey]}
                selectable={false}
                mode="inline"
                className="bottom-links"
              >
                <Menu.Item key="16" icon={<TwitterOutlined />}>
                  <a
                    title="Twitter"
                    href={`https://twitter.com/ArmySatellite`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-primary"
                  >
                    Twitter
                  </a>
                </Menu.Item>
                <Menu.Item key="15" icon={<img src={discordIcon} style={{height: 15, width: 15, marginRight: 10}}/>}>
                  <a
                    title="Discord"
                    href={'https://discord.gg/tdX3kqEe'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-primary"
                  >
                    Discord
                  </a>
                </Menu.Item>
                <Menu.Item key="18" icon={<img src={telegramIcon} style={{height: 15, width: 15, marginRight: 10}}/>}>
                  <a
                    title="Telegram"
                    href={'https://telegram.me/satelliteArmyBot'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-primary"
                  >
                    Telegram Bot
                  </a>
                </Menu.Item>
                <Menu.Item key="17" icon={<GithubOutlined />}>
                  <a
                    title="Gtihub"
                    href={config.repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-primary"
                  >
                    Github
                  </a>
                </Menu.Item>
              </Menu>
            </div>
          );
        }}
      >
        {props.children}
      </BasicLayout>
    </div>
  );
});
