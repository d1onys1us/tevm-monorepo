'use strict';

var util = require('@ethereumjs/util');
require('@tevm/contract');
var viem = require('viem');
var evm = require('@ethereumjs/evm');

// src/Precompile.ts
var Precompile = class {
  ethjsAddress = () => util.Address.fromString(this.contract.address);
  precompile = () => ({
    address: this.ethjsAddress(),
    function: (params) => {
      return this.call({ data: viem.toHex(params.data), gasLimit: params.gasLimit });
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
    const d = viem.decodeFunctionData({
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
            const topics = viem.encodeEventTopics({
              abi,
              eventName: log.name,
              args: log.inputs
            }).map((topics2) => viem.hexToBytes(topics2));
            const eventItem = abi.find(
              (item) => item.type === "event" && item.name === log.name
            );
            if (!eventItem)
              throw new Error(`Event ${log.name} not found in ABI`);
            const data2 = viem.encodeAbiParameters(eventItem.inputs, log.inputs);
            return [viem.hexToBytes(log.address), topics, viem.hexToBytes(data2)];
          })
        } : {},
        returnValue: viem.hexToBytes(
          viem.encodeFunctionResult({
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
          ...new evm.EvmError(evm.EVMErrorMessage.REVERT),
          ...{
            message: typeof e === "string" ? e : e instanceof Error ? e.message : "unknown error"
          }
        }
      };
    }
  };
};

exports.defineCall = defineCall;
exports.definePrecompile = definePrecompile;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map