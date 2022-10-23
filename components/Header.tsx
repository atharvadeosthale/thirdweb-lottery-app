import React from "react";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";

function Header() {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <header>
      <div>
        <h1>Lottery</h1>
        <p>
          {" "}
          User: {address?.substring(0, 5)}...
          {address?.substring(address.length, address.length - 5)}{" "}
        </p>
      </div>

      <div>
        <button onClick={disconnect}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
