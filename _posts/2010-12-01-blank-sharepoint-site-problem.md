---
layout: post
title:  "Blank SharePoint Site Problem"
date:   2011-12-01
description: "Blank SharePoint Site Problem"
---
##Problem
A SharePoint site renders completely blank in the browser. It shows up immediately without any “processing” time and when looking at the HTML source for the page, it is completely blank–no HTML tags whatsoever.

##Solution
In my case, the web.config file for the SharePoint application had duplicate entries in the system.webServer/handlers and system.webServer/modules elements. Once I removed those, the site rendered as expected.
