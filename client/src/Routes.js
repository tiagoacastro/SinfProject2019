import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout} from './layouts';

import {
  MasterData as MasterDataView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/master-data"
      />
      <RouteWithLayout
        component={MasterDataView}
        exact
        layout={MainLayout}
        path="/master-data"
      />
    </Switch>
  );
};

export default Routes;
