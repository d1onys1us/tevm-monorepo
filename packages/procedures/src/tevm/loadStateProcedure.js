import { loadStateHandler } from '@tevm/actions'
import { hexToBigInt } from 'viem'

/**
 * Creates a LoadState JSON-RPC Procedure for handling LoadState requests with Ethereumjs EVM
 * @param {import('@tevm/vm').TevmVm   } vm
 * @returns {import('@tevm/procedures-types').LoadStateJsonRpcProcedure}
 */
export const loadStateProcedure = (vm) => async (request) => {
	const {
		params: { state },
	} = request

	/**
	 * @type {import('@tevm/state').SerializableTevmState}
	 */
	const parsedState = {}

	for (const [k, v] of Object.entries(state)) {
		const { nonce, balance, storageRoot, codeHash } = v
		parsedState[k] = {
			...v,
			nonce: hexToBigInt(nonce),
			balance: hexToBigInt(balance),
			storageRoot: storageRoot,
			codeHash: codeHash,
		}
	}
	const { errors = [] } = await loadStateHandler(vm)({
		state: parsedState,
	})

	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').LoadStateError}*/ (
			errors[0]
		)
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_loadState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	} else {
		return {
			jsonrpc: '2.0',
			result: {},
			method: 'tevm_loadState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
}
