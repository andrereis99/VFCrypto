import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { setLanguage, setCurrency } from "../../store/actions";
import { Home } from "../index";

export class RoutesContainer extends React.Component<any, any> {
	
	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(setLanguage('pt'));
		dispatch(setCurrency('EUR'));
	}

	componentDidUpdate() {
		const elem = document.getElementById("app_content");

		if (elem) {
			elem.scrollTop = 0;
		}
	}

	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Redirect to="/" />
			</Switch>
		);
	}
}

const mapStateToProps = (state: any) => ({
  	router: state.router,
});

export default connect(mapStateToProps)(RoutesContainer);
