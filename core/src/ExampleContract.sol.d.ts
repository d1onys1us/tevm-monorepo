import type { Address } from "abitype"

export declare const ExampleContract__Abi: [
  {
    "constant": false,
    "inputs": [{
      "name": "by",
      "type": "int256"
    }],
    "name": "incrementCounter",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCount",
    "outputs": [
      {
        "name": "",
        "type": "int256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "type": "event",
    "name": "Incremented",
    "inputs": [
      {
        "name": "by",
        "type": "int256",
        "indexed": false,
      }
    ],
  }
]

type ReadContractOptions = {
  readonly address?: Address
  readonly sender?: Address
  readonly chainId?: number
  readonly blockNumber?: number
  readonly blockTag?: 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'
}

type WriteContractOptions = {
  readonly address: Address
  readonly sender: Address
  readonly chainId: numberA
  // TODO
}

export declare class ExampleContract<TContractOptions extends ContractOptions> {
  static readonly json = ExampleContract__Abi
  static readonly abi = [
    'function getCount() view returns (int256)',
    'function incrementCounter(uint256 by)',
    'event Incremented(int256 by)',
  ] as const
  static readonly call: {
    readonly getCount: <TReadContractOptions extends ReadContractOptions>(options: TReadContractOptions) => {
      request: 'evmts_callContract'
      name: 'getCount'
      abi: readonly ['function getCount() view returns (int256)']
      inputs: readonly []
    } & TReadContractOptions
    readonly incrementCounter: (by: BigInt, options: WriteContractOptions) => {
      readonly request: 'evmts_write'
      readonly name: 'incrementCounter'
      readonly abi: readonly ['function incrementCounter(uint256 by)']
      readonly inputs: readonly [by: BigInt]
    }
  }
  static readonly estimateGas: {
    readonly getCount: () => {
      request: 'evmts_estimateGas'
      name: 'getCount'
      abi: readonly ['function getCount() view returns (int256)']
      inputs: readonly []
    }
    readonly incrementCounter: () => {
      readonly request: 'evmts_estimateGas'
      readonly name: 'incrementCounter'
      readonly abi: readonly ['function incrementCounter()']
      readonly inputs: readonly []
    }
  }
  static readonly eventFilter: {
    readonly Incremented: () => {
      readonly request: 'evmts_eventFilter'
      readonly name: 'Incremented'
      readonly abi: readonly ['event Incremented(int256 by)']
      readonly inputs: readonly []
    }
  }
  static readonly eventWatch: {
    readonly Incremented: () => {
      readonly request: 'evmts_eventWatch'
      readonly name: 'Incremented'
      readonly abi: readonly ['event Incremented(int256 by)']
      readonly inputs: readonly []
    }
  }
  static readonly eventGet: {
    readonly Incremented: () => {
      readonly request: 'evmts_eventGet'
      readonly name: 'Incremented'
      readonly abi: readonly ['event Incremented(int256 by)']
      readonly inputs: readonly []
    }
  }
} 
