---
layout: post
title:  "Indexing Taxonomy Fields For Search in Sitefinity 5.1"
date:   2012-10-19
description: "Indexing Taxonomy Fields For Search in Sitefinity 5.1"
categories: [programming]
tags: [sitefinity]
---
##Problem
We recently ran into a rather surprising issue with a Sitefinity 5.1 installation. We wanted a pretty simple feature: when searching and using Lucene, we wanted the values of any taxonomy fields to be indexed with Sitefinity’s Lucene back-end so that items could be searched by their attached taxonomy. This is apparently impossible with the basic installation because you can only search short text and long text fields.

So, I began on a quest to implement this somehow and ran into another wall: the Sitefinity documentation on their search API is horrendously non-existent. We mostly had to rely on forum posts and decompiling Telerik assemblies to see how stuff worked. But, this did eventually lead to a solid solution.

##Solution
It took me about 13 hours of research to figure out what to do and then just about an hour to actually implement. So, the good news is that it’s a pretty simple solution!

When you create a search index in Sitefinity’s back-end, you can add a comma-separated list of extra fields to index. Sitefinity indexes a standard set (like Title). But, if you create custom dynamic modules with other fields you want to index you have to add them in this Additional Fields box. Here here:

![Additional Fields](/public/images/2012-10-19-indexing-taxonomy-fields-for-search-in-sitefinity-51/addtionalfields.png)

Looking through the de-compiled code for Sitefinity’s SearchModule, I found that it registered a special outbound pipe that updates the Lucene indexes (not directly, but through Sitefinity’s abstraction, it appears) when you publish an item. It also registered various Translator classes with PipeTranslatorFactory.RegisterTranslator. Digging through the code in that SearchIndexOutboundPipe and the various translator classes it registered, I finally found that when the SearchIndexOutboundPipe runs, it reads that comma-separated list of additional fields from your index and ties them to the ConcatenationTranslator through some type of mapping. It looked like these translators were being used by the SearchModule to translate content values into index-able values for the Lucene indexing system.

Turns out, I was right. With some more trial and error from that point on, I came up with this solution.

Override ConcatenationTranslator
First of all, you need to create a new class that inherits from ConcatenationTranslator. This is a public class in the Telerik.Sitefinity.Publishing.Translators namespace. I called my class CustomConcatenationTranslator. IN the base class, the Translate method turns an array of object values into a space-separated string. I’ll show the code in a minute, but the first thing you need to do after creating the class is register it with the pipeline. In Global.asax.cs, add these lines (around any other code you have there):

{% highlight csharp %}
protected void Application_Start(object sender, EventArgs e)
{
  Bootstrapper.Initialized += Bootstrapper_Initialized;
}

private void Bootstrapper_Initialized(object sender, Telerik.Sitefinity.Data.ExecutedEventArgs e)
{
  if (e.CommandName == "Bootstrapped")
  {
    PipeTranslatorFactory.RegisterTranslator(new CustomConcatenationTranslator());
  }
}
{% endhighlight %}

You don’t have to unregistered the existing ConcatenationTranslator. Your registration will replace it as long as you don’t rename the translator by overriding it’s Name property.

What I wanted to do was check if the data being translated was a TrackedList<Guid> type. This is what your taxonomy fields are in code. Here is my code for the CustomConcatenationTranslator class.

{% highlight csharp %}
public class CustomConcatenationTranslator : ConcatenationTranslator
{
  private readonly TaxonomyManager _taxonomyManager;

  public CustomConcatenationTranslator()
  {
    _taxonomyManager = TaxonomyManager.GetManager();
  }

  public override object Translate(object[] data, IDictionary<string, string> translationSettings)
  {
    if (data.Length <= 0)
    {
      return string.Empty;
    }

    StringBuilder concatedStr = new StringBuilder();
    ConcatValues(data, concatedStr);
    return concatedStr.ToString();
  }

  private static bool IsTrackedList<T>(object data)
  {
    return data is TrackedList<T>;
  }

  private void ConcatValues(object[] data, StringBuilder concatedStr)
  {
    for (int i = 0; i < data.Length; i++)
    {
      string str;
      if (IsTrackedList<Guid>(data[i]))
      {
        str = TranslatedTaxonomies(data, i);
      }
      else
      {
        str = GetString(data[i]);
      }

      concatedStr.Append(str);
      if (i + 1 < data.Length)
      {
        concatedStr.Append(‘ ‘);
      }
    }
  }

  private string TranslatedTaxonomies(object[] data, int i)
  {
    List<string> taxNames = new List<string>();
    foreach (Guid guid in ((TrackedList<Guid>)data[i]))
    {
      var taxon = _taxonomyManager.GetTaxon(guid);
      taxNames.Add(taxon.Name);
    }

    return string.Join(" ", taxNames);
  }
}
{% endhighlight %}

It should be pretty simple to follow. Basically, if I find a data value is a TrackedList<Guid>, I get the Taxon items with that Guid ID, get the name of that Taxon and then concatenate those values, separated by a space. If the data object is anything other than a TrackedList<Guid>, I used the default ConcatenationTranslator behavior.

Conclusion
That’s really all you need to do. Just go into your Sitefinity back-end, re-index your search index and you can now search your content by any taxonomy it has attached to it.
