import { networks as liquidNetworks } from "liquidjs-lib";

export type LiquidNetworkId = keyof typeof liquidNetworks;
export const getNetwork = (network: LiquidNetworkId) => liquidNetworks[network];
