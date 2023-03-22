import Button from "@mui/material/Button"
import {
  Link,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  useParams,
  useNavigate,
} from "@tanstack/react-router"

import { z } from "zod"

// Define a schema for the search params of the blog route
const blogSearchSchema = z.object({
  page: z.number().optional(),
})

// If we need to use the schema in other places, we can define a type for it
// type BlogSearch = z.infer<typeof blogSearchSchema>;

const rootRoute = new RootRoute()
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const navigate = useNavigate()

    return (
      <div>
        <h1>Index</h1>

        {/* Usage of MaterialUI Button */}
        <Link to="blog">
          <Button>To blog index</Button>
        </Link>

        <div>
          <Link to="blog/$slug" params={{ slug: "my-slug" }}>
            To blog/my-slug
          </Link>
        </div>

        {/* Usage of `navigate` for button */}
        <button onClick={() => navigate({ to: "/blog", search: { page: 1 } })}>
          Button navigates to blog route
        </button>
      </div>
    )
  },
})

const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog",
  validateSearch: (search) => {
    return blogSearchSchema.parse(search)
  },
})
const blogIndexRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "/",
  component: () => <h1>Blog Index</h1>,
})

const postRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "$slug",
  component: () => {
    // Get the slug param from the URL
    const { slug } = useParams()

    return <h1>Blog Post: {slug}</h1>
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute.addChildren([blogIndexRoute, postRoute]),
])

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const router = new Router({ routeTree: routeTree })

function App() {
  return <RouterProvider router={router} />
}

export default App
