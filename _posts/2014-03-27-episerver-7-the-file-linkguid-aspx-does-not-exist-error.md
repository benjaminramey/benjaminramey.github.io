---
layout: post
title:  "EPiServer 7 “The file ‘/link/GUID.aspx’ does not exist.” Error"
date:   2014-03-27
description: "EPiServer 7 “The file ‘/link/GUID.aspx’ does not exist.” Error"
categories: [programming]
tags: [episerver]
---

I ran into the following error while working with an installation of EPiServer 7 this week. It took me a long time to finally figure out the solution.

First, here’s the error and stack trace:

{% highlight text %}
2014-03-27 12:12:43,396 [6] ERROR EPiServer.Global: 1.2.5 Unhandled exception in ASP.NET
System.Web.HttpException (0x80004005): The file ‘/link/cc299342a697494c8a4bc47717210bf0.aspx’ does not exist.
at System.Web.Compilation.BuildManager.GetVPathBuildResultInternal(VirtualPath virtualPath, Boolean noBuild, Boolean allowCrossApp, Boolean allowBuildInPrecompile, Boolean throwIfNotFound, Boolean ensureIsUpToDate)
at System.Web.Compilation.BuildManager.GetVPathBuildResultWithNoAssert(HttpContext context, VirtualPath virtualPath, Boolean noBuild, Boolean allowCrossApp, Boolean allowBuildInPrecompile, Boolean throwIfNotFound, Boolean ensureIsUpToDate)
at System.Web.Compilation.BuildManager.GetVirtualPathObjectFactory(VirtualPath virtualPath, HttpContext context, Boolean allowCrossApp, Boolean throwIfNotFound)
at System.Web.Compilation.BuildManager.CreateInstanceFromVirtualPath(VirtualPath virtualPath, Type requiredBaseType, HttpContext context, Boolean allowCrossApp)
at System.Web.Routing.PageRouteHandler.GetHttpHandler(RequestContext requestContext)
at System.Web.Routing.UrlRoutingModule.PostResolveRequestCache(HttpContextBase context)
at System.Web.HttpApplication.SyncEventExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute()
at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)
{% endhighlight %}

As it turns out, I did not have a TemplateDescriptor attribute on the page template that I was trying to access. Adding the following TemplateDescriptor attribute to the code-behind class for my page template saved me.

{% highlight csharp %}
[TemplateDescriptor(Path = "~/Templates/PageTemplates/Home.aspx")]
public partial class Home : TemplatePage<HomePage>
{% endhighlight %}
