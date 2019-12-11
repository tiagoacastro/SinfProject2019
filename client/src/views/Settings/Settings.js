import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  CompanySettings, Connection
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const MasterData = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
        >
          <Connection />
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
        >
          <CompanySettings />
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
        >
          <CompanySettings />
        </Grid>
      </Grid>
    </div>
  );
};

export default MasterData;
