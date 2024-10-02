import { Router, Route, RootRoute } from "@tanstack/react-router";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";

const rootRoute = new RootRoute();

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const mainRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/main",
  component: MainPage,
});

const routeTree = rootRoute.addChildren([loginRoute, mainRoute]);

export const router = new Router({ routeTree });
