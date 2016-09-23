import React, { PropTypes } from 'react';

class App extends React.Component {

	static propTypes = {
		children: PropTypes.elements,
		viewer: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	};

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default App;