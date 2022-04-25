// var rp = require('request-promise').defaults({json: true})
import axios from 'axios';

const api_root = 'https://min-api.cryptocompare.com'
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

export default {
	history: history,

    getBars: async function(symbolInfo, resolution, periodParams) {
		const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2NzNkM2M5NDdhZWIxOGI2NGU1OGUzZWRlMzI1NWZiZjU3NTI4NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vb3B0ZXN0ZXItODVmMDQiLCJhdWQiOiJvcHRlc3Rlci04NWYwNCIsImF1dGhfdGltZSI6MTY1MDgzODk1NiwidXNlcl9pZCI6IlZnb3I3ODVhbUJZUlpEdjR2V2t2Z21wUGZhbzIiLCJzdWIiOiJWZ29yNzg1YW1CWVJaRHY0dldrdmdtcFBmYW8yIiwiaWF0IjoxNjUwODM4OTU2LCJleHAiOjE2NTA4NDI1NTYsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYmNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.H3mXFPQCebl6KunIybKHhvqGM-UgijMOgAue9s3iKjNmQRR9kntvv5OQdeCwWVNaKe82Vu4OjPxIyjk5yuv7JsTWXWbvCc5H74bAjF9ccy_xMhDkxUM87PKXQh7lTNlfK7GwLGfbDIbSVFcW3ASTpFqG9E_50mPQw7qX1sJv8gtoYOEJLIB6nRu9yRAFvkXGWudT_QB7-ksTmwAXNpm9P-_yqCy3YX0Hmst1Vk_H65LLcpRJcxBdnR4mqWyKB3fIFjXYqe2dLSoivuwqr8cEZvy6syztdLGjOzkj3dqUd6KARIziY66chPOtUjyploch_L8gzBjQpVjiRTCz8ep_qw"
		const payload = get_payload(symbolInfo, resolution, periodParams)
		try {
			var res = await axios.post(
				"http://localhost:8000/get_bars",
				payload,
				{
					headers: {Authorization: `Bearer ${authToken}`,}
				}
			)
			const new_bars = res.data

			const from = periodParams.from 
			const to = periodParams.to
			const first = periodParams.firstDataRequest
			const limit = periodParams.countBack

			var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
			const qs = {
				e: split_symbol[0],
				fsym: split_symbol[1],
				tsym: split_symbol[2],
				toTs:  periodParams.to ? periodParams.to : '',
				limit: periodParams.countBack ? periodParams.countBack : 2000,
			}

			const data = await axios.get(`${api_root}${url}`, { params: qs });
			if (data.Response && data.Response === 'Error') {
				console.log('CryptoCompare API error:', data.Message);
				return [];
			}
			let resp_json = data.data.Data;
			if (resp_json.length) {
				var bars = resp_json.map(el => {
					return {
						time: el.time * 1000,
						low: el.low,
						high: el.high,
						open: el.open,
						close: el.close,
						volume: el.volumefrom
					};
				});
				if (first) {
					var lastBar = bars[bars.length - 1];
					history[symbolInfo.name] = { lastBar: lastBar };
				}

				return new_bars;
			} else {
				return [];
			}
		}
		catch (error) {
			console.log(error)
		}
	}
}
