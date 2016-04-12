---
layout: post
title:  "OWIN Integration Testing with OAuth Bearer Tokens"
date:   2016-04-11 13:34:00
description: "How to generate an OAuth bearer token to use with OWIN integration tests."
---

## Situation
The situation is pretty simple.  We have a project written with Web API 2.2
that we have running with OWIN.  The API requires user authorization.  To
accomplish that, we use the OWIN OAuth libraries.

Upon until recently, the OAuth authorization server (the thing that takes in
the user credentials and issues the token) and the API (the resource server) were
hosted in the same site and web project.  

Integration testing was pretty easy at this point.  For the authorized calls,
we simply wrote helper methods that logged a test user in through the authorization
server (hosted along with the API in the OWIN test server), got a bearer token
and then made the integration test calls.

## Problem
When we recently decided to split the authorization server and resource server
code up into two separate code bases (so that they could be hosted separately)
we ran into issues with the authorization and API calls no longer being possible within a
single integration test.  The code to generate the bearer token was now no
longer accessible in the test server for the API integration tests because the authorization
server was now designed to be hosted separately.  We'd have
to somehow generate the bearer token without making a call with the OWIN test
server.

## Solution
The solution is to generate a valid bearer token in your test code and send it
along with your test API call as you would have previous.  How to generate that
valid bearer token though??  It turns out to be easier than I thought.

How you use OWIN's test server is beyond the scope of this blog post, but
eventually you'll have some code resembling this:

  var server = TestServer.Create<Startup>();

You'll have to use a overload of the `Create()` method to capture a reference
to the server's `IDataProtector`.  This interface defines what OWIN OAuth will
use to encrypt a `ClaimsIdentity` into a valid bearer token.

Update your server creation code like this:

```
  var dataProtector;
  var server = TestServer.Create(app =>
  {
    var s = new Startup();
    s.Configuration(app);

    dataProtector = app.CreateDataProtector(
      typeof(OAuthBearerAuthenticationMiddleware).Namespace,
      "Access_Token", "v1");
  });
```

You have to get the `dataProtector` this way because it's the same way that
the OWIN OAuth libraries get it before trying to decrypt the bearer token.
See the source for the OWIN OAuth code here:
[OAuthBearerAuthenticationMiddleware.cs](http://katanaproject.codeplex.com/SourceControl/latest#src/Microsoft.Owin.Security.OAuth/OAuthBearerAuthenticationMiddleware.cs)

Once you've "captured" the `dataProtector`, in your integration test (or in some
helper code, probably) you can generate your `ClaimsIdentity` and then your
bearer token with the `dataProtector`.

```
  // inside an integration test
  using (server)
  {
    // create your valid identity any way you need to here
    ClaimsIdentity identity = new ClaimsIdentity(new GenericIdentity("username"));

    // these classes are defined in the OWIN OAuth libraries.
    var properties = new AuthenticationProperties();
    var ticket = new AuthenticationTicket(identity, properties);
    var format = new TicketDataFormat(dataProtector);

    string bearerToken = format.Protect(ticket);

    // ... call your API through the test server with the bearer token...
    var response = server.CreateRequest("/api/someendpoint")
        .AddHeader("Authorization", "Bearer " + bearerToken)
        .GetAsync()
        .Result;
  }
```
