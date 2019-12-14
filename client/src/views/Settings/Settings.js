import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { CompanySettings } from './components';
import { getCompaniesData } from './requests';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Settings = () => {
  const classes = useStyles();
  const [companiesData, setCompaniesData] = React.useState([{}, {}]);

  React.useEffect(() => {
    getCompaniesData()
      .then((response) => {
        const data = response.data;
        setCompaniesData(data);
      })
      .catch((err) => { });
  }, []);

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <CompanySettings companyInfo={companiesData[0]} />
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
        >
          <CompanySettings companyInfo={companiesData[1]} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
