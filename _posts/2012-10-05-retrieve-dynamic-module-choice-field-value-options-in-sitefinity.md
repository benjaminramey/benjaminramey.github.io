---
layout: post
title:  "Retrieve Dynamic Module Choice Field Value Options in Sitefinity"
date:   2012-10-05
description: "Retrieve Dynamic Module Choice Field Value Options in Sitefinity"
---
I am testing out Sitefinity right now for an upcoming project. So far, I really like everything I see. It’s a great CMS and should fit out needs just perfectly (for pretty cheap too).

As with all software though, you will inevitably run into things you can’t do so easily (or, at least, as easily as you think you should be able to). I ran into one of those issues yesterday and finally hacked my way to a solution this morning.

##Problem
My problem was this: how do I retrieve the available options for a Choices field in a dynamic module (built with the Module Builder). Honestly, I’m not sure it really matters. That is, I don’t think Sitefinity validates the value of a Choices field against what is technically a “valid” option. I think I read somewhere that it can store any option. However, I wanted to present a drop-down to users that had values that were essentially controlled by the available choices for this field. Here’s the dialog I’m talking about:

![Choices field choice options](/public/images/2012-10-05-retrieve-dynamic-module-choice-field-value-options-in-sitefinity/choices_dialog.png)

##Solution
Finding a way to retrieve this options through the Sitefinity API (which, in all other respects I’ve investigated so far is really good) was impossible. I started decompiling Sitefinity DLLs to see how it was done and still didn’t really get anywhere. All I could see was the choices being picked up from a config file.

As I read more, I realized this was a bigger clue than I initially thought. The dynamic module information is stored in the App_Data/Sitefinity/Configuration directory in the DynamicModulesConfig.config file. Lo and behold, the options were stored in there–in no less than three places too. Sitefinity has the Config.Get interface for it’s configuration files. However, to get the DynamicModulesConfig.config information, I would have had to call something like Config.Get(). But, the DynamicModulesConfig (in Telerik.Sitefinity.DynamicModules.Configuration) is an internal class. So, I couldn’t do that. I decided upon a “get config file and parse the xml” approach.

Here is my eventual solution. Unless they change the file location or configuration XML structure, it’s pretty safe, albeit a little hacky. I created a simple DynamicModulesHelper class.

{% highlight csharp %}
public static class DynamicModuleHelper
{
    public const string DynamicModulesConfigRelativePath =
    "~/App_Data/Sitefinity/Configuration/DynamicModulesConfig.config";

    public static KeyValuePair<string, string>[] GetChoiceFieldOptions(
    string contentType,
    string dataFieldName)
    {
        XmlNodeList choicesNodes = GetChoiceNodes(contentType, dataFieldName);
        if (choicesNodes == null)
        {
            return new KeyValuePair<string, string>[0];
        }

        var choices = new List<KeyValuePair<string, string>>();
        foreach (XmlNode node in choicesNodes)
        {
            ParseChoiceElement(choices, node);
        }

        return choices.ToArray();
    }

    private static void ParseChoiceElement(
    List<KeyValuePair<string, string>> choices,
    XmlNode node)
    {
        if (node == null || node.Attributes == null)
        {
            return;
        }

        string key, value;
        key = value = string.Empty;
        if (node.Attributes["text"] != null)
        {
            key = node.Attributes["text"].Value;
        }
        if (node.Attributes["value"] != null)
        {
            value = node.Attributes["value"].Value;
        }

        if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
        {
            choices.Add(new KeyValuePair<string, string>(key, value));
        }
    }

    private static XmlNodeList GetChoiceNodes(
    string contentType,
    string dataFieldName)
    {
        string dynamicModulesConfigPath = HttpContext.Current.Server.MapPath(
        DynamicModulesConfigRelativePath);
        XmlDocument xml = new ConfigXmlDocument();
        string xpath = string.Concat(
        "/dynamicModulesConfig/contentViewControls",
        string.Format("/contentViewControl[@contentType='{0}’]", contentType),
        "//view[@displayMode=’Read’]",
        string.Format("//field[@dataFieldName='{0}’]", dataFieldName),
        "/choicesConfig/element"
        );

        xml.Load(dynamicModulesConfigPath);
        XmlNodeList choicesNodes = xml.SelectNodes(xpath);
        return choicesNodes;
    }
}
{% endhighlight %}

To get the Choices field options, you call the GetChoiceFieldOptions method, passing in the dynamic module’s content type string (like this one: “Telerik.Sitefinity.DynamicTypes.Model.TestModule.TestModule”) and the name of the Choices field (like this: “RandomChoices”). So, my particular call for just a goofy test module I created was this:

{% highlight csharp %}
KeyValuePair<string, string>[] choices = DynamicModuleHelper.GetChoiceFieldOptions(
    "Telerik.Sitefinity.DynamicTypes.Model.TestModule.TestModule",
    "RandomChoices");
{% endhighlight %}
