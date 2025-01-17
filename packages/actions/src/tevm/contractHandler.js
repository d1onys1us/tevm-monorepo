import { callHandler } from './callHandler.js'
import { Address, bytesToUnprefixedHex } from '@ethereumjs/util'
import { validateContractParams } from '@tevm/zod'
import {
	decodeErrorResult,
	decodeFunctionResult,
	encodeFunctionData,
	hexToBytes,
	isHex,
} from 'viem'

/**
 * Creates an ContractHandler for handling contract params with Ethereumjs EVM
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import("@tevm/actions-types").ContractHandler}
 */
export const contractHandler = (vm) => async (params) => {
	const errors = validateContractParams(/** @type any*/ (params))
	if (errors.length > 0) {
		return { errors, executionGasUsed: 0n, rawData: '0x' }
	}

	const contract = await vm.evm.stateManager.getContractCode(
		Address.fromString(params.to),
	)
	const precompile = vm.evm.precompiles.get(
		bytesToUnprefixedHex(hexToBytes(params.to)),
	)
	if (contract.length === 0 && !precompile) {
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [
				{
					_tag: 'InvalidRequestError',
					name: 'InvalidRequestError',
					message: `Contract at address ${params.to} does not exist`,
				},
			],
		}
	}

	let functionData
	try {
		functionData = encodeFunctionData(
			/** @type {any} */ ({
				abi: params.abi,
				functionName: params.functionName,
				args: params.args,
			}),
		)
	} catch (e) {
		/**
		 * @type {import('@tevm/errors').InvalidRequestError}
		 */
		const err = {
			name: 'InvalidRequestError',
			_tag: 'InvalidRequestError',
			message: /** @type {Error}*/ (e).message,
		}
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [err],
		}
	}

	const result = await callHandler(vm)({
		...params,
		data: functionData,
	})

	if (result.errors && result.errors.length > 0) {
		result.errors = result.errors.map((err) => {
			if (isHex(err.message) && err._tag === 'revert') {
				const decodedError = decodeErrorResult(
					/** @type {any} */ ({
						abi: params.abi,
						data: err.message,
						functionName: params.functionName,
					}),
				)
				return {
					...err,
					message: `Revert: ${decodedError.errorName} ${decodedError.args.join(
						', ',
					)}`,
				}
			}
			return err
		})
		return result
	}

	let decodedResult
	try {
		decodedResult = decodeFunctionResult(
			/** @type {any} */ ({
				abi: params.abi,
				data: result.rawData,
				functionName: params.functionName,
			}),
		)
	} catch (e) {
		/**
		 * @type {import('@tevm/errors').ContractError}
		 */
		const err = {
			name: 'DecodeFunctionDataError',
			_tag: 'DecodeFunctionDataError',
			message: /** @type {Error}*/ (e).message,
		}
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [err],
		}
	}

	return {
		.../** @type any */ (result),
		data: decodedResult,
	}
}
