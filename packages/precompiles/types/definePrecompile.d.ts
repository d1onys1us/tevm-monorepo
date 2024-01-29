import { Precompile } from './Precompile.js';
import type { Script } from '@tevm/contract';
export declare const definePrecompile: <TName extends string, THumanReadableAbi extends readonly string[]>({ contract, call, }: Pick<Precompile<TName, THumanReadableAbi, ReturnType<(<TAddress extends `0x${string}`>(address: TAddress) => Omit<Script<TName, THumanReadableAbi>, "events" | "read" | "write" | "address"> & {
    address: TAddress;
    events: import("@tevm/contract").EventActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    read: import("@tevm/contract").ReadActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    write: import("@tevm/contract").WriteActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
})>>, "contract" | "call">) => Precompile<TName, THumanReadableAbi, ReturnType<(<TAddress extends `0x${string}`>(address: TAddress) => Omit<Script<TName, THumanReadableAbi>, "events" | "read" | "write" | "address"> & {
    address: TAddress;
    events: import("@tevm/contract").EventActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    read: import("@tevm/contract").ReadActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
    write: import("@tevm/contract").WriteActionCreator<THumanReadableAbi, `0x${string}`, `0x${string}`, TAddress>;
})>>;
//# sourceMappingURL=definePrecompile.d.ts.map