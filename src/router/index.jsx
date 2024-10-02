import React from "react";
import {
  Outlet,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import LoginPage from "../pages/Login.page";
import MainPage from "../pages/Main.page";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>{" "}
        <Link to="/main" className="[&.active]:font-bold">
          Main
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
  path: "/",
  component: function Index() {
    return (
      <div>
        <h1>Welcome to our app!</h1>
        <p>Please login to continue.</p>
      </div>
    );
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/main",
  component: MainPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, mainRoute]);

const router = createRouter({ routeTree });

export default router;
