import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography,
  Box,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const CompanySettings = props => {
  const { companyInfo, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <IconButton size="small">
            <EditIcon />
          </IconButton>
        }
        title="Company Name"
      />
      <Divider />

      <CardContent>
        <Box fontWeight="fontWeightRegular" m={1}><Typography>Company Name: {companyInfo.name}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography>Client ID: {companyInfo.client_id}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography>Client Secret: {companyInfo.secret_id}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography>Tenant: {companyInfo.tenant}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography>Organization: {companyInfo.organization}</Typography></Box>
      </CardContent>
    </Card >
  );
};

CompanySettings.propTypes = {
  className: PropTypes.string
};

export default CompanySettings;