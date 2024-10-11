import React from 'react';
import {
  Outlet,
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from '@tanstack/react-router';
import HomePage from '../pages/Home.page';
import LoginPage from '../pages/Login.page';
import { checkAuth } from '../api/factory';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  beforeLoad: async () => {
    if (!checkAuth()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/',
        },
      });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

const router = createRouter({
  routeTree,
});

export default router;
