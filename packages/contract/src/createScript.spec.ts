import { createScript } from './createScript.js'
import { dummyAbi } from './test/fixtures.js'
import { formatAbi, parseAbi } from 'abitype'
import { describe, expect, it } from 'vitest'

describe(createScript.name, () => {
	const contract = createScript({
		humanReadableAbi: formatAbi(dummyAbi),
		name: 'DummyContract',
		bytecode: '0x420',
		deployedBytecode: '0x69',
	})

	it('should have correct bytecode', () => {
		expect(contract.bytecode).toBe('0x420')
		expect(contract.deployedBytecode).toBe('0x69')
	})
	it('should have correct name', () => {
		expect(contract.name).toBe('DummyContract')
	})

	it('should contain the ABI', () => {
		expect(contract.abi).toEqual(parseAbi(formatAbi(dummyAbi)))
	})

	it('should generate human readable ABI', () => {
		expect(contract.humanReadableAbi).toBeDefined()
	})

	it('should contain read', () => {
		// see ./read for more tests
		expect(contract.read).toMatchInlineSnapshot(`
			{
			  "exampleRead": [Function],
			  "exampleReadNoArgs": [Function],
			  "exampleWrite": [Function],
			  "overloadedRead": [Function],
			  "overloadedWrite": [Function],
			}
		`)
	})

	it('should contain write', () => {
		// see ./write for more tests
		expect(contract.write).toMatchInlineSnapshot(`
			{
			  "exampleRead": [Function],
			  "exampleReadNoArgs": [Function],
			  "exampleWrite": [Function],
			  "overloadedRead": [Function],
			  "overloadedWrite": [Function],
			}
		`)
	})

	it('should contain events', () => {
		// see ./events for more tests
		expect(contract.events).toMatchInlineSnapshot(`
			{
			  "exampleEvent": [Function],
			}
		`)
	})

	it('should be able to read write and event with an address', () => {
		expect(
			contract
				.withAddress(`0x${'a'.repeat(40)}`)
				.write.exampleWrite('hello', 2n),
		).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [
			        {
			          "name": "str",
			          "type": "string",
			        },
			        {
			          "name": "num",
			          "type": "uint256",
			        },
			      ],
			      "name": "exampleWrite",
			      "outputs": [
			        {
			          "type": "string",
			        },
			      ],
			      "stateMutability": "payable",
			      "type": "function",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "args": [
			    "hello",
			    2n,
			  ],
			  "bytecode": "0x420",
			  "deployedBytecode": "0x69",
			  "functionName": "exampleWrite",
			  "humanReadableAbi": [
			    "function exampleWrite(string str, uint256 num) payable returns (string)",
			  ],
			}
		`)
		expect(
			contract.withAddress(`0x${'a'.repeat(40)}`).read.exampleRead('hello', 2n),
		).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [
			        {
			          "name": "str",
			          "type": "string",
			        },
			        {
			          "name": "num",
			          "type": "uint256",
			        },
			      ],
			      "name": "exampleRead",
			      "outputs": [
			        {
			          "type": "string",
			        },
			      ],
			      "stateMutability": "pure",
			      "type": "function",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "args": [
			    "hello",
			    2n,
			  ],
			  "bytecode": "0x420",
			  "deployedBytecode": "0x69",
			  "functionName": "exampleRead",
			  "humanReadableAbi": [
			    "function exampleRead(string str, uint256 num) pure returns (string)",
			  ],
			}
		`)
		expect(
			contract.withAddress(`0x${'a'.repeat(40)}`).events.exampleEvent({}),
		).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [
			        {
			          "name": "data",
			          "type": "string",
			        },
			      ],
			      "name": "exampleEvent",
			      "type": "event",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "bytecode": "0x420",
			  "deployedBytecode": "0x69",
			  "eventName": "exampleEvent",
			  "humanReadableAbi": [
			    "event exampleEvent(string data)",
			  ],
			}
		`)
	})
})
