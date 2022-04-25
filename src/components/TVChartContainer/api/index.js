import historyProvider from './historyProvider'
import axios from 'axios';

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]

const config = {
	supported_resolutions: supportedResolutions
};


async function getSymbolInfo(symbolName) {
	const queryParams = {symbol: symbolName}
	const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2NzNkM2M5NDdhZWIxOGI2NGU1OGUzZWRlMzI1NWZiZjU3NTI4NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vb3B0ZXN0ZXItODVmMDQiLCJhdWQiOiJvcHRlc3Rlci04NWYwNCIsImF1dGhfdGltZSI6MTY1MDgzMDQ3NywidXNlcl9pZCI6IlZnb3I3ODVhbUJZUlpEdjR2V2t2Z21wUGZhbzIiLCJzdWIiOiJWZ29yNzg1YW1CWVJaRHY0dldrdmdtcFBmYW8yIiwiaWF0IjoxNjUwODMwNDc3LCJleHAiOjE2NTA4MzQwNzcsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYmNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.E_Mrwh822kMw_lfrtlvsfaxzCbssEL31g1PEuKOU8U_FmrynwSotRQRMOCiSN_KOeqd1-LaGo5h4UVozYe7wXARvzh6l1oPgtsF2zhhefjrek8_7Z0JlguHt2h_zJbAfRF5Fph4PVtjJII4qPgC2rfpN5485Uztlc_v-fOzJfy_y72I_pc1pOTNn4pkR0ijTJpvit1jtPk97fTWDSnbdtf9dY6twu421PvSDDDCnk2L-RQ9cFbVEksQ1adPu2kCdp8-7jgjbIlV338N4drDKxPAXrJ_47-sUAeaoWNlCOA--VAqnRDdTBbECIM9Q7q5rU7iwDA0aVSXX4ELFfeyFmQ"
	var res = await axios.get(
		"http://localhost:8000/resolve_symbol", 
		{ 
			params: queryParams ,
			headers: {Authorization: `Bearer ${authToken}`,}
		}
	)
	return res.data
}

export default {
	onReady: (cb) => {
		console.log('=====onReady running')
		setTimeout(() => cb(config), 0)

	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log(`====Search Symbols running: ${userInput}, `)
	},
	resolveSymbol: async function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
		console.log('======resolveSymbol running')
		try {
			const symbol_info = await getSymbolInfo(symbolName)
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
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getMarks running')
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
