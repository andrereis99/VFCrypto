/*
*
* Home
*
*/

import React from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { push } from "connected-react-router";
import { Icon } from "../../components";
import { setTitle } from "../../store/actions";
import { formatPrice, CURRENCIES } from '../../utils/utils';
import Strings from '../../utils/strings';

import './styles.scss';

export class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.state = {
			crypto: {},
		};
	}

	componentDidMount() {
        const { dispatch, match: { params} } = this.props;

		dispatch(setTitle(params.id));

		this.getCrypto();
		// Call every 60 seconds
		const intervalId = setInterval(this.getCrypto, 60000);
		this.setState({ intervalId });
	}
	
	componentWillUnmount() {
		setInterval(this.state.intervalId);
	}

	/**
	 * Call Crypto details endpoint
	 * @currencies USD,EUR,GBP,JPY,KRW
	 */
	getCrypto = () => {
		const { params } = this.props.match;

		axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${params.id}&tsyms=USD,EUR,GBP,JPY,KRW`).then((response) => {
			const crypto = response.data.RAW[params.id];

			this.setState({ crypto });
		});
	}

	render() {
		const { cryptoFullName, currency, dispatch, match: { params} } = this.props;
		
		const crypto = this.state.crypto?.[currency];

		if (!crypto) return <></>

		const currencySymbol = CURRENCIES.find(elem => elem.value === currency)?.label || '';

		return (
			<React.Fragment>
				<Helmet>
					<title>{`${cryptoFullName} (${params.id})`}</title>
					<meta name="Details" content="Crypto Deatils" />
				</Helmet>
				{/* Crypto page secondary header */}
				<div className="Page_Header">
					<div className="Page_Header_BackPath" onClick={() => dispatch(push('/'))}>
						<Icon name="back" />
						<span>{Strings.generic.list}</span>
					</div>
				</div>
				{/* Crypto content Screen */}
				<div className="ContentContainer" style={{ paddingTop: 0 }}>
					{/* Crypto name and price row */}
					<div
						key={`crypto_card_${cryptoFullName}_header`}
						className="CryptoContainer">
						<div className="Crypto_Data">
							<div className="Crypto_Data_Info" style={{ display: 'flex' }}>
								<img alt='' src={`https://www.cryptocompare.com${crypto.IMAGEURL}`} />
								<div className="Crypto_Header">
									<div className="Crypto_Name">
										{cryptoFullName}
									</div>
									<div className="Crypto_Short">
										{cryptoFullName}
									</div>
								</div>
							</div>
							<div className="Crypto_Data_Info">
								<div className="Crypto_Info_Title">
									{Strings.cryptos.price}
								</div>
								<div className="Crypto_Info">
									{formatPrice(crypto.PRICE, currencySymbol)}
								</div>
							</div>
						</div>
					</div>
					{/* Crypto info */}
					<div
						key={`crypto_card_${cryptoFullName}_info`}
						className="CryptoContainer">
						<div className="Crypto_Data">
							<div className="Crypto_Data_Info">
								<div className="Crypto_Info_Title">
									{Strings.cryptos.mktCap}
								</div>
								<div className="Crypto_Info">
									{formatPrice(crypto.MKTCAP, currencySymbol)}
								</div>
							</div>
							<div className="Crypto_Data_Info">
								<div className="Crypto_Info_Title">
									{Strings.cryptos.oneDayChange}
								</div>
								<div
									className="Crypto_Info"
									style={crypto.CHANGE24HOUR > 0 ?
										{ color: 'green' } :
										{ color: '#b51313' }}
									>
									{crypto.CHANGE24HOUR.toFixed(2)}%
									<div className={crypto.CHANGE24HOUR > 0 ? "Change24Indicator Rotate" : "Change24Indicator"}>
										<Icon
											className="rotate"
											name="baixa" />
									</div>
								</div>
							</div>
							<div className="Crypto_Data_Info">
								<div className="Crypto_Info_Title">
									{Strings.cryptos.supply}
								</div>
								<div className="Crypto_Info">
									{formatPrice(crypto.SUPPLY, params.id, true)}
								</div>
							</div>
							<div className="Crypto_Data_Info">
								<div className="Crypto_Info_Title">
									{Strings.cryptos.circulationSupply}
								</div>
								<div className="Crypto_Info">
									{formatPrice(crypto.CIRCULATINGSUPPLY, params.id, true)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state: any) => ({
	language: state.language || 'pt',
	currency: state.currency || 'EUR',
	cryptoFullName: state.router?.location?.state?.cryptoFullName,
});

export default connect(mapStateToProps)(Home);