import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Content, RouteContent } from "../../components";
import { Header, ErrorBoundary } from "../index";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import Strings from '../../utils/strings';
import Routes from "./routes";

import '../../styles/styles.scss';
import '../../styles/theme.less';
import 'react-toastify/dist/ReactToastify.css';

let theme: any;

export class App extends Component<any, any> {
	constructor(props: any) {
		super(props);

		this.state = {
			sidebarOpen: false,
			sidebarHidden: false,
		};

		theme = createTheme({
			palette: {
				primary: {
					main: '#000',
				},
			},
		});

		Strings.setLanguage(props.language || "pt");
	}

	render() {
		return (
			<div className="App">
				{/* Toast messages will appear here */}
				<ToastContainer
					toastClassName='BBToast'
					bodyClassName='BBToastBody'
					hideProgressBar={false}
					closeButton={<></>}
					position={toast.POSITION.BOTTOM_RIGHT}
					autoClose={5000}
				/>
				<MuiThemeProvider theme={theme}>
					<Content>
						<RouteContent>
							<ErrorBoundary>
								<Header />
								<Routes />
							</ErrorBoundary>
						</RouteContent>
					</Content>
				</MuiThemeProvider>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	router: state.router,
	loader: state.loader,
});

export default connect(mapStateToProps)(App);
