---
layout: post
title:  "TaxonomyManager WCF Error in Ektron 8.5 3-tier Setup"
date:   2013-03-15
description: "TaxonomyManager WCF Error in Ektron 8.5 3-tier Setup"
categories: [programming]
tags: [ektron]
---
##Problem
I’m currently working on a project to import data into an existing Ektron 8.5 SP3 installation. It is pulling existing product data from a database, transforming it into the smart form XML we need and then shoving that data into the Ektron installation.  In addition to creating content items, the import tool also updates metadata and taxonomy fields.

The update the taxonomy fields, I use the TaxonomyManager to get the taxonomy by name, then set the taxonomy IDs on TaxonomyItemData objects.  This import tool isn’t running inside of an Ektron installation–it’s a standalone tool–so it takes advantage of Ektron 8.5’s 3-tier setup.  This means the TaxonomyManager calls are going over the wire via the WCF services.

The TaxonomyManager calls were throwing WCF errors, however, saying that the ITaxonomyManager interface was violating the WCF rules of not having any same-named methods.  If you look, the ITaxonomyManager interface defines multiple same-named methods, including two versions of GetList.

This was pretty confusing to me because I couldn’t believe that Ektron would release a major version like 8.5, touting their 3-tier capabilities, without having tested one of the major content managers liket he TaxonomyManager.

##Solution
Whatever the case may be, I started snooping around on the net for others having experienced this issue.  As usual though (also a mystery), I couldn’t find any info on it.  Why does there seem to be so little content on the net about Ektron??

I started snooping around with decompiling the Ektron.Cms.ObjectFactory DLL code where the ITaxonomyManager interface is defined.  Everything looked good–it had the same-named methods, but was using the OperationContract attribute which lets you define the action name.  The two GetList actions were defined with different names, so something wasn’t matching up with the error I was seeing in my import project.  You can see that the two GetList methods have different Action values, making it OK for WCF.

{% highlight csharp %}
[OperationContract(Action="GetList")]
List<TaxonomyData> GetList(TaxonomyCriteria criteria);

[OperationContract(Action="GetListByCustomProperty", Name="GetListByCustomPropertyCriteria")]
List<TaxonomyData> GetList(TaxonomyCustomPropertyCriteria criteria);
{% endhighlight %}

When I decompiled the Ektron.Cms.ObjectFactory DLL that I was using in my import project, I found the problem.  You can see it here:

{% highlight csharp %}
[OperationContract(Action="GetList")]
List<TaxonomyData> GetList(TaxonomyCriteria criteria);

[OperationContract(Action="GetList")]
List<TaxonomyData> GetList(TaxonomyCustomPropertyCriteria criteria);
{% endhighlight %}

Notice how the Action is defined with the same name.  I checked the DLL versions of my DLL and the DLL in the Ektron 8.5 SP3 site I was pushing content too.  They were both the same: 8.5.0.356.  So, somewhere along the line, Ektron fixed the issue without updating the AssemblyFileVersion to signify a bug fix/updated code.  Once I copied the DLL from the SP3 site’s bin folder to my import project, it worked just fine.

So, if you have the same problem somewhere, look for an updated Ektron.Cms.ObjectFactory 8.5 DLL–probably in SP3.
