---
layout: post
title:  "Sitecore Rocks and SharePoint Package Interference"
date:   2013-05-08
description: "Sitecore Rocks and SharePoint Package Interference"
categories: [programming]
tags: [sitecore]
---
I ran into an interesting problem today while working in Visual Studio 2010 on a SharePoint 2010 project.

You are supposed to be able to open the Package.package files to edit the Features that are included and their order, etc.  However, when I double-clicked on the Package.package file to open it, I got a strange dialog box that said the document was already open, would I like to close it?  If I said “yes”, another “Package Connection” dialog box would open with all the IIS sites I had setup listed.  However, none of my SharePoint sites were listed and choosing any of the other sites just failed.

I have no idea why, honestly, but apparently Sitecore Rocks is causing this issue.  I had the Visual Studio extension enabled (I had worked on a Sitecore project a few months ago).  When I disabled it and restarted Visual Studio, everything worked as I expected when opening Package files.
