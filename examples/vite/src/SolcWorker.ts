import { SolcOutput } from '@evmts/solc'
import { z } from 'zod'

console.log('running worker...')

export type MessageResult = {
	success: boolean
	result: {
		data?: SolcOutput
		id: string
	}
	error?: string
}

const params = z.object({
	code: z.string(),
	id: z.string(),
})
// Solc is expensive to import expensive to compile and expensive to run
// Run it in a web worker so it always runs on a seperate thread
onmessage = async function (e) {
	const { code, id } = params.parse(e.data)

	const { solcCompile } = await import('@evmts/solc')
	try {
		const result = {
			data: solcCompile({
				language: 'Solidity',
				settings: {
					outputSelection: {
						'*': {
							'*': ['*'],
						},
					},
				},
				sources: {
					'contract.sol': {
						content: code,
					},
				},
			}),
			id,
		}
		postMessage({ success: true, result })
	} catch (error) {
		postMessage({
			success: false,
			result: { id },
			error: error instanceof Error ? error.message : error,
		})
	}
}
