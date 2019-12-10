import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Products } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  table: {
    width: "100 %"
  }
}));

const MasterData = props => {
  const classes = useStyles();


  return (

    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mb={3}>
            <Products title="Products" />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default MasterData;
