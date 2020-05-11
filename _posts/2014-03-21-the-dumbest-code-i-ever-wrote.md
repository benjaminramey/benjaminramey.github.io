---
layout: post
title:  "The Dumbest Code I Ever Wrote"
date:   2014-03-21
description: "The Dumbest Code I Ever Wrote"
categories: [programming]
tags: []
---

Here it is, folks: some of the dumbest code I’ve ever written and I just now noticed it.

{% highlight csharp %}
string.Concat("attachment; filename=\"", string.Concat(pagePdf.Name, ".pdf"), "\"");
{% endhighlight %}
