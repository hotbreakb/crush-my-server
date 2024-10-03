import React from 'react';
import { Outlet, Link, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import HomePage from '../pages/Home.page';
import LoginPage from '../pages/Login.page';

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
      {/* {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />} */}
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

const router = createRouter({ routeTree });

export default router;
