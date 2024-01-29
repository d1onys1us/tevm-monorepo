import * as _ethereumjs_evm from '@ethereumjs/evm';
import { ExecResult } from '@ethereumjs/evm';
import { Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiEvents, Address, ExtractAbiFunctionNames } from 'abitype';
import * as _tevm_contract from '@tevm/contract';
import { Script } from '@tevm/contract';
import { Address as Address$1 } from '@ethereumjs/util';
import { Hex } from 'viem';

/**
 * Infers the the first argument of a class
 */
type ConstructorArgument<T> = T extends new (...args: infer P) => any ? P[0] : never;

/**
 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM
 */
type CustomPrecompile = Exclude<Exclude<ConstructorArgument<typeof _ethereumjs_evm.EVM>, undefined>['customPrecompiles'], undefined>[number];

type TypedError<TName extends string> = {
    _tag: TName;
    name: TName;
    message: string;
};

/**
 * A result of a precompile javascript call
 */
type CallResult<TAbi extends Abi, TFunctionName extends string> = {
    /**
     * The amount of gas used during execution.
     */
    executionGasUsed: bigint;
    /**
     * The return value of the call. Required even on exceptions
     */
    returnValue: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']>[0];
    /**
     * Any Error thrown during execution
     */
    error?: TypedError<string>;
    /**
     * Logs emitted during contract execution.
     * Logs must match the interface of the ABI
     */
    logs?: ReadonlyArray<ExtractAbiEvents<TAbi> & {
        address: Address;
    }>;
    /**
     * A set of accounts to selfdestruct
     */
    selfdestruct?: Set<Address>;
    /**
     * Amount of blob gas consumed by the transaction
     */
    blobGasUsed?: bigint;
};

/**
 * A precompile is a contract that is deployed at a specific address but runs JavaScript code instead of EVM code.
 * It is constructed via a Tevm {@link Script} and a JavaScript function that implements the precompile.
 * @example
 * import { defineCall, definePrecompile } from '@tevm/precompiles'
 * import { Fs } from './Fs.s.sol'
 *
 * export const fsPrecompile = definePrecompile({
 * 	contract:
 * 		Fs.withAddress(
 * 			`0x${'f2'.repeat(20)}`,
 * 		'),
 * 	call: defineCall(Fs.abi, {
 * 		readFile: async ({ args }) => {
 * 			return {
 * 				returnValue: await fs.readFile(...args, 'utf8'),
 * 				executionGasUsed: 0n,
 * 			}
 * 		},
 * })
 */
declare abstract class Precompile<TName extends string, THumanReadableAbi extends readonly string[], TContract extends ReturnType<Script<TName, THumanReadableAbi>['withAddress']> = ReturnType<Script<TName, THumanReadableAbi>['withAddress']>> {
    /**
     *
     */
    abstract readonly contract: TContract;
    protected readonly ethjsAddress: () => Address$1;
    readonly precompile: () => {
        address: Address$1;
        function: (params: {
            data: Uint8Array;
            gasLimit: bigint;
        }) => Promise<ExecResult>;
    };
    abstract readonly call: (context: {
        data: Hex;
        gasLimit: bigint;
    }) => Promise<ExecResult>;
}

declare const definePrecompile: <TName extends string, THumanReadableAbi extends readonly string[]>({ contract, call, }: Pick<Precompile<TName, THumanReadableAbi, ReturnType<(<TAddress extends `0x${string}`>(address: TAddress) => Omit<Script<TName, THumanReadableAbi>, "events" | "read" | "write" | "address"> & {
    address: TAddress;
    events: _tevm_contract.EventActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    read: _tevm_contract.ReadActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    write: _tevm_contract.WriteActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
})>>, "contract" | "call">) => Precompile<TName, THumanReadableAbi, ReturnType<(<TAddress extends `0x${string}`>(address: TAddress) => Omit<Script<TName, THumanReadableAbi>, "events" | "read" | "write" | "address"> & {
    address: TAddress;
    events: _tevm_contract.EventActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    read: _tevm_contract.ReadActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    write: _tevm_contract.WriteActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
})>>;

type Handler<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> = (params: {
    gasLimit: bigint;
    args: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>;
}) => Promise<CallResult<TAbi, TFunctionName>>;
declare const defineCall: <TAbi extends Abi>(abi: TAbi, handlers: { [TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<TAbi, TFunctionName>; }) => ({ data, gasLimit, }: {
    data: `0x${string}`;
    gasLimit: bigint;
}) => Promise<ExecResult>;

export { type CallResult, type ConstructorArgument, type CustomPrecompile, type TypedError, defineCall, definePrecompile };
