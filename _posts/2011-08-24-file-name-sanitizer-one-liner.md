---
layout: post
title:  "File Name Sanitizer One-Liner"
date:   2011-08-24
description: "File Name Sanitizer One-Liner"
categories: [programming]
tags: [command-line]
---
I find myself often having to sanitize file names and paths because I’m creating files from some kind of user input that I’m unsure about.  I found this handy way of doing this in one line today:

{% highlight text %}
fileName = Path.GetInvalidFileNameChars().Aggregate(fileName, (name, c) => name.Replace(c, ‘_’));
{% endhighlight %}

Note that the same goes for paths. The only thing that changes is the static method you use from Path:

{% highlight text %}
filePath = Path.GetInvalidPathChars().Aggregate(filePath , (name, c) => name.Replace(c, ‘_’));
{% endhighlight %}
