---
layout: post
title:  "Replacing newline characters in VB.NET strings"
date:   2012-06-12
description: "Replacing newline characters in VB.NET strings"
categories: [programming]
tags: [vb.net]
---
I’m not very familiar (which I am actually very happy for!) with VB.NET and so I had a hard time figuring out how to trim newline characters from a string in a Reporting Services report I was working on.

Turns out none of the “regular” methods really work.  The Trim function only removes spaces and anything like Replace(“string”, “\n”, “”) didn’t work.

You have to use the Chr(13) or Chr(10) functions to actually get the character values for the newline characters.  So, my solution looked like this:

{% highlight csharp %}
Replace(Replace(stringVariable, Chr(10), “”), Chr(13), “”)
{% endhighlight %}

Thanks to this forum post for providing the clues:
[http://www.daniweb.com/forums/thread54797.html](http://www.daniweb.com/forums/thread54797.html)
