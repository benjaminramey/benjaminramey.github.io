---
layout: post
title:  "Ektron Paths"
date:   2013-03-15
description: "Ektron Paths"
categories: [programming]
tags: [ektron]
---
For future reference, here is how you have to construct paths for finding Ektron content items, folders and taxonomy items.

##FolderManager and ContentManager

Use forward slashes (/)
Do NOT include an initial slash
DO include a trailing slash
Example: “folder1/folder2/otherfolder/”
Given this code:

{% highlight csharp %}
FolderManager fm = new FolderManager();
FolderCriteria folderCrit = new FolderCriteria();
folderCrit.AddFilter(
FolderProperty.FolderPath,
CriteriaFilterOperator.EqualTo,
folderPath);

FolderData folder = fm.GetList(folderCrit).FirstOrDefault();
{% endhighlight %}

Then the “folderPath” variable needs to be in this format: “folderName1/folderName2/”.  The same would apply for finding all the content in a folder via the contents’ path.

##TaxonomyManager

Use backslashes (\)
DO use an initial slash
Do NOT use a trailing slash
Example: “\taxonomy1\taxonomy2\othertaxonomy”
So, given this code:

{% highlight csharp %}
ITaxonomyManager _taxManager = ObjectFactory.GetTaxonomyManager();
TaxonomyData tax = _taxManager.GetItem(taxPath);
{% endhighlight %}

The “taxPath” variable needs to be in this format: “\rootTaxonomyName\subTaxonomyName1\subTaxonomyName2″.
