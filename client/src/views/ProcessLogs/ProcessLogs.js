import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { LogsTable } from './components';
import { getLogs } from './requests';

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

  const [logsData, setLogsData] = useState([]);

  React.useLayoutEffect(() => {
    getLogs()
      .then((response) => {
        setLogsData(response.data.logs);
        console.log(logsData)
      })
      .catch((err) => {
      });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box my={3}>
            <LogsTable data={logsData} />
          </Box>
        </Grid>
      </Grid>
    </div >
  );
};

export default ProcessLogs;
