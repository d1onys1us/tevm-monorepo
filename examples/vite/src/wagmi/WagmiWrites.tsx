import { addresses } from '../addresses'
import { WagmiMintExample } from '../contracts/WagmiMintExample.sol'
import { getRandomInt } from '../utils/getRandomInt'
import {
	Address,
	mainnet,
	useAccount,
	useContractRead,
	useContractWrite,
	useQuery,
	useWaitForTransaction,
} from 'wagmi'
import { EVMts } from '@evmts/vm'

const createVm = () => EVMts.create({ fork: import.meta.env.VITE_RPC_URL_1 ?? mainnet.rpcUrls.public.http })

export const WagmiWrites = () => {
	const { data: vm } = useQuery(['EVMts.create'], createVm)
	const { address, isConnected } = useAccount()

	const { data, refetch } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...WagmiMintExample.read.balanceOf(address as Address),
		enabled: isConnected,
	})

	const { writeAsync: writeMint, data: mintData } = useContractWrite({
		address: addresses[420],
		/**
		 * Not calling the function will return abi and address without args
		 * This is useful for when you want to lazily call the function like in case of useContractWrite
		 */
		...WagmiMintExample.write.mint,
	})

	useWaitForTransaction({
		hash: mintData?.hash,
		onSuccess: (receipt) => {
			console.log('minted', receipt)
			refetch()
		},
	})

	const { data: optimisticBalance } = useQuery(['optimisticBalance', address], async () => {
		return vm?.runContractCall(WagmiMintExample.read.balanceOf(address as Address))
	})

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
					vm?.runContractCall(WagmiMintExample.write.mint(BigInt(getRandomInt())))
				}
			>
				Simulate Mint
			</button>
		</div>
	)
}
