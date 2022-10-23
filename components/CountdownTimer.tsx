import React from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import Countdown from "react-countdown";

type Props = {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

function CountdownTimer() {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: expiration, isLoading: isLoadingExpiration } = useContractRead(
    contract,
    "expiration"
  );

  const renderer = ({ hours, minutes, seconds, completed }: Props) => {
    if (completed) {
      return (
        <div>
          <h2>Ticket Sales have now CLOSED for this draw!</h2>

          <div style={{ display: "flex", gap: "50px" }}>
            <div>
              <div>{hours}</div>
              <div>hours</div>
            </div>

            <div>
              <div>{minutes}</div>
              <div>minutes</div>
            </div>

            <div className="flex-1">
              <div>{seconds}</div>
              <div>seconds</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Time Remaining</h3>
          <div>
            <div>
              <div>{hours}</div>
              <div>hours</div>
            </div>

            <div>
              <div>{minutes}</div>
              <div>minutes</div>
            </div>

            <div>
              <div>{seconds}</div>
              <div>seconds</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>
  );
}

export default CountdownTimer;
