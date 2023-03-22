# Setup Tanstack router with Vite

Create new vite application

> Select React and then Typescript (without SWC)

`yarn create vite`

Install @tanstack/react-router@beta

`yarn add @tanstack/react-router@beta`

New routes are created using `RootRoute` and `Route` classes. Multiple routes can be nested withing each other to create a route tree, which is then used to create a router.

Create root route

```
import { RootRoute } from "@tanstack/react-router"

const rootRoute = new RootRoute()
```

Another routes can be created by calling `new Route()`. To achieve maximum typesafety, you need to specify `getParentRoute` callback to each route. Let's start by creating index route.

> It might seem we've already created root route, but if we want to create any subroutes (for example `/blog`), we need to create also `indexRoute` and specify parent route as `rootRoute`

```
const rootRoute = new RootRoute()

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div>
      <h1>Index</h1>
    </div>
  ),
})
```

Let's also created already mentioned subroute `/blog`. Again, we create first a route, that has `rootRoute` set as parent route. Then, we create index route, that has `blogRoute` set as parent route.

```
const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog",
})

const blogIndexRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "/",
  component: () => <h1>Blog Index</h1>,
})
```

### Splat/Wildcard routes

Let's imagine that each blog has its own "slug" and we can route each blog post as `/blog/slug`. We can do it with tanstack router using `$`

> Note that now we don't create both postRoute and postIndexRoute. As long as we don't want to create any subroute for /blog/slug, we don't need to create index route.

```
const postRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "$slug",
  component: () => {
    const { slug } = useParams()

    return <h1>Blog Post: {slug}</h1>
  },
})
```

Inside a page /blog/slug, we can determine on what slug we're currently at by calling `const { slug } = useParams()`. We can then fetch data from API for this slug for example.

### Route tree

We need to specify `routeTree`, that will later be passed to Router. We specify each route and add subroutes as children. Note that for example `blogIndexRoute` is a child of `blogRoute`

```
const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute.addChildren([blogIndexRoute, postRoute]),
])
```

### Router and types

Finally, we can create our router. In order to have great typesafety, we need to specify router type and declare it in module @tanstack/react-router

```
const router = new Router({ routeTree: routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
```

Then we can use our router like that in App component:

```
function App() {
  return <RouterProvider router={router} />
}
```

### Usage

Run your application using `yarn dev` and you should be able to access your subroutes (`/blog`, `/blog/blog-post-1`, `/blog/blog-post-2`, ...)




