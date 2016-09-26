import React, { PropTypes } from 'react';
import AppBarMUI from 'material-ui/AppBar';

const AppBar = (props) => {
	return (
		<AppBarMUI
			title="Title"
			iconClassNameRight="muidocs-icon-navigation-expand-more"
			onLeftIconButtonTouchTap={() => props.onLeftIconButtonTouchTap(!props.open)}
		/>
	)
};

AppBar.propTypes = {
	...AppBarMUI.propTypes,
	open: PropTypes.bool
};

export default AppBar;