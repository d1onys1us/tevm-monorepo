**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TransactionReceiptResult

# Type alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blockHash

> **`readonly`** **blockHash**: [`Hex`](Hex.md)

### blockNumber

> **`readonly`** **blockNumber**: [`Hex`](Hex.md)

### contractAddress

> **`readonly`** **contractAddress**: [`Hex`](Hex.md)

### cumulativeGasUsed

> **`readonly`** **cumulativeGasUsed**: [`Hex`](Hex.md)

### from

> **`readonly`** **from**: [`Hex`](Hex.md)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](Hex.md)

### logs

> **`readonly`** **logs**: readonly [`FilterLog`](FilterLog.md)[]

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](Hex.md)

### status

> **`readonly`** **status**: [`Hex`](Hex.md)

### to

> **`readonly`** **to**: [`Hex`](Hex.md)

### transactionHash

> **`readonly`** **transactionHash**: [`Hex`](Hex.md)

### transactionIndex

> **`readonly`** **transactionIndex**: [`Hex`](Hex.md)

## Source

[common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TransactionReceiptResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
