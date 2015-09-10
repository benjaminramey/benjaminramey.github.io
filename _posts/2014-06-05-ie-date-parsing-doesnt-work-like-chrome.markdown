---
title:  "IE Date Parsing Doesn’t Work Like Chrome"
date:   2014-06-05
description: "IE Date Parsing Doesn’t Work Like Chrome"
---

I noticed a goofy issue today while working with a jQuery countdown plugin.  This plugin allows you to set an “until” date so that you counter counts down to zero at a certain date and time.

I was setting the date like this:

{% highlight javascript %}
element.countdown({
until: new Date(’10/13/14 00:00:00′)
});
{% endhighlight %}

In Chrome, this worked just fine.  The string “10/13/14 00:00:00″ parsed to a Date object for midnight on October 13th, 2014.

In IE, however (versions10, 9 and 8 at least) it parsed as October 13th, 1914.  Why?  Who knows.  Updating my string to “10/13/2014 00:00:00″ fixed it.  My final javascript looked like this:

{% highlight javascript %}
element.countdown({
until: new Date(’10/13/2014 00:00:00′)
});
{% endhighlight %}

So, be aware of this oddity!  It caused my whole countdown widget to screw up because the current time was already past the “until” date.#