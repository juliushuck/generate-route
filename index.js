var queryString = require("query-string");
var urlJoin = require("url-join");

// The generate route function gets called by the developer.
// segments defines the segments of the route. A segment can be a static one like "post" or a parameter place holder lile ":postId".
// subRoutes defines the sub routes of the route.
const generateRoute =
    (segments = [""], subRoutes = {}) =>
    // The second function gets called by the system.
    // buildPrev gives the sub routes recursive access to their parent routes.
    (buildPrev = () => "") =>
    // The third function gets called by the developer to generate the routes build functions and sub routes.
    // isRouteRootsParent defines, if the system should further add segments to the final route. When a route has isRootsParent equals true, it and it's parent routes will not get included in the final route.
    // args defines values for the parameter placeholders of the route. These are only used in the build function.
    (isRootsParent = false, args = {}) => {
        // The build function generates the final route recursively and replaces the parameter placeholders with their values. When the final route does not get generated to the highest level route, a slash gets added in front of it.
        // queryParams can define the base for a query string to be generated and appended to the final route.
        const build = (queryParams) => {
            const segmentsToJoin = [];
            if (isRootsParent === false) {
                segmentsToJoin.push(buildPrev());
                segmentsToJoin.push(
                    ...Object.keys(args).reduce(
                        (segmentsWithArgsAccumulator, arg) =>
                            segmentsWithArgsAccumulator.map((segment) =>
                                segment !== `:${arg}`
                                    ? segment
                                    : String(args[arg])
                            ),
                        segments
                    )
                );
            }
            if (queryParams !== undefined) {
                segmentsToJoin.push(`?${queryString.stringify(queryParams)}`);
            }
            return (
                (isRootsParent === true ? "/" : "") + urlJoin(segmentsToJoin)
            );
        };
        // The result of the third function is an object with a build function and all sub routes represented by their third functions. So the subroutes can get called with isRootsParent and args to get their object with their build function and their sub routes.
        return {
            build,
            ...Object.fromEntries(
                Object.keys(subRoutes).map((x) => [
                    x,
                    subRoutes[x](build), // The system calls the second function, to give the sub routes recursive access to their parent routes.
                ])
            ),
        };
    };

module.exports.generateRoute = generateRoute;
