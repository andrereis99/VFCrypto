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
import { Row, Col, Button } from "antd";
import { Icon } from "../../components";
import { setTitle } from "../../store/actions";
import { CURRENCIES, CRYPTOS } from '../../utils/utils';
import Strings from '../../utils/strings';

import './styles.scss';

export class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.state = {
			cryptos: [],
			isMobile: window.innerWidth < 768,
		};
		
		window.addEventListener("resize", this.handleResize);
	}

	componentDidMount() {
        const { dispatch } = this.props;

        dispatch(setTitle('VFCrypto'));

		axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DASH,LTC,ADA,LINK&tsyms=USD,EUR,GBP,JPY').then((response) => {
			console.log('response', response.data);

			this.setState({ cryptos: response.data.RAW });
		});
	}
	
	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}

	handleResize = () => {
		this.setState({
			isMobile: window.innerWidth < 768,
		});
	}

	render() {
		const { cryptos, isMobile } = this.state;
		const { currency } = this.props;

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
					{Object.keys(cryptos).map((cryptoKey: any) => {
						const crypto = cryptos[cryptoKey][currency]
						const cryptoName = CRYPTOS.find(elem => elem.value === cryptoKey)?.label
						const currencySymbol = CURRENCIES.find(elem => elem.value === currency)?.label;
						return <>
							<div className="CryptoCard">
								<div className="Crypto_Row">
									{cryptos ? <>
										<div className="Crypto_Info_Column" style={{ display: 'flex' }}>
											<img alt='' src={`https://www.cryptocompare.com${crypto.IMAGEURL}`} />
											<div className="Crypto_Header">
												<div className="Crypto_Name">
													{cryptoName}
												</div>
												<div className="Crypto_Short">
													{cryptoKey}
												</div>
											</div>
										</div>
										<div className="Crypto_Info_Column">
											{isMobile ? <div className="Crypto_Info_Title">
												{Strings.cryptos.price}
											</div> : null}
											<div className="Crypto_Info">
												<span>{currencySymbol}</span> {crypto.PRICE.toFixed(2)}
											</div>
										</div>
										<div className="Crypto_Info_Column">
											{isMobile ? <div className="Crypto_Info_Title">
												{Strings.cryptos.mktCap}
											</div> : null}
											<div className="Crypto_Info">
												<span>{currencySymbol}</span> {crypto.MKTCAP.toFixed(2)}
											</div>
										</div>
										<div className="Crypto_Info_Column">
											{isMobile ? <div className="Crypto_Info_Title">
												{Strings.cryptos.oneDayChange}
											</div> : null}
											<div
												className="Crypto_Info"
												style={crypto.CHANGE24HOUR > 0 ?
													{ color: 'green' } :
													{ color: '#b51313' }}
												>
													{Math.abs(crypto.CHANGE24HOUR.toFixed(2))}%
													<div className={crypto.CHANGE24HOUR > 0 ? "Change24Indicator Rotate" : "Change24Indicator"}>
														<Icon
															className="rotate"
															name="baixa" />
													</div>
											</div>
										</div>
									</> : null}
								</div>
							</div>
						</>
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