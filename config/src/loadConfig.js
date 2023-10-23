import { getEvmtsConfigFromTsConfig } from './utils/getEvmtsConfigFromTsConfig.js'
import { loadFoundryConfig } from './utils/loadFoundryConfig.js'
import { loadTsConfig } from './utils/loadTsConfig.js'
import { logAllErrors } from './utils/logAllErrors.js'
import { mergeConfigs } from './utils/mergeConfigs.js'
import { withDefaults } from './utils/withDefaults.js'
import {
	all,
	catchTags,
	fail,
	flatMap,
	logDebug,
	tap,
	tapError,
} from 'effect/Effect'

/**
 * @typedef {import("./utils/loadTsConfig.js").LoadTsConfigError | import("./utils/getEvmtsConfigFromTsConfig.js").GetEvmtsConfigFromTsConfigError | import("./utils/loadFoundryConfig.js").LoadFoundryConfigError} LoadConfigErrorType
 */

/**
 * Error class for {@link defineConfig}
 */
export class LoadConfigError extends Error {
	/**
	 * @type {LoadConfigError['_tag']}
	 * @override
	 */
	name
	/**
	 * @type {LoadConfigErrorType['_tag']}
	 **/
	_tag
	/**
	 * @param {string} configFilePath
	 * @param {LoadConfigErrorType} underlyingError
	 **/
	constructor(configFilePath, underlyingError) {
		super(
			`${underlyingError._tag}: Unable load config from ${configFilePath}
${underlyingError.message}`,
			{ cause: underlyingError.cause },
		)
		this._tag = underlyingError._tag
		this.name = underlyingError._tag
	}
}

/**
 * Loads an EVMts config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadConfigError, import("./types.js").ResolvedCompilerConfig>}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {loadConfig} from '@evmts/config'
 *
 * runPromise(loadConfig('./tsconfig.json')).pipe(
 *   tap(config => console.log(config))
 * )
 * ```
 */
export const loadConfig = (configFilePath) => {
	const userConfigEffect = logDebug(
		`loadConfig: loading tsConfig at ${JSON.stringify(configFilePath)}`,
	).pipe(
		flatMap(() => loadTsConfig(configFilePath)),
		flatMap(getEvmtsConfigFromTsConfig),
	)
	const foundryConfigEffect = flatMap(userConfigEffect, (userConfig) => {
		return loadFoundryConfig(userConfig.foundryProject, configFilePath)
	})
	/**
	 * @param {LoadConfigErrorType} error
	 * @returns {import("effect/Effect").Effect<never, LoadConfigError, never>}
	 */
	const handleError = (error) => {
		return fail(new LoadConfigError(configFilePath, error))
	}
	return all([userConfigEffect, foundryConfigEffect]).pipe(
		tap(([userConfig, foundryConfig]) =>
			logDebug(
				`loadConfig: Config read CompilerConfigs ${JSON.stringify({
					userConfig,
					foundryConfig,
				})}`,
			),
		),
		flatMap(mergeConfigs),
		tap((mergedConfigs) =>
			logDebug(
				`defineConfig: Config read CompilerConfigs ${JSON.stringify({
					mergedConfigs,
				})}`,
			),
		),
		flatMap(withDefaults),
		tapError(logAllErrors),
		catchTags({
			ConfigFnThrowError: handleError,
			FailedToReadConfigError: handleError,
			FoundryConfigError: handleError,
			FoundryNotFoundError: handleError,
			InvalidConfigError: handleError,
			InvalidRemappingsError: handleError,
			NoPluginFoundError: handleError,
			ParseJsonError: handleError,
		}),
		tap((config) =>
			logDebug(`loadConfig: Config loaded ${JSON.stringify({ config })}`),
		),
	)
}
