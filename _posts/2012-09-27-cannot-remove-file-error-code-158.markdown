---
layout: post
title:  "Cannot remove file “master_page_name_here”. Error Code: 158"
date:   2012-09-27
description: "Cannot remove file “master_page_name_here”. Error Code: 158"
---
  UPDATE (9/19/2013):
  Please see Jeff’s comment below for a better solution to this issue using best-practices for iterating through a SPSite’s AllWebs collection.
  There are multiple places online that provide an answer to the error in the title of this post. The scenario is pretty simple: deleting a master page file previously deployed by a feature in the FeatureDeactivating method of a FeatureReceiver.

Posts like this one [http://sharepoint.stackexchange.com/questions/41358/delete-custom-master-page-error-on-feature-deactivation](http://sharepoint.stackexchange.com/questions/41358/delete-custom-master-page-error-on-feature-deactivation) give the right answer (even if it’s sloppy–you don’t need to loop through EACH SPWeb and try to delete the files) but you can still get the error if you’re not careful (like I wasn’t!).

Here was my specific case. In my FeatureDeactivating method I was setting all the SPWebs back to the original v4.master like this:

{% highlight csharp %}
foreach (SPWeb site in siteColl.AllWebs)
{
  site.MasterUrl = masterUrl;
  site.CustomMasterUrl = masterUrl;
  site.Update();
}
{% endhighlight %}

Notice how I am looping through the SPSite.AllWebs SPWebCollection and updating each SPWeb after I reset the master page URLs. Now, here is what I was doing to try to delete the master page file from the _catalogs/masterpage library:

{% highlight csharp %}
string fileUrl = SPUrlUtility.CombineUrl(
  siteColl.ServerRelativeUrl,
  file.FullRelativeUrl);
SPFile spFile = siteColl.RootWeb.GetFile(fileUrl);
try
{
  if (spFile.Exists)
  {
    spFile.Delete();
    spFile.Update();
  }
}
catch { }
{% endhighlight %}

When I would get to the spFile.Delete() line, it would catch the exception whose error message is the title of this post. But why?? The master page wasn’t being referenced anywhere anymore! As I would discover, the problem is on this line:

{% highlight csharp %}
SPFile spFile = siteColl.RootWeb.GetFile(fileUrl);
{% endhighlight %}

Do you see it? I didn’t at first either. The RootWeb SPWeb reference isn’t pointing to the same object that the same SPWeb in the SPSite.AllWebs collection is pointing to. So, technically, the RootWeb object still thinks its master page URLs are pointing to my custom master that I’m trying to delete because it hasn’t had Update() called on it.

To fix it, I had to get my SPFile from one of the SPWebs in SPSite.AllWebs, like this:

{% highlight csharp %}
SPFile spFile = siteColl.AllWebs.First().GetFile(fileUrl);
{% endhighlight %}

That enables me to delete the file with no errors.

## Jeff's comment
Hi Ben,
Great post but I did run into the same issue you were experiencing today. You can fix this issue also by using recommended best practice ([http://msdn.microsoft.com/en-us/library/aa973248(v=office.12).aspx](http://msdn.microsoft.com/en-us/library/aa973248(v=office.12).aspx)) –

Good Coding Practice #2

When iterating through SPWebs dispose of items with the using statement. This will cleanup any issues left in memory

So it might look like this:

{% highlight csharp %}
using(SPSite siteColl = properties.Feature.Parent as SPSite)
{
  foreach (SPWeb site in siteColl.AllWebs)
  {
    site.MasterUrl = masterUrl; site.CustomMasterUrl = masterUrl; site.Update();
  }
}
{% endhighlight %}
