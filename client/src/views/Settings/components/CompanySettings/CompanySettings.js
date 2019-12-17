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
        title={companyInfo.name}
      />
      <Divider />

      <CardContent>
        <Box fontWeight="fontWeightRegular" m={1}><Typography><b>Company Name:</b> {companyInfo.name}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography><b>Client ID:</b> {companyInfo.client_id}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography><b>Client Secret:</b> {companyInfo.secret_id}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography><b>Tenant:</b> {companyInfo.tenant}</Typography></Box>
        <Box fontWeight="fontWeightRegular" m={1}><Typography><b>Organization:</b> {companyInfo.organization}</Typography></Box>
      </CardContent>
    </Card >
  );
};

CompanySettings.propTypes = {
  className: PropTypes.string
};

export default CompanySettings;