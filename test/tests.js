var expect = require("chai").expect;
var generate = require("../index.js");

describe("Use nested routes definition", () => {
  it("app.com", () => {
    const routes = generate(["app.com"])();
    const route = routes().build();
    expect(route).to.be.equals("app.com");
  });

  it("app.com/posts", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"]),
    })();
    const route = routes().posts().build();
    expect(route).to.be.equals("app.com/posts");
  });

  it("app.com/posts", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
      }),
    })();
    const route = routes().posts().getAll().build();
    expect(route).to.be.equals("app.com/posts");
  });

  it("app.com/posts/:postId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"]),
      }),
    })();
    const route = routes().posts().getById().build();
    expect(route).to.be.equals("app.com/posts/:postId");
  });

  it("app.com/posts/123", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"]),
      }),
    })();
    const route = routes().posts().getById(false, { postId: 123 }).build();
    expect(route).to.be.equals("app.com/posts/123");
  });

  it("app.com/posts/:postId/comments", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"]),
        }),
      }),
    })();
    const route = routes().posts().getById().comments().build();
    expect(route).to.be.equals("app.com/posts/:postId/comments");
  });

  it("app.com/posts/123/comments", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"]),
        }),
      }),
    })();
    const route = routes()
      .posts()
      .getById(false, { postId: 123 })
      .comments()
      .build();
    expect(route).to.be.equals("app.com/posts/123/comments");
  });

  it("app.com/posts/:postId/comments/:commentId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes().posts().getById().comments().getById().build();
    expect(route).to.be.equals("app.com/posts/:postId/comments/:commentId");
  });

  it("app.com/posts/123/comments/456", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes()
      .posts()
      .getById(false, { postId: 123 })
      .comments()
      .getById(false, { commentId: 456 })
      .build();
    expect(route).to.be.equals("app.com/posts/123/comments/456");
  });
});

describe("Use flat routes definition", () => {
  it("app.com/posts/:postId/comments/:commentId", () => {
    const routes = generate([
      "app.com",
      "posts",
      ":postId",
      "comments",
      ":commentId",
    ])();
    const route = routes().build();
    expect(route).to.be.equals("app.com/posts/:postId/comments/:commentId");
  });

  it("app.com/posts/:postId/comments/:commentId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts", ":postId"], {
        comments: generate(["comments", ":commentId"]),
      }),
    })();
    const route = routes().posts().comments().build();
    expect(route).to.be.equals("app.com/posts/:postId/comments/:commentId");
  });
});

describe("Build not to the lowest level route", () => {
  it("app.com/posts/:postId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes().posts().getById().build();
    expect(route).to.be.equals("app.com/posts/:postId");
  });
});

describe("Build not to the highest level route", () => {
  it("/posts/:postId/comments/:commentId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes(true).posts().getById().comments().getById().build();
    expect(route).to.be.equals("/posts/:postId/comments/:commentId");
  });

  it("/:postId/comments/:commentId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes().posts(true).getById().comments().getById().build();
    expect(route).to.be.equals("/:postId/comments/:commentId");
  });

  it("/comments/:commentId", () => {
    const routes = generate(["app.com"], {
      posts: generate(["posts"], {
        getAll: generate(),
        getById: generate([":postId"], {
          comments: generate(["comments"], {
            getById: generate([":commentId"]),
          }),
        }),
      }),
    })();
    const route = routes().posts().getById(true).comments().getById().build();
    expect(route).to.be.equals("/comments/:commentId");
  });
});

describe("Add a query string", () => {
  it("app.com?page=abc", () => {
    const routes = generate(["app.com"])();
    const route = routes().build({ page: "abc" });
    expect(route).to.be.equals("app.com?page=abc");
  });

  it("app.com?page=abc&pageSize=abc", () => {
    const routes = generate(["app.com"])();
    const route = routes().build({ page: "abc", pageSize: "abc" });
    expect(route).to.be.equals("app.com?page=abc&pageSize=abc");
  });
});
