---
layout: post
title:  "SharePoint 2010 Page Layout Button Javascript Error"
date:   2013-09-25
description: "SharePoint 2010 Page Layout Button Javascript Error"
---
I ran across an issue today in SharePoint 2010 where the Page Layout button would not open. It would throw the following error in Internet Explorer:

{% highlight javascript %}
SCRIPT5007: Unable to get property ‘nodeName’ of undefined or null reference
cui.js, line 2 character 6422
{% endhighlight %}

The following link gave me the answer.

[SharePoint 2010 – Quick Fix for Ribbon Page Layout switch JavaScript error](http://johnliu.net/blog/2010/12/22/sharepoint-2010-quick-fix-for-ribbon-page-layout-switch-java.html)
