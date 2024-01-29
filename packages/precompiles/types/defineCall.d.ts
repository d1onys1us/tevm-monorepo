import type { CallResult } from './CallResult.js';
import { type ExecResult } from '@ethereumjs/evm';
import type { Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames } from 'abitype';
type Handler<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> = (params: {
    gasLimit: bigint;
    args: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>;
}) => Promise<CallResult<TAbi, TFunctionName>>;
export declare const defineCall: <TAbi extends Abi>(abi: TAbi, handlers: { [TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<TAbi, TFunctionName>; }) => ({ data, gasLimit, }: {
    data: `0x${string}`;
    gasLimit: bigint;
}) => Promise<ExecResult>;
export {};
//# sourceMappingURL=defineCall.d.ts.map