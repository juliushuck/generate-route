# generate-route

This package can generate route structures and build routes. It supports nested routes, parameter placeholders and query parameters. It can be used for APIs, SPAs, apps, etc.

## All features

- Generate route structures
- Build routes with parameter placeholders
- Build routes with values for the parameter placeholders
- Build not to the lowest level
- Build not to the highest level
- Build routes with query parameters

## Get started

### 1. Install the package

```shell
npm i @juliushuck/generate-route
```

### 2. Import the generate function

```js
import { generate } from "@juliushuck/generate-route";
// or
const { generate } = require("@juliushuck/generate-route");
```

### 3. Generate your route structure with sub routes

```txt
app.com // Highest level route
    └── posts
        ├── (getAll)
        └── :postId (getById)
            └── comments
                └── :commentId (getById) // Lowest level route
```

```js
const routes = generate(["app.com"], { // Highest level route
  posts: generate(["posts"], {
    getAll: generate(),
    getById: generate([":postId"], {
      comments: generate(["comments"], {
        getById: generate([":commentId"]), // Lowest level route
      }),
    }),
  }),
})(); // <-- Do not forget to call the first generate function
```

The generate function accepts segments and subroutes. Segments can be a static ones or parameter placeholders. A parameter placeholder starts with `:`.

_When you look closely, you can see that posts has an additional route called getAll. This route has no segments and is not really needed. But I always add it anyways in API routes, because functions should describe actions and for that need a verb._

### 4. Build routes

```js
// Build routes without values for the parameter placeholders
// app.com/posts/:postId/comments/:commentId
routes().posts().getById().comments().getById().build();

// Build routes with values for the parameter placeholders
// app.com/posts/123/comments/456
routes()
  .posts()
  .getById(false, { postId: 123 })
  .comments()
  .getById(false, { commentId: 456 })
  .build();

// Build not to the lowest level route, by calling build on one of the higher level routes
// app.com/posts/:postId
routes().posts().getById().build();

// Build not to the highest level route, by setting isRootsParent to true on one of the lower level routes
// /:postId/comments/:commentId
routes().posts(true).getById().comments().getById().build();

// Add query parameters
// app.com/posts?page=abc&pageSize=abc
routes().posts().build({ page: "abc", pageSize: "abc" });
```

For more examples, please have a look at the test/tests.js file.

When you have a frontend and a backend, I recommend you to create two files. Then generate the routes for the frontend in one file and for the backend in the other one. Then export the routes from the files and share the files between the two projects in a shared git submodule or so.

When you need examples for the usage in express or react, please create an issue on GitHub. But basically you generate the routes not to the highest level and do not pass values for the parameter placeholders.

## Roadmap

- Cover multiple parameter placeholders in one route with tests.
- Add meaningfull error messages for generating the route structure and for building routes.
- Maybe: Support back slashes for path generation in Windows.
