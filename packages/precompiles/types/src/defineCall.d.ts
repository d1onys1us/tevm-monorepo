/// <reference types="node" />
import { EVMErrorMessage } from '@ethereumjs/evm';
import type { Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames } from 'abitype';
type Handler<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> = (params: {
    gasLimit: bigint;
    args: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>;
}) => Promise<{
    executionGasUsed: bigint;
    returnValue: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']>[0];
}>;
export declare const defineCall: <TAbi extends Abi>(abi: TAbi, handlers: { [TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<TAbi, TFunctionName>; }) => ({ data, gasLimit, }: {
    data: `0x${string}`;
    gasLimit: bigint;
}) => Promise<{
    executionGasUsed: bigint;
    returnValue: Uint8Array;
    exeptionEror?: never;
} | {
    executionGasUsed: bigint;
    returnValue: Buffer;
    exeptionEror: {
        message: string;
        error: EVMErrorMessage;
        errorType: string;
    };
}>;
export {};
//# sourceMappingURL=defineCall.d.ts.map