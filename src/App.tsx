import {
  Link,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  useParams,
} from "@tanstack/react-router";

const rootRoute = new RootRoute();
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div>
      <h1>Index</h1>
      <div>
        <Link to="blog">To Blog index</Link>
      </div>
      <div>
        <Link to="blog/$slug" params={{ slug: "my-slug" }}>
          To blog/my-slug
        </Link>
      </div>
    </div>
  ),
});

const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog",
});
const blogIndexRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "/",
  component: () => <h1>Blog Index</h1>,
});

const postRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "$slug",
  component: () => {
    const { slug } = useParams();

    return <h1>Blog Post: {slug}</h1>;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute.addChildren([blogIndexRoute, postRoute]),
]);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = new Router({ routeTree: routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
