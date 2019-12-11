import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout } from './layouts';

import {
  MasterData as MasterDataView,
  ProcessLogs as LogsView,
  Settings as SettingsView
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
        title="Master Data"
        exact
        layout={MainLayout}
        path="/master-data"

      />
      <RouteWithLayout
        component={LogsView}
        title="Logs"
        exact
        layout={MainLayout}
        path="/logs"

      />
      <RouteWithLayout
        component={SettingsView}
        title="Intercompany Connection"
        exact
        layout={MainLayout}
        path="/settings"
      />
    </Switch>

    
  );
};

export default Routes;
