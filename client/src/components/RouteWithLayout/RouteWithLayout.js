import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, title, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout title={title}>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  title: PropTypes.string,
};

export default RouteWithLayout;
