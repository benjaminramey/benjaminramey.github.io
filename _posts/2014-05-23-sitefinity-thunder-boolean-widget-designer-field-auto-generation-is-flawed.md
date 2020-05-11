---
layout: post
title:  "Sitefinity Thunder Boolean Widget Designer Field Auto-Generation is Flawed"
date:   2014-05-23
description: "Sitefinity Thunder Boolean Widget Designer Field Auto-Generation is Flawed"
---

##Problem

When you use Sitefinity Thunder (a great help, by the way) to generate a Widget Designer for an existing widget that has a boolean property, you get this javascript in the auto-generated javascript file (let’s say my boolean field is named HasSubMenu):

{% highlight javascript %}
/* RefreshUI HasSubMenu */
jQuery(this.get_hasSubMenu()).attr("checked", controlData.HasSubMenu);
{% endhighlight %}

This code is in the refreshUI method.  It’s supposed to mark a checkbox as checked if HasSubMenu is true and not check it if it’s false.  The problem is, for some reason, HasSubMenu is a string in Javascript instead of a real boolean. So, HasSubMenu will be either “true” or “false”–both of which are true values in Javascript.  That is, because “true” and “false” are both non-empty strings, they evaluate to true when used as an expression.

This means, no matter what you do with the checkbox, the next time you click “Edit” for this widget, the checkbox will be checked and your data is effectively corrupted.

##Solution

The solution is pretty simple.  Instead of using controlData.HasSubMenu for the expression by itself, update your Javascript so that you check if the string is “true” or not: controlData.HasSubMenu === "true".  The line in the refreshUI method should now look like this:

{% highlight javascript %}
/* RefreshUI HasSubMenu */
jQuery(this.get_hasSubMenu()).attr("checked", controlData.HasSubMenu === "true");
{% endhighlight %}

Now your checkbox will keep it’s value as you would expect.
