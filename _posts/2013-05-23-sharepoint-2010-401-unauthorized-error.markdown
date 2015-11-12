---
layout: post
title:  "SharePoint 2010 401 Unauthorized Error"
date:   2013-05-23
description: "SharePoint 2010 401 Unauthorized Error"
---

There are many, many reasons why SharePoint will throw a 401 error.  Most of them are hard to track down and have absolutely no bearing on reality unless you’re a genius.  So, your only hope is to track down obscure registry updates (hacks), scour the internet for random things other people have found or just give up.  :-)

I just about pulled my hair out yesterday trying to get to the bottom of a 401 Unauthorized error I kept getting for my anonymous access-enabled web application.  I’m not sure why, but I never tried debugging my application to see where the error was actually being thrown.  I assumed it was on the IIS level or some SharePoint level, so I never tried debugging.

So, lesson #1 when getting 401 in SharePoint: debug your application.

Lesson #2: apparently accessing the DefaultPage property of a PublishingWeb requires elevated privileges.  Here was my code:

{% highlight csharp %}
private string GetDefaultPageUrl()
{
  if (!PublishingWeb.IsPublishingWeb(SPContext.Current.Web))
  {
    return string.Empty;
  }

  PublishingWeb web = PublishingWeb.GetPublishingWeb(SPContext.Current.Web);
  if (web == null)
  {
    return string.Empty;
  }

  return web.DefaultPage == null ? string.Empty : web.DefaultPage.Url;
}
{% endhighlight %}

That last line was throwing the 401. So, the solution was to wrap it in an SPSecurity.RunWithElevatedPrivileges call, like this:

{% highlight csharp %}
private string GetDefaultPageUrl()
{
  string url = string.Empty;
  SPSite currentSite = SPContext.Current.Site;
  SPWeb currentWeb = SPContext.Current.Web;

  SPSecurity.RunWithElevatedPrivileges(
  () =>
  {
    // reopen site & web, otherwise defaultpage will throw an error
    using (SPSite site = new SPSite(currentSite.ID))
    using (SPWeb web = site.OpenWeb(currentWeb.ID))
    {
      if (!PublishingWeb.IsPublishingWeb(web))
      {
        return;
      }

      PublishingWeb pubWeb = PublishingWeb.GetPublishingWeb(web);
      if (web == null)
      {
        return;
      }

      url = pubWeb.DefaultPage == null ? string.Empty : pubWeb.DefaultPage.Url;
    }
  });
  return url;
}
{% endhighlight %}

Thanks to this post for the answer about re-opening the site and web inside the RunWithElevatedPrivileges code:
[http://henry-chong.com/2010/11/sharepoint-anonymous-access-and-publishing-web-default-page](http://henry-chong.com/2010/11/sharepoint-anonymous-access-and-publishing-web-default-page).
