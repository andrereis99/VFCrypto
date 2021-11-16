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
			cryptos: [],
			isMobile: window.innerWidth <= 768,
		};
		
		window.addEventListener("resize", this.handleResize);
	}

	componentDidMount() {
        const { dispatch } = this.props;

        dispatch(setTitle('VFCrypto'));

		this.getCryptos();
		// Call every 60 seconds
		const intervalId = setInterval(this.getCryptos, 60000);
		this.setState({ intervalId });
	}

	componentDidUpdate(newProps: any) {
		const { currency } = this.props;

		// Call endpoint every time that user change currency
		// This endpoint only allow one currency value at a time
		if (currency !== newProps.currency) {
			this.getCryptos();
		}
	}
	
	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
		setInterval(this.state.intervalId);
	}

	/**
	 * Verify if divice has a mobile screen on resize it
	 */
	handleResize = () => {
		this.setState({
			isMobile: window.innerWidth <= 768,
		});
	}

	/**
	 * Call Top 10 Cryptos endpoint
	 */
	getCryptos = () => {
		axios.get(`https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=${this.props.currency}`).then((response) => {
			const cryptos = response.data.Data.map((elem: any) => ({
				Id: elem.CoinInfo.Id,
				Name: elem.CoinInfo.Name,
				FullName: elem.CoinInfo.FullName,
				ImageUrl: elem.CoinInfo.ImageUrl,
				RAW: elem.RAW
			}));

			this.setState({ cryptos });
		});
	}

	render() {
		const { cryptos, isMobile } = this.state;
		const { currency, dispatch } = this.props;
		
		const currencySymbol = CURRENCIES.find(elem => elem.value === currency)?.label || '';

		return (
			<React.Fragment>
				<Helmet>
					<title>{'VFCrypto'}</title>
					<meta name="List" content="Cryptos List" />
				</Helmet>
				<div className="ContentContainer">
					{!isMobile ? <div className="Crypto_Row" style={{ padding: '0 35px' }}>
						{cryptos ? <>
							<div className="Crypto_Info_Column" style={{ fontWeight: 'bold' }}>
								{Strings.cryptos.header}
							</div>
							<div className="Crypto_Info_Column" style={{ fontWeight: 'bold' }}>
								{Strings.cryptos.price}
							</div>
							<div className="Crypto_Info_Column" style={{ fontWeight: 'bold' }}>
								{Strings.cryptos.mktCap}
							</div>
							<div className="Crypto_Info_Column" style={{ fontWeight: 'bold' }}>
								{Strings.cryptos.oneDayChange}
							</div>
						</> : null}
					</div> : null}
					{cryptos.map((crypto: any) => {
						if (!crypto.RAW) return <></>;
						return <div
							key={`crypto_card_${crypto.Name}`}
							className="CryptoCard"
							onClick={() => dispatch(push(`/cryptos/${crypto.Name}`, { cryptoFullName: crypto.FullName }))}>
							<div className="Crypto_Row">
								<div className="Crypto_Info_Column" style={{ display: 'flex' }}>
									<img alt='' src={`https://www.cryptocompare.com${crypto.ImageUrl}`} />
									<div className="Crypto_Header">
										<div className="Crypto_Name">
											{crypto.FullName}
										</div>
										<div className="Crypto_Short">
											{crypto.Name}
										</div>
									</div>
								</div>
								<div className="Crypto_Info_Column">
									{isMobile ? <div className="Crypto_Info_Title">
										{Strings.cryptos.price}
									</div> : null}
									<div className="Crypto_Info">
										{crypto.RAW[currency] ? <>
											{formatPrice(crypto.RAW[currency]?.PRICE, currencySymbol)}
										</> : <>-</>}
									</div>
								</div>
								<div className="Crypto_Info_Column">
									{isMobile ? <div className="Crypto_Info_Title">
										{Strings.cryptos.mktCap}
									</div> : null}
									<div className="Crypto_Info">
										{crypto.RAW[currency] ? <>
											{formatPrice(crypto.RAW[currency]?.MKTCAP, currencySymbol)}
										</> : <>-</>}
									</div>
								</div>
								<div className="Crypto_Info_Column">
									{isMobile ? <div className="Crypto_Info_Title">
										{Strings.cryptos.oneDayChange}
									</div> : null}
									<div
										className="Crypto_Info"
										style={crypto.RAW[currency]?.CHANGE24HOUR > 0 ?
											{ color: 'green' } :
											{ color: '#b51313' }}
										>
										{crypto.RAW[currency] ? <>
											{crypto.RAW[currency]?.CHANGE24HOUR.toFixed(2)}%
											<div className={crypto.RAW[currency]?.CHANGE24HOUR > 0 ? "Change24Indicator Rotate" : "Change24Indicator"}>
												<Icon
													className="rotate"
													name="baixa" />
											</div>
										</> : <>-</>}
									</div>
								</div>

							</div>
						</div>
					})}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state: any) => ({
	language: state.language || 'pt',
	currency: state.currency || 'EUR',
});

export default connect(mapStateToProps)(Home);