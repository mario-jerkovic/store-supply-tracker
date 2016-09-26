import React, { PropTypes } from 'react';

class Home extends React.Component {

	static propTypes = {

	};

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div>
				{this.props.viewer.id}
			</div>
		);
	}
}

export default Home;