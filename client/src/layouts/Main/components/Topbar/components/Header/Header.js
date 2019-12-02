import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.text.primary
  },
  headerContainer: {
    width: '100%' 
  }
}));

const Header = props => {
  const { title } = props;

  const classes = useStyles();
  let content;

  if(title)
    content = <h3 className={classes.header}>{title}</h3>;
  else content = <SearchInput/>;

  return (
    <div className={classes.headerContainer}>{content}</div>
  );
};

export default Header;
