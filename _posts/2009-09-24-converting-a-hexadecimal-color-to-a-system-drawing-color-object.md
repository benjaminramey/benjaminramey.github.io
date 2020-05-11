---
layout: post
title:  "Converting a Hexadecimal Color to a System.Drawing.Color Object"
date:   2009-09-24
description: "Converting a Hexadecimal Color to a System.Drawing.Color Object"
---
I try to avoid setting styles in my code as much as possible. However, I ran across a case using a DevExpress PageControl control where there was no possible way to set a certain border by using CSS. This is because DevExpress wisely (read sarcasm) uses “border-color: #whatever !important” in the element’s style attribute. So, there is no way to override that style except by setting it on the control in code (or your aspx page).

The particular border I needed is the ContentStyle.Border border of the ASPxPageControl and I needed to set the BorderColor property which is a System.Drawing.Color object. There isn’t any straightforward way to get a Color object from a hexadecimal color using the Color object itself. You have to use the ColorTranslator (also in the System.Drawing namespace) which gives you a FromHtml method and returns the correct Color object.

{% highlight csharp %}
Color hexColor = ColorTranslator.FromHtml(“#666666″);
{% endhighlight %}

Thanks to this guy for the quick answer:
[http://www.akxl.net/labs/articles/converting-a-hexadecimal-color-to-a-system.drawing.color-object/](http://www.akxl.net/labs/articles/converting-a-hexadecimal-color-to-a-system.drawing.color-object/)