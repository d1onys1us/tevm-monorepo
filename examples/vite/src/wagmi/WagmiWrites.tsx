import { createMemoryClient } from '@tevm/memory-client'
import {
	Address,
	mainnet,
	useAccount,
	useContractRead,
	useContractWrite,
	useQuery,
	useWaitForTransaction,
} from 'wagmi'
import { addresses } from '../addresses'
import { WagmiMintExample } from '../contracts/WagmiMintExample.sol'
import { getRandomInt } from '../utils/getRandomInt'

const createVm = () =>
	createMemoryClient({
		fork: {url: import.meta.env.VITE_RPC_URL_1 ?? mainnet.rpcUrls.public.http[0]},
	})

export const WagmiWrites = () => {
	const { data: vm } = useQuery(['EVMts.create'], createVm)
	const { address, isConnected } = useAccount()

	const contract = WagmiMintExample.withAddress(addresses[420])

	const { data, refetch } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...contract.read.balanceOf(address as Address),
		enabled: isConnected,
	})

	const { writeAsync: writeMint, data: mintData } = useContractWrite({
		address: addresses[420],
		/**
		 * Not calling the function will return abi and address without args
		 * This is useful for when you want to lazily call the function like in case of useContractWrite
		 */
		...contract.write.mint,
	})

	useWaitForTransaction({
		hash: mintData?.hash,
		onSuccess: (receipt) => {
			console.log('minted', receipt)
			refetch()
		},
	})

	const { data: optimisticBalance } = useQuery(
		['optimisticBalance', address],
		async () => {
			return vm?.contract(
				contract.read.balanceOf(address as Address),
			)
		},
	)

	return (
		<div>
			<div>
				<div>balance: {data?.toString()}</div>
			</div>
			<button
				type='button'
				onClick={() =>
					writeMint(WagmiMintExample.write.mint(BigInt(getRandomInt())))
				}
			>
				Mint
			</button>
			<div>
				<div>Optimistic balance: {data?.toString()}</div>
			</div>
			<button
				type='button'
				onClick={() =>
					vm?.runContractCall(
						WagmiMintExample.write.mint(BigInt(getRandomInt())),
					)
				}
			>
				Simulate Mint
			</button>
		</div>
	)
}
