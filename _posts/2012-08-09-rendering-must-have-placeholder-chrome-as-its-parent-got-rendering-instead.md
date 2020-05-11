---
layout: post
title:  "Rendering must have placeholder chrome as its parent. Got ‘rendering’ instead"
date:   2012-08-09
description: "Rendering must have placeholder chrome as its parent. Got ‘rendering’ instead"
---
##Problem
I got the error message (in my Firebug console) in the Sitecore Page Editor on a page where I had a nested sublayout.  I had a basic two-column layout for the main sublayout of the page.  Then, in the right column, I had another sublayout that further divided up the right column as I needed.  Here is what the nested sublayout looked like:

{% highlight html %}
<sc:Placeholder runat="server" Key="blogRightColumnTop"/>

<div class="sidebar-blog">
  <sc:Placeholder runat="server" Key="blogRightColumnBottomLeft"/>
</div>

<div class="sidebar-ads">
  <sc:Placeholder runat="server" Key="blogRightColumnBottomRight"/>
</div>
{% endhighlight %}

This was a Javascript error that was preventing the Page Editor from fully loading the editor buttons for the edit frames I had on the page.

##Solution
The error message (surprise, surprise) was a little mystifying, but it gave me enough of a clue to think that there was some type of nesting issue.  I noticed that I had a sc:Placeholder element at the top of my nested sub-layout with nothing wrapping it.  Perhaps this was the issue?  I tried this edit to my nested sub-layout:

{% highlight html %}
<div>
  <sc:Placeholder runat="server" Key="blogRightColumnTop"/>

  <div class="sidebar-blog">
    <sc:Placeholder runat="server" Key="blogRightColumnBottomLeft"/>
  </div>

  <div class="sidebar-ads">
    <sc:Placeholder runat="server" Key="blogRightColumnBottomRight"/>
  </div>
</div>
{% endhighlight %}

Notice the single, wrapping div. This worked! So, I’m not sure why, but apparently it solves this nesting problem. Perhaps Sitecore just does not expect a sc:Placeholder to be directly inside of another sc:Placeholder and so wrapping it solves that direct nesting issue.
