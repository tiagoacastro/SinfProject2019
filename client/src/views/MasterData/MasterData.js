import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { MyMaterialTable } from "components";
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
          <MyMaterialTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default MasterData;
