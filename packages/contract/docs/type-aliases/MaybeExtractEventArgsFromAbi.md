**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MaybeExtractEventArgsFromAbi

# Type alias: MaybeExtractEventArgsFromAbi`<TAbi, TEventName>`

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` extends `Abi` \| readonly `unknown`[] ? `TEventName` extends `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] \| `undefined` |
| `TEventName` extends `string` \| `undefined` |

## Source

[packages/contract/src/event/EventActionCreator.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
