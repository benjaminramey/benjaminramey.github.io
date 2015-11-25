---
layout: post
title:  "ANSI/UTF-8 Encoding Problem"
date:   2011-11-14
description: "ANSI/UTF-8 Encoding Problem"
---
##Problem
I ran into a problem in a project I was working on recently.  The basics of the project were to take data out of a MySQL database and transform that data into an XML file schema for a
[Day CQ5 CMS](http://day.com/day/en/products.html)
[Java Content Repository (JCR)](http://www.ibm.com/developerworks/java/library/j-jcr/).

I kept running into an issue with certain text fields of user-entered data where I would get all these funky, special characters in the text.  I knew it had to be some kind of encoding issue where I wasn’t outputting or getting the data with the right character encoding.

I don’t know much about character encoding, except that there is a difference between them!

##Solution
After some digging around and playing with Notepad++ (where I could switch the encoding of the text), I found at least a glimmer of hope.  When I had the character encoding set to ANSI in Notepad++, pasted in the troublesome text, and then switched the encoding to UTF-8, all of my problems disappeared.

So, eventually, I came up with these few lines of code which convert the encoding of my text and fixed all of my problems.  Woohoo!

{% highlight csharp %}
Encoding targetEncoding = Encoding.GetEncoding(1252);
byte[] utf8Bytes = targetEncoding.GetBytes(text);
byte[] ansiBytes = Encoding.Convert(Encoding.UTF8,
targetEncoding,
utf8Bytes);
return targetEncoding.GetString(ansiBytes);
{% endhighlight %}

What this simple code does is first get the Encoding for the ANSI character encoding (1252 is ANSI, apparently). It then gets the bytes of the string with the ANSI encoding, converts them from the ANSI encoding to UTF-8 encoding and then gets the string with the ANSI encoding.

So, quite honestly, I’m not 100% sure why this works. The Notepad++ experiment would seem to indicate the opposite: that I had to convert from ANSI to UTF-8. But, that only compounded the problem when I wrote it that way in code. When I reversed the conversion, it worked as I was hoping.
