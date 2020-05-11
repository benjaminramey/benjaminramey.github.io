---
layout: post
title:  "jQuery Tools Overlay v1.2.5 Bug"
date:   2011-11-21
description: "jQuery Tools Overlay v1.2.5 Bug"
categories: [programming]
tags: [jquery]
---
##Problem
I noticed a bug in the jQuery Tools library today, specifically in version 1.2.5 and the Overlay plugin. I should say, I’m assuming it’s a bug. This is an existing website I am working on where I am not in a position to upgrade the jQuery Tools library to the latest version (1.2.6 is out, it looks like) and I don’t know how much of the problem may be due to how existing code is possibly interfering with the library.

In any case, the bug showed up when I had an existing overlay showing and wanted to show another overlay. By default, the library allows one overlay at a time. This was fine with me as I needed to close the existing overlay before showing the new one. The library handles this automatically. However, when the second overlay was displayed, the mask would not display and the z-index was not set, so it showed up behind other content.

##Solution
While it’s somewhat of a hack, the best solution I found was to simply remove the div that Overlay creates with id “exposeMask” before I display the second overlay.

{% highlight text %}
$(“#exposeMask”).remove();
{% endhighlight %}

I believe this is what is happening: when the first overlay is closed by the library, it doesn’t properly handle the existing exposeMask div and so when the second overlay shows it misunderstands the mask to be displaying properly and doesn’t calculate its own display values properly. Therefore, its z-index is wrong (or non-existing) and the mask remains hidden (because the library hid it when it closed the first overlay).
