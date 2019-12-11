import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Header } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    position: 'relative !important',
    background: 'white',
  },
  flexGrow: {
    flexGrow: 1
  },
  header: {
    color: theme.palette.text.primary
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <Header title={props.title}/>
        <div className={classes.flexGrow} />
        <Hidden lgUp>
          <IconButton
            color="primary"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
