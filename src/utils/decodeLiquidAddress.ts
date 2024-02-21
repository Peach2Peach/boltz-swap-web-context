import { address as liquidAddress, networks as liquidNetworks } from "liquidjs-lib";

export const decodeLiquidAddress = (addr: string, network: liquidNetworks.Network) => {
  // We always do this to validate the network
  const script = liquidAddress.toOutputScript(addr, network);

  // This throws for unconfidential addresses -> fallback to output script decoding
  try {
    const decoded = liquidAddress.fromConfidential(addr);

    return { script, blindingKey: decoded.blindingKey };
  } catch (e) { }

  return { script };
};
