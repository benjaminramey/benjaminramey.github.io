---
layout: post
title:  "Visual Studio Post Build Event to Copy DLLs"
date:   2010-06-29
description: "Visual Studio Post Build Event to Copy DLLs"
---
While doing SharePoint development, we use a lot of pre- and post-build events in Visual Studio projects to do various things like build and deploy SharePoint solutions to our development environments, activate features automatically and other similar things to make the process of building solutions for SharePoint as automated as possible.

One helpful way I’ve been able to use post-build events is to copy the compiled DLLs for a given project to the inetpub directory for the SharePoint site I am currently working on. As I’m building a new feature or debugging an existing one, I like to build a lot of see my changes as I go. Well, building and deploying the entire SharePoint solution is a rather lengthy process it’s only really necessary if you’re changing ASPX pages or updating a feature XML file or something like that. If all I did was come C# code changes, that’s too much to wait through to see my changes. So, what I do is put a small post-build event in my projects that I’m working with that copies the DLLs for that project to my SharePoint site’s inetpub directory and I skip the whole SharePoint solution build and deployment step.

Adding a post-build event couldn’t be much simpler either. In Visual Studio just right-click on the project you want to add the post-build event for in Solution Explorer and select “Properties”. You can either do that or, with the project selected in Solution Explorer, hit Alt-Enter. The project properties window will display. On the left-hand side, click the “Build Events” tab. You’ll see two boxes there. One is for pre-build events and one is for post-build events.

{% highlight %}
In the post-build events textbox add the following:
IF NOT ($(ConfigurationName)) == (Debug) GOTO END
cd $(ProjectDir)
copy /y bin\debug\*.dll C:\inetpub\wwwroot\wss\VirtualDirectories\{YOUR SHAREPOINT SITE DIRECTORY}\bin
copy /y bin\debug\*.pdb C:\inetpub\wwwroot\wss\VirtualDirectories\{YOUR SHAREPOINT SITE DIRECTORY}\bin
:END
{% endhighlight %}

These are just basic Windows batch commands like you’d find in any Windows batch file. This is a very basic setup, but it should be a good starting point for you to work from. All it does is check whether you are building with your Debug build configuration, if you are, then it moves to your project directory and copies the DLLs in your bin\debug folder to the bin folder of your SharePoint site.

Easy enough!
