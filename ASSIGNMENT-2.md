# Assignment 2

## Turning a single consumer web-based Platforms into a SaaS

A web-based gaming platform (=gPlatform) is currently providing it’s services to one single gaming site (=gSite).

The services provided by gPlatform to gSite include hosting web-games and backoffice for managing players that sign-up and play on gSite.


We want to make gPlatform into a SaaS that can be sold to other gaming sites as subscription-based service.


Each new gaming company operating a gaming site, will have it’s own dedicated domain - for example:

Company A will have a domain cool-games.com

Company B will have a domain luck-games.co.uk

etc.

Currently at gPlatform, users are identified by using email as a unique key.

## Give a short, clear explanation for every question below:

1. How can we design the system in a way that every Company will be able to serve games on their gaming site from their domain?
2. What modification should be done to the users table at gPlatform to support this change?
3. Considering we have 1 backend cluster that serves all companies, how can we validate a user login on one gaming domain in such a way that it does not give access to a different gaming domain? (i.e. authenticating on site A, grants access to site A only)


# Answers:

1.

Adding `domain_host` field to users (or sites) table, then setting the CORS  `Access-Control-Allow-Origin` header to that user's `domain_host` for the game's iframe (e.g. `/game/394` knows the game ID so it can set the CORS header to `Game.find(394).site.user.domain_host`), and standard browsers that respect CORS will only allow `iframe` elements from that gaming site's domain.

2.

Users table should have a unique key on `id` instead of `email`.

3. 

Depends on authentication method used, but generally:

- The SameSite cookie policy will use separate cookies for each site.
- if a JWT token is issued, we can put the `domain_host` in the token, and the backend can check if the domain belongs to the site's user.
- we can check the `Origin` or `Referer` headers, but only as an additional measure and only for some operations, since making custom requests without standard browsers, any value can be specified in those headers and doesn't represent a fully reliable protection method.
- and also, anytime a database operation is performed on a site, for additional security, e.g. if using the Repository pattern, the repository will check if the user (by checking the auth method: token, cookie, etc) has correct access rights to perform that operation.