import { NetworkId } from '../enums'

export function getNetworkIdFromNetworkName(networkName: string): NetworkId {
    switch (networkName) {
        case 'stardust-mainnet':
            return NetworkId.Iota
        case 'iota-alphanet':
        case 'iota-alphanet-2':
            return NetworkId.IotaTestnet
        case 'shimmer':
            return NetworkId.Shimmer
        case 'testnet':
        case 'testnet-1':
            return NetworkId.Testnet
        default:
            return NetworkId.Custom
    }
}
