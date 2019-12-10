import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { LogsTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  table: {
    width: "100 %"
  }
}));

const ProcessLogs = props => {
  const classes = useStyles();

  return (

    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Process #1</Typography>
          <Box my={3}>
            <div>{}</div>
            <LogsTable />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProcessLogs;
