---
layout: post
title:  "SharePoint 2007 to 2010 in-place upgrade serviceHostingEnvironment error"
date:   2010-10-06
description: "SharePoint 2007 to 2010 in-place upgrade serviceHostingEnvironment error"
categories: [programming]
tags: [sharepoint]
---
I’m testing an in-place SharePoint 2007 to SharePoint 2010 upgrade today and I came across this odd error during the update process.

I successfully installed SharePoint 2010 and proceeded to run the configuration wizard which updates 2007 to 2010.  The configuration process would always fail with an error in the Central Administration web.config file.  Viewing the configuration log file (the configuration wizard provided the location of it) turned up the error.

Apparently, at some point in the process the configuration wizard looks for the serviceHostingEnvironment element under the `<system.serviceModel>` section in the Central Administration web.config.

{% highlight xml %}
<serviceHostingEnvironment aspNetCompatibilityEnabled=”true” />
{% endhighlight %}

If it doesn’t find it adds it itself, but curiously, it wraps it in an incomplete system.serviceModel tag so it looks like this:

{% highlight xml %}
<system.serviceModel>
<serviceHostingEnvironment aspNetCompatibilityEnabled=”true” />
</system.serviceModel>
{% endhighlight %}

This then caused the configuration wizard to bomb out.

The simple solution was to just add the `<serviceHostingEnvironment aspNetCompatibilityEnabled=”true” />` element under my existing `<system.serviceModel>` section.  The wizard completed just fine after this.
