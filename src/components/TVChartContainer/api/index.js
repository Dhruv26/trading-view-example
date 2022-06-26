import historyProvider from './historyProvider'
import axios from 'axios';

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]

const config = {
	supported_resolutions: supportedResolutions
};


export default {
	onReady: (cb) => {
		console.log('=====onReady running')
		setTimeout(() => cb(config), 0)

	},
	searchSymbols: async function (userInput, exchange, symbolType, onResultReadyCallback) {
		console.log(`====Search Symbols running: ${userInput}, `)
		try {
			const candidates = await historyProvider.searchSymbolStr(userInput)
			onResultReadyCallback(candidates)
		} catch (error) {
			console.log(error)
		}
	},
	resolveSymbol: async function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
		console.log('======resolveSymbol running')
		try {
			const symbol_info = await historyProvider.getSymbolInfo(symbolName)
			onSymbolResolvedCallback(symbol_info)
		}
		catch (error) {
			console.log(error)
			onResolveErrorCallback("Unable to resolve symbol.")
		}
	},
	getBars: async function (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
		console.log('=====getBars running')

		try {
			const bars = await historyProvider.getBars(symbolInfo, resolution, periodParams)
			const noData = (bars.length == 0)
			console.log(`=============BARS`)
			console.log({bars, noData: noData})
			onHistoryCallback(bars, { noData: noData })
		}
		catch(err) {
			console.log({ err })
			onErrorCallback(err.message ? err.message : '')
		}
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getMarks running')
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		console.log('=====subscribeBars runnning')
	},
	unsubscribeBars: subscriberUID => {
		console.log('=====unsubscribeBars running')
	},
	/*
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		//optional
		console.log('=====calculateHistoryDepth running')
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
		return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		console.log('=====getServerTime running')
	}
	*/
}
