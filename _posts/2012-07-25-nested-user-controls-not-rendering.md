---
layout: post
title:  "Nested User Controls Not Rendering"
date:   2012-07-25
description: "Nested User Controls Not Rendering"
---
##Problem
I got caught today in a stupid problem.  But, it wasn’t obvious (at least to me) at first what was causing it.  I was doing something simple: nesting one UserControl inside of another.  But, the nested UserControl wasn’t showing up.  I couldn’t, for the life of me, figure out what I had done wrong.  If I didn’t nest the control, it worked fine.

##Solution
The solution was just correctly a stupid oversight on my part.  I use ReSharper, so what I would do is just type the control prefix, colon then the name of the control and ReSharper would give me the suggestion to add the right Register tag.  Well, ReSharper looks at it like a WebControl, not a UserControl.  So, the Register tag is adds looks like this:

{% highlight csharp %}
<%@ Register TagPrefix="ogden" Namespace="Ogden.Web.controls" Assembly="Ogden.Web" %>
{% endhighlight %}

It should look like this:

{% highlight csharp %}
<%@ Register TagPrefix="ogden" TagName="BlogComments" src="BlogComments.ascx" %>
{% endhighlight %}

So, if you’re dumb like me, make sure you have the right Register tag if you’re nesting a UserControl (or using a UserControl anywhere really).
