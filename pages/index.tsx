import type { NextPage } from "next";
import Head from "next/head";
import Booth, { Ticket } from "../components/Booth";
import Connect from "../components/Connect";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Krause House Ticket Exchange</title>
        <meta
          name="description"
          content="Upgrade your Krause House Ticket NFTs to V2"
        />

        <meta property="og:title" content="Krause House Ticket Exchange" />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content="Krause House Ticket Exchange" />
        <meta property="og:image" content={"/favicon.png"} />
        <meta property="twitter:image" content={"/favicon.png"} />
        <meta
          property="og:description"
          content="Exchange your OG Krause House Ticket for our new V2 🏀"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@KrauseHouseDAO" />

        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/fonts/SKCuber-ExpandedRounded.ttf" />
      </Head>

      <main className="">
        <img
          src={"/city.png"}
          alt=""
          className="absolute left-0 top-0 w-screen h-screen object-cover z-0"
        />
        <div className="relative h-screen flex justify-center">
          <img
            src={"/ticketexchange.gif"}
            className="absolute object-cover max-h-screen mx-auto bottom-0 min-w-[1450px] w-[1450px]"
          />
          <div className="absolute mx-auto left-0 right-0 bottom-0 flex flex-col justify-center items-center gap-4">
            <div className="font-vibes text-lg">
              Select your ticket to upgrade
            </div>
            <div className="flex gap-x-24 justify-center items-center">
              <Booth className="" type={Ticket.UpperLevel} />
              <Booth className="" type={Ticket.ClubLevel} />
              <Booth className="" type={Ticket.Courtside} />
            </div>
          </div>
          <div className="px-8 w-full h-32 flex justify-between items-center absolute top-0">
            <img src={"/logo.png"} className="w-32" />
            <Connect />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
