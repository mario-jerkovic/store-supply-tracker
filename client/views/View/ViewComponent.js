import React, { PropTypes } from 'react';
import { AppBar, Drawer } from '../../common';

class View extends React.Component {

	static propTypes = {
		children: PropTypes.element,
		viewer: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			drawerOpen: false
		}
	}

	handleDrawerOpen = (drawerOpen) => {
		this.setState({ drawerOpen });
	};

	render() {
		return (
			<div>
				<AppBar
					open={this.state.drawerOpen}
					onLeftIconButtonTouchTap={this.handleDrawerOpen}
				/>
				<Drawer
					open={this.state.drawerOpen}
					onRequestChange={this.handleDrawerOpen}
				/>
				{this.props.children}
			</div>
		);
	}
}

export default View;