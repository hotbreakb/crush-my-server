import React from 'react';
import {
  Outlet,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from '@tanstack/react-router';
import HomePage from '../pages/Home.page';
import LoginPage from '../pages/Login.page';
import { checkAuth } from '../api/factory';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>{' '}
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
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
