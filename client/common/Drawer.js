import React, { PropTypes } from 'react';
import DrawerMUI from 'material-ui/Drawer';
import MenuItemMUI from 'material-ui/MenuItem';

const Drawer = (props) => {
	return (
		<DrawerMUI
			docked={false}
			open={props.open}
			onRequestChange={props.onRequestChange}
		>
			<MenuItemMUI>Pocetna</MenuItemMUI>
			<MenuItemMUI>Arikli</MenuItemMUI>
			<MenuItemMUI>Racuni</MenuItemMUI>
		</DrawerMUI>
	);
};

Drawer.propTypes = {
	...Drawer.propTypes,
};

export default Drawer;