import { Address } from '@ethereumjs/util';
import {} from '@tevm/contract';
import { toHex } from 'viem';
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
export class Precompile {
    ethjsAddress = () => Address.fromString(this.contract.address);
    precompile = () => ({
        address: this.ethjsAddress(),
        function: (params) => {
            return this.call({ data: toHex(params.data), gasLimit: params.gasLimit });
        },
    });
}
