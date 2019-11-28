import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, Grid } from '@material-ui/core';
import MasterDataIcon from '@material-ui/icons/Dashboard';
import LogsIcon from '@material-ui/icons/Reorder';
import ProgressIcon from '@material-ui/icons/DonutLarge';
import SettingsIcon from '@material-ui/icons/Settings';
import { SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      height: 'calc(100%)'
    },
    fontWeight: "bold"
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  content: {
    padding: theme.spacing(2)
  },
  logo: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(2)
  },
  icon: {
    color: "#F5F6F8"
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Master Data',
      href: '/master-data',
      icon: <MasterDataIcon className={classes.icon}/>
    },
    {
      title: 'Logs',
      href: '/logs',
      icon: <LogsIcon className={classes.icon}/>
    },
    {
      title: 'Process',
      href: '/process',
      icon: <ProgressIcon className={classes.icon}/>
    }
  ];

  const otherPages = [
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon className={classes.icon}/>
    }
  ];
  

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Grid
          container
          justify = "center"
          >
            <img
              alt="Logo"
              src={"/logo.svg"}
              width="30%"
              className={classes.logo}

            />
          </Grid>
        <SidebarNav
          className={classes.content}
          pages={pages}
        />
        <Divider/>
        <SidebarNav
          className={classes.content}
          pages={otherPages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
