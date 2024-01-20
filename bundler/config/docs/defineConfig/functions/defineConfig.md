**@tevm/config** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [defineConfig](../README.md) > defineConfig

# Function: defineConfig()

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

▪ **configFactory**: [`ConfigFactory`](../../types/type-aliases/ConfigFactory.md)

## Returns

> ### configFn
>
> > **configFn**: (`configFilePath`) => `Effect`\<`never`, [`DefineConfigError`](../classes/DefineConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>
>
> #### Parameters
>
> ▪ **configFilePath**: `string`
>

## Example

```ts
import { defineConfig } from '@tevm/ts-plugin'

export default defineConfig(() => ({
	lib: ['lib'],
	remappings: {
	  'foo': 'foo/bar'
	}
})
```

## Source

[bundler/config/src/types.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/types.ts#L84)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)