import React, { PropTypes } from 'react';
import {
  AppBar,
  Drawer,
} from '../../common';

const styles = {
  appContainer: {
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  },
  contentContainer: {
    padding: 15,
  },
};

class View extends React.Component {

  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.mql = window.matchMedia('(min-width: 800px)');

    this.state = {
      drawerOpen: this.mql.matches,
      drawerDocked: this.mql.matches,
    };
  }

  componentWillMount = () => {
    this.mql.addListener(this.handleMediaQueryChange);
  };

  componentWillUnmount = () => {
    this.mql.removeListener(this.handleMediaQueryChange);
  };

  handleMediaQueryChange = () => {
    this.setState({ drawerDocked: this.mql.matches });
  };

  handleDrawerOpen = (open) => {
    this.setState({ drawerOpen: open });
  };

  handleRouteChange = (event, value) => {
    this.context.router.push(value);
  };

  render() {
    return (
      <div style={{ ...styles.appContainer, paddingLeft: this.state.drawerDocked && this.state.drawerOpen ? '256px' : 0 }}>
        <AppBar
          open={this.state.drawerOpen}
          onLeftIconButtonTouchTap={this.handleDrawerOpen}
        />
        <Drawer
          open={this.state.drawerOpen}
          docked={this.state.drawerDocked}
          location={this.props.location.pathname}
          onRequestChange={this.handleDrawerOpen}
          onRequestChangeList={this.handleRouteChange}
        />
        <div style={styles.contentContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default View;
