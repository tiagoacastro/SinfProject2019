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

//later on will be logsData
const exampledata = [
  { id: '48309832', timestamp: '03/01/1029', document: 'Sales Order', target: 'Company 1' },
  { id: '48309833', timestamp: '03/01/1029', document: 'Delivery Order', target: 'Company 1' },
  { id: '48309832', timestamp: '03/01/1029', document: 'Purchase Order', target: 'Company 2' },
];

const ProcessLogs = props => {
  const classes = useStyles();

  const [logsData, setLogsData] = useState();

  useEffect(() => {
    getLogs()
      .then((response) => {
        setLogsData(response.data.processes);
      })
      .catch((err) => {
      });
  }, []);

  return (

    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">ProcessTypeA #1</Typography>
          <Box my={3}>
            <LogsTable data={exampledata} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProcessLogs;
