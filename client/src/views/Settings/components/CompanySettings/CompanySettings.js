import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography,
  Box,
  Grid,
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
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.error.main,
          theme.palette.warning.main
        ],
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: ['Desktop', 'Tablet', 'Mobile']
  };

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
        <Typography>
        <Box fontWeight="fontWeightRegular" m={1}>Company Name: Duriola </Box>
        <Box fontWeight="fontWeightRegular" m={1}>Client ID: Duriola</Box>
        <Box fontWeight="fontWeightRegular" m={1}>Client Secret: Duriola </Box>
        </Typography>
      </CardContent>
    </Card>
  );
};

CompanySettings.propTypes = {
  className: PropTypes.string
};

export default CompanySettings;