import { EVMErrorMessage, EvmError } from '@ethereumjs/evm';
import { decodeFunctionData, encodeFunctionResult, hexToBytes } from 'viem';
export const defineCall = (abi, handlers) => {
    return async ({ data, gasLimit, }) => {
        const d = decodeFunctionData({
            abi: abi,
            data: data,
        });
        const handler = handlers[d.functionName];
        try {
            const { returnValue, executionGasUsed } = await handler({
                gasLimit: gasLimit,
                args: d.args,
            });
            return {
                executionGasUsed,
                returnValue: hexToBytes(encodeFunctionResult({
                    abi: abi,
                    functionName: d.functionName,
                    result: returnValue,
                })),
            };
        }
        catch (e) {
            return {
                executionGasUsed: BigInt(0),
                returnValue: Buffer.alloc(0),
                exeptionEror: {
                    ...new EvmError(EVMErrorMessage.REVERT),
                    message: typeof e === 'string' ? e : e instanceof Error ? e.message : 'unknown error'
                },
            };
        }
    };
};
