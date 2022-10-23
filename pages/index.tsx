import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import {
  useContract,
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import Login from "../components/Login";
import { useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import CountdownTimer from "../components/CountdownTimer";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const address = useAddress();
  const [quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS,
    "custom"
  );
  const { data: expiration } = useContractRead(contract, "expiration");
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  );
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { mutateAsync: buyTickets } = useContractWrite(contract, "BuyTickets");
  const { mutateAsync: withdrawWinnings } = useContractWrite(
    contract,
    "WithdrawWinnings"
  );
  const { mutateAsync: withdrawCommission } = useContractWrite(
    contract,
    "WithdrawCommission"
  );
  const { mutateAsync: drawWinnerTicket } = useContractWrite(
    contract,
    "DrawWinnerTicket"
  );
  const { mutateAsync: refundAll } = useContractWrite(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractWrite(
    contract,
    "restartDraw"
  );

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      await buyTickets([
        {
          value: ethers.utils.parseEther((0.01 * quantity).toString()),
        },
      ]);
      toast.success("Tickets purchased successfuly", {
        id: notification,
      });
    } catch (err) {
      console.error(err);
      toast.error("Whoops something went wrong", {
        id: notification,
      });
    }
  };

  const claimWinnings = async () => {
    const notification = toast.loading("Claiming winnings...");
    try {
      await withdrawWinnings([]);
      toast.success("Winnings claimed successfully!", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: notification });
    }
  };

  const drawWinner = async () => {
    const notification = toast.loading("Drawing winner...");
    try {
      await drawWinnerTicket([]);
      toast.success("Winner drawn successfully!", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: notification });
    }
  };

  const claimCommission = async () => {
    const notification = toast.loading("Claiming commission...");
    try {
      await withdrawCommission([]);
      toast.success("Commission withdrawn successfully!", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: notification });
    }
  };

  const refund = async () => {
    const notification = toast.loading("Refunding everyone...");
    try {
      await refundAll([]);
      toast.success("Everyone was refunded!", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: notification });
    }
  };

  const restart = async () => {
    const notification = toast.loading("Restarting draw...");
    try {
      await restartDraw([]);
      toast.success("Winner drawn successfully!", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: notification });
    }
  };

  if (!address) return <Login />;

  return (
    <div className="">
      <Head>
        <title>Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? (
        "Loading"
      ) : (
        <>
          <Header />
          <div>
            <div>
              <h1>The Next Draw</h1>
              <div>
                <div>
                  <h2>Last winner</h2>
                  <p>{lastWinner || "No winner"}</p>
                  <h2>Total Poool</h2>
                  <p>
                    {currentWinningReward &&
                      ethers.utils.formatEther(
                        currentWinningReward?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
                <div>
                  <h2>Tickets Remaining</h2>
                  <p>{remainingTickets?.toNumber()}</p>
                </div>
              </div>
              <div>
                <CountdownTimer />
              </div>
            </div>
            <div>
              <div>
                <div>
                  <h2>Price Per Ticket</h2>
                  <p style={{ fontWeight: "bold" }}>
                    {ticketPrice &&
                      ethers.utils.formatEther(ticketPrice?.toString())}{" "}
                    {currency}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                  <p>TICKETS</p>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", gap: "30px" }}>
                    <p>Total cost of tickets</p>
                    <p>
                      {ticketPrice &&
                        Number(
                          ethers.utils.formatEther(ticketPrice?.toString())
                        ) * quantity}{" "}
                      {currency}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "30px" }}>
                    <p>Service Fees</p>
                    <p>
                      {ticketCommission &&
                        ethers.utils.formatEther(
                          ticketCommission?.toString()
                        )}{" "}
                      {currency}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "30px" }}>
                    <p>Network Fees</p>
                    <p>TBC</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "200px",
                  }}
                >
                  <button
                    disabled={
                      expiration?.toString() < Date.now().toString() ||
                      remainingTickets?.toNumber() === 0
                    }
                    onClick={handleClick}
                  >
                    Buy Tickets
                  </button>
                  <button onClick={claimWinnings}>Claim any winnings</button>
                  <button onClick={drawWinner}>Owner only - draw winner</button>
                  <button onClick={claimCommission}>
                    Owner only - claim commission
                  </button>
                  <button onClick={refund}>Owner only - refund everyone</button>
                  <button onClick={restart}>Owner only - restart draw</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
