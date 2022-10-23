import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";

function Login() {
  return (
    <div>
      <h1>Lottery</h1>
      <h2>Get Started By Logging in with your wallet</h2>
      <div style={{ width: "200px" }}>
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Login;
