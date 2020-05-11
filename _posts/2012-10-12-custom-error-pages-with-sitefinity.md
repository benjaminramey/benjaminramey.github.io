---
layout: post
title:  "Custom Error Pages with Sitefinity"
date:   2012-10-12
description: "Custom Error Pages with Sitefinity"
categories: [programming]
tags: [sitefinity,.net]
---
I had a considerably hard time today getting just a simple 404 error page (custom) to show up in all cases for a Sitefinity installation. It probably has nothing to do with Sitefinity and a lot more to do with my lack of experience doing this simple task. But, anyhow, here are my findings.

You have to setup the error pages in two places in the application’s web.config to cover all of your bases.

##system.web/customErrors
You have to setup your error pages in the system.web/customErrors section of your web.config to cover calls to non-existent *.aspx pages (and probably other ASP.NET-handled pages as well). My customErrors section looks like this. It will be expanded to cover other error codes.
{% highlight xml %}
<customErrors mode="On" redirectMode="ResponseRewrite">
  <error statusCode="404" redirect="~/Static/404.htm"/>
</customErrors>
{% endhighlight %}

##system.webServer/httpErrors
The next section you need is the system.webServer/httpErrors section. I never knew this section exists, but it corresponds to the Errors panel in IIS Manager 7.5 for your website. This section covers request for non-existing folders and static files (like /bogusFolder or /bogusFile.htm). Mine looks like this and it will likewise be expanded for other error codes.
{% highlight xml %}
<httpErrors errorMode="Custom" defaultResponseMode="File">
  <remove statusCode="404"/>
  <error statusCode="404" path="Static\404.htm"/>
</httpErrors>
{% endhighlight %}

Because IIS has default settings for this stuff, you need to use the remove element before adding your own error messages. You can find more specifics on this configuration element here: [http://www.iis.net/configreference/system.webserver/httperrors](http://www.iis.net/configreference/system.webserver/httperrors).

You have other options than the defaultResponseMode=”File” for the httpErrors section. See the link above for more information about this. You can redirect to *.aspx files and stuff for more dynamically handled pages. I wanted very simple, static HTML pages to ensure maximum possibility of the page rendering and displaying a legible error to the user.
