---
layout: post
title:  "'Specified method is not supported' error when deleting SharePoint site"
date:   2012-09-25
description: "'Specified method is not supported' error when deleting SharePoint site"
categories: [programming]
tags: [sharepoint]
---
I was getting a “Specified method is not supported” error when I tried to delete some test sites in SharePoint 2010 today. I found a great link that gave several solutions to deletion errors. Issue #1 under this link is what I needed:

[SharePoint 2010: Unable to delete site/web after SP1](http://www.benramey.com/2012/09/25/specified-method-is-not-supported-error-when-deleting-sharepoint-site/#)

Even though I got an error executing the Upgrade-SPContentDatabase PowerShell command, it still fixed the problem with deleting the sites.
