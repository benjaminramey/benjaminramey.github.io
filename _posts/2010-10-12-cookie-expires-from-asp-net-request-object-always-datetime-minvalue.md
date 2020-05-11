---
layout: post
title:  "Cookie.Expires from ASP.NET Request Object Always DateTime.MinValue"
date:   2010-10-12
description: "Cookie.Expires from ASP.NET Request Object Always DateTime.MinValue"
categories: [programming]
tags: [.net,asp.net]
---
I’ve been working on a problem today involving cookies with one of our web applications.  The cookie is keeping track of a user’s authenticated session and it’s timing people out too soon.  So, I was checking the expiration time of the cookie coming in from the browser and it was returning 1/1/0001 12:00AM every time.  I thought this might be the source of my problem, but resetting the cookie and the expiration time did not help the next round-trip to the server.  The cookie still read the DateTime.MinValue time.

I found this article: [http://www.eggheadcafe.com/tutorials/aspnet/198ce250-59da-4388-89e5-fce33d725aa7/aspnet-cookies-faq.aspx](http://www.eggheadcafe.com/tutorials/aspnet/198ce250-59da-4388-89e5-fce33d725aa7/aspnet-cookies-faq.aspx)

The articles explains why this happens.  The summary:  the browser maintains the cookie and handles its expiration.  Therefore, it does not send this information back to the server when making a request.  So, you can never read the expiration time of a cookie on the server from the Request object.
