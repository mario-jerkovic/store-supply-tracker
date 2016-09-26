import React, { PropTypes } from 'react';
import { MuiThemeProvider } from '../../common';

class App extends React.Component {

	static propTypes = {
		children: PropTypes.element,
	};

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<MuiThemeProvider>
				{this.props.children}
			</MuiThemeProvider>
		);
	}
}

export default App;