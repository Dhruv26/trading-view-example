// var rp = require('request-promise').defaults({json: true})
import axios from 'axios';

// No traik
const local_api = 'http://172.21.128.1:8000'
const opzen_api = 'https://api.opzen.io/api/v1/titan'
const api_root = local_api
const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2NzNkM2M5NDdhZWIxOGI2NGU1OGUzZWRlMzI1NWZiZjU3NTI4NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vb3B0ZXN0ZXItODVmMDQiLCJhdWQiOiJvcHRlc3Rlci04NWYwNCIsImF1dGhfdGltZSI6MTY1MDkyNjUyOSwidXNlcl9pZCI6IlZnb3I3ODVhbUJZUlpEdjR2V2t2Z21wUGZhbzIiLCJzdWIiOiJWZ29yNzg1YW1CWVJaRHY0dldrdmdtcFBmYW8yIiwiaWF0IjoxNjUwOTI2NTI5LCJleHAiOjE2NTA5MzAxMjksImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYmNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.IrdFAceadqSkHHSR9b1LGAWaBsxErI5jId6YAbKFcz0Yy0BZPcTsAKZ6Fy_7GRuEDRRn0GFQm1OLtE16kSmpde0dVn1rXBMDqakogPnM8v8hSJhE4NBixWa8vLTYVnWoaXHNIEDhOKzEvv8hGl8kW1wc8XAZyJE18JHxAcuF06vmziVVF4gOx77cm8K9gKvBv6mle8F3gy_v9cXL9F8EZH93pcNoVXC-Z8krYfH1dHVYSTKXIMjkx0Gm1kyp0Dsdyykzf66GZxzH5NYllcYyyNxdCIjWAb2Dyn3odvgSi6BTQqAl-1B2efwJztYaJq_ZShditeEAvXVUr08ZC-Spqw"

const history = {}

function get_payload(symbolInfo, resolution, periodParams) {
	return {
		"symbol_info": {
			"name": symbolInfo.name,
			"ticker": symbolInfo.ticker,
			"description": symbolInfo.description,
			"session": symbolInfo.session,
			"exchange": symbolInfo.exchange,
			"listed_exchange": symbolInfo.listed_exchange,
			"type": symbolInfo.type,
			"timezone": symbolInfo.timezone,
			"minmov": symbolInfo.minmov,
			"pricescale": symbolInfo.pricescale,
			"data_status": symbolInfo.data_status,
			"has_intraday": symbolInfo.has_intraday,
			"has_seconds": symbolInfo.has_seconds
		},
		"resolution": resolution,
		"period_params": {
			"from": periodParams.from,
			"count_back": periodParams.countBack,
			"to": periodParams.to,
			"first_data_request": periodParams.firstDataRequest
		}
	}
}

function get_marks_payload(symbolInfo, periodParams, tradeID) {
	return {
		"symbol_info": {
			"name": symbolInfo.name,
			"ticker": symbolInfo.ticker,
			"description": symbolInfo.description,
			"session": symbolInfo.session,
			"exchange": symbolInfo.exchange,
			"listed_exchange": symbolInfo.listed_exchange,
			"type": symbolInfo.type,
			"timezone": symbolInfo.timezone,
			"minmov": symbolInfo.minmov,
			"pricescale": symbolInfo.pricescale,
			"data_status": symbolInfo.data_status,
			"has_intraday": symbolInfo.has_intraday,
			"has_seconds": symbolInfo.has_seconds
		},
		"period_params": {
			"from": periodParams.from,
			"count_back": periodParams.countBack,
			"to": periodParams.to,
			"first_data_request": periodParams.firstDataRequest
		},
		"trade_id": tradeID
	}
}

export default {
	history: history,

    getBars: async function(symbolInfo, resolution, periodParams) {
		const payload = get_payload(symbolInfo, resolution, periodParams)
		try {
			var res = await axios.post(
				`${api_root}/get_bars`,
				payload,
				{
					headers: {Authorization: `Bearer ${authToken}`,}
				}
			)
			const new_bars = res.data
			return new_bars;
		}
		catch (error) {
			console.log(error)
			return []
		}
	},
	
	getSymbolInfo: async function(symbolName) {
		const queryParams = {symbol: symbolName}
		var res = await axios.get(
			`${api_root}/resolve_symbol`, 
			{ 
				params: queryParams ,
				headers: {Authorization: `Bearer ${authToken}`,}
			}
		)
		var symbolInfo = res.data
		if (symbolInfo['expiration_date'] == null) {
			delete symbolInfo['expiration_date'];
		}
		return symbolInfo
	},

	searchSymbolStr: async function (search_str) {
		const queryParams = { search_str: search_str }
		var res = await axios.get(`${api_root}/search_symbol`, {
			params: queryParams,
			headers: { Authorization: `Bearer ${authToken}` },
		})
		return res.data
	},

	get_marks: async function(symbolInfo) {
		const tradeID = 400
		const payload = get_marks_payload(symbolInfo, periodParams, tradeID)
		try {
			var res = await axios.post(
				`${api_root}/get_marks`,
				payload,
				{
					headers: {Authorization: `Bearer ${authToken}`,}
				}
			)
			const new_bars = res.data
			return new_bars;
		}
		catch (error) {
			console.log(error)
			return []
		}
	}
}
