/**
 *
 * Header
 *
 */

import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Dropdown, Menu } from "antd";

import { setLanguage, setCurrency } from "../../store/actions";
import { LANGUAGES, CURRENCIES } from "../../utils/utils";
import Strings from "../../utils/strings";

import logo from "../../assets/logo.png"

import "./styles.scss";

/* eslint-disable react/prefer-stateless-function */
export class Header extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			language: props.language || "pt",
			currency: props.currency || '€',
		};
	}

	renderLogo() {
		const { dispatch } = this.props;

		return (
			<React.Fragment>
				<div className="HeaderSection">
					<a
						href="/"
						className="HeaderLogo"
						onClick={(e: any) => {
							e.preventDefault();
							dispatch(push('/'));
						}}
					>
						<img src={logo} alt="App Logo" />
						VFCrypto
					</a>
				</div>
			</React.Fragment>
		);
	}

	/**
	 * Change System language
	 * @param language
	 */
    changeLanguage(language: string) {
		const { dispatch } = this.props;
		Strings.setLanguage(language);
		this.setState({ language: language });
		dispatch(setLanguage(language));
	}

	/**
	 * Change System language
	 * @param language
	 */
    changeCurrency(currency: string) {
		const { dispatch } = this.props;
		this.setState({ currency: currency });
		dispatch(setCurrency(currency));
	}

	renderLanguageMenu = () => {
		return <Menu onClick={() => {}}>
			{LANGUAGES.map((elem: any, index: number) => (
				<>
					<Menu.Item
						key={elem.label}
						style={{
							height: 40,
							display: "flex",
							alignItems: "center",
						}}
						onClick={() => this.changeLanguage(elem.value)}
					>
						{elem.label}
					</Menu.Item>
					{LANGUAGES[index+1] ? <Menu.Item
						key="separator"
						style={{
							height: 1,
							backgroundColor: "#1f385a",
							padding: 0,
						}}
					/> : null}
				</>
			))}
		</Menu>
	}

	renderCurrencyMenu = () => {
		return <Menu onClick={() => {}}>
			{CURRENCIES.map((elem: any, index: number) => (
				<>
					<Menu.Item
						key={elem.label}
						style={{
							height: 40,
							display: "flex",
							alignItems: "center",
						}}
						onClick={() => this.changeCurrency(elem.value)}
					>
						{elem.label}
					</Menu.Item>
					{CURRENCIES[index+1] ? <Menu.Item
						key="separator"
						style={{
							height: 1,
							backgroundColor: "#1f385a",
							padding: 0,
						}}
					/> : null}
				</>
			))}
		</Menu>
	}

	render() {

		return (
			<div className="HeaderContainer">
				<div id="AppHeader" className="Header">
					{this.renderLogo()}
					<div className="HeaderSection">
						{/* Currency Switcher */}
						<Dropdown key="currency_Dropdown" overlay={this.renderCurrencyMenu} trigger={["click"]}>
							<div className="MenuContainer">
								<h1>{CURRENCIES.find(elem => elem.value === this.state.currency)?.label}</h1>
							</div>
						</Dropdown>
						<div className="Splitter" />
						{/* Language Switcher */}
						<Dropdown key="language_Dropdown" overlay={this.renderLanguageMenu} trigger={["click"]}>
							<div className="MenuContainer">
								<h1>{this.state.language.toUpperCase()}</h1>
							</div>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	language: state.language || 'pt',
	currency: state.currency || '€',
});

export default connect(mapStateToProps)(Header);
