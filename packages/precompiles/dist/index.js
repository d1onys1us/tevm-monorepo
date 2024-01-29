import { Address } from '@ethereumjs/util';
import '@tevm/contract';
import { decodeFunctionData, hexToBytes, encodeEventTopics, encodeAbiParameters, encodeFunctionResult, toHex } from 'viem';
import { EvmError, EVMErrorMessage } from '@ethereumjs/evm';

// src/Precompile.ts
var Precompile = class {
  ethjsAddress = () => Address.fromString(this.contract.address);
  precompile = () => ({
    address: this.ethjsAddress(),
    function: (params) => {
      return this.call({ data: toHex(params.data), gasLimit: params.gasLimit });
    }
  });
};

// src/definePrecompile.ts
var definePrecompile = ({
  contract,
  call
}) => {
  const wrappedCall = call;
  class PrecompileImplementation extends Precompile {
    contract = contract;
    call = wrappedCall;
  }
  return new PrecompileImplementation();
};
var defineCall = (abi, handlers) => {
  return async ({
    data,
    gasLimit
  }) => {
    const d = decodeFunctionData({
      abi,
      data
    });
    const handler = handlers[d.functionName];
    try {
      const {
        returnValue,
        executionGasUsed,
        logs,
        error,
        blobGasUsed,
        selfdestruct
      } = await handler({
        gasLimit,
        args: d.args
      });
      return {
        executionGasUsed,
        ...error ? { exeptionError: error } : {},
        ...selfdestruct ? { selfdestruct } : {},
        ...blobGasUsed ? { blobGasUsed } : {},
        ...logs ? {
          logs: logs.map((log) => {
            const topics = encodeEventTopics({
              abi,
              eventName: log.name,
              args: log.inputs
            }).map((topics2) => hexToBytes(topics2));
            const eventItem = abi.find(
              (item) => item.type === "event" && item.name === log.name
            );
            if (!eventItem)
              throw new Error(`Event ${log.name} not found in ABI`);
            const data2 = encodeAbiParameters(eventItem.inputs, log.inputs);
            return [hexToBytes(log.address), topics, hexToBytes(data2)];
          })
        } : {},
        returnValue: hexToBytes(
          encodeFunctionResult({
            abi,
            functionName: d.functionName,
            result: returnValue
          })
        )
      };
    } catch (e) {
      return {
        executionGasUsed: BigInt(0),
        returnValue: Buffer.alloc(0),
        exceptionError: {
          ...new EvmError(EVMErrorMessage.REVERT),
          ...{
            message: typeof e === "string" ? e : e instanceof Error ? e.message : "unknown error"
          }
        }
      };
    }
  };
};

export { defineCall, definePrecompile };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map