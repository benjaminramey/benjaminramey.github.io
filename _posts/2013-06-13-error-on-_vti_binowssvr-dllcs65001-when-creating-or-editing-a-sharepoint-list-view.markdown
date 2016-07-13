---
layout: post
title:  "Error on /_vti_bin/owssvr.dll?cs=65001 When Creating or Editing a SharePoint List View"
date:   2013-06-13
description: "Error on /_vti_bin/owssvr.dll?cs=65001 When Creating or Editing a SharePoint List View"
---

  UPDATE (6/14/2013):
  After some further issues I encountered (unrelated to the OWSSVR.dll error, but on this module) I found out that the problem is with accessing query string parameters (at least). However, accessing the HttpRequest object’s Url property, for example, doesn’t cause this error.

  So, I moved my code back to the BeginRequest event (to solve my other problem) and then I just did a simple HttpContext.Current.Request.Url.AbsoluteUri.Contains(“owssvr”) check to go on and check the query string parameters or not.

## Problem
I was recently very frustrated by the dreaded “Cannot complete this action” error on a SharePoint 2010 project when trying to edit or create a new view for any list.  I looked around and found several causes that others had pinpointed, but nothing really related to the specific situation I was seeing.  I wasn’t seeing this on a particular list or set of lists.  I could create an out-of-the-box SharePoint Document Library and get this error when trying to edit or create a view.

What finally got me on the right track was this link here that a co-worker of mine found:

[MSDN forum thread](http://social.msdn.microsoft.com/Forums/en-US/sharepointdevelopmentprevious/thread/ea0b1380-480f-4b2e-afde-77ed06995bb0)

In a response to the question in that thread, it is mentioned that accessing the SPContext static object in an HttpModule causes this error when the /_vti_bin/owssvr.dll is accessed.  Great!  There was only one problem for me: my HttpModule was not accessing the SPContext object anywhere. Nevertheless, when I removed my HttpModules from the web.config, the list editing and creation worked.  So, it was definitely something with my modules.

Still, the post mentioned above got me on the right track.  By commenting out code a bit at a time, I narrowed the problem down to a check for the HttpContext.Current.Request object that I was performing.  This is probably the same error that is caused by the SPContext object, since, as I understand it, the SPContext object just wraps the HttpContext object.

I had the following code in my HttpModule.  Here is what Init method looked like:

{% highlight csharp %}
public void Init(HttpApplication context)
{
  context.BeginRequest += SetupOutputFilter;
  context.PreSendRequestHeaders += WritePdfHeaders;
  context.PreSendRequestContent += WritePdfToOutput;
}
{% endhighlight %}

Commenting out the tie into the BeginRequest event fixed the issue, so it had to be something there. SetupOutputFilter looked like this:

{% highlight csharp %}
private void SetupOutputFilter(object sender, EventArgs e)
{
  if (!IsPdfRequest)
  {
    return;
  }

  HttpResponse response = HttpContext.Current.Response;
  _pdfStream = new PdfMemoryStream(response.Filter);
  response.Filter = _pdfStream;
}
{% endhighlight %}

Commenting out the if expression also fixed the issue. My IsPdfRequest property looked like this:

{% highlight csharp %}
private static bool IsPdfRequest
{
  get
  {
    return !string.IsNullOrEmpty(HttpContext.Current.Request["as"])
          && HttpContext.Current.Request["as"] == "pdf";
  }
}
{% endhighlight %}

And there you have my access to the HttpContext object. I kind of needed this though, so I thought it might be a timing issue. Maybe accessing this on BeginRequest was the problem. I took a look at the ordering of the HttpModule events to find a good replacement. This StackOverflow thread helped me there:

[StackOverflow thread](http://stackoverflow.com/questions/441421/httpmodule-event-execution-order)

## Solution

By switching my SetOutputFilter method from the BeginRequest event to the PostReleaseRequestState event, I was able to fix the issue.

So, the lesson here is this: if you need HttpModules for your SharePoint 2010 project, make sure they do not access the HttpContext object anywhere in the BeginRequest event.
