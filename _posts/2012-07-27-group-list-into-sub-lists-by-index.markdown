---
layout: post
title:  "Group List Into Sub-lists by Index"
date:   2012-07-27
description: "Group List Into Sub-lists by Index"
---
##Problem
Everyone once-in-a-while I need to take a flat list (or array, or whatever) of items and divide it up into chunks.  It doesn’t have to be in any real order, necessarily, it just has to be in groups of two, three or four or however many items.  Most recently, I needed this to divide up a list of blog items into chunks of four to display in sets of “pages” that a user would page through with Javascript.

##Solution
I found a great, compact solution on Stack Overflow here: [http://stackoverflow.com/questions/419019/split-list-into-sublists-with-linq](http://stackoverflow.com/questions/419019/split-list-into-sublists-with-linq).  Take a look at answer number one and make sure to pay attention to the warnings others gave about performance for large sets of items.  I’m working on a small set, so it’s not too important in my case.

Here’s the code I used to set a Repeater DataSource:

{% highlight csharp %}
PodsRepeater.DataSource = Data.Items
  .Select((x, i) => new { Index = i, Value = x })
  .GroupBy(obj => obj.Index / 4)
  .Select(obj => obj.Select(v => v.Value).ToList());
{% endhighlight %}
