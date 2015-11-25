---
layout: post
title:  "Determine SharePoint MOSS 2007 Service Pack Version"
date:   2010-10-06
description: "Determine SharePoint MOSS 2007 Service Pack Version"
---
Determining the service pack that you have installed for a particular
SharePoint 2007 installation turned out to be a surprisingly opaque process.
I found this very clear and helpful blog post dealing with just this
determination:
[http://techpunch.wordpress.com/2008/10/15/sharepoint-2007-moss-how-to-determine-service-pack-version/](http://techpunch.wordpress.com/2008/10/15/sharepoint-2007-moss-how-to-determine-service-pack-version/)

To give a quick overview, the right way to determine the installed service pack is to look up the version of SharePoint that you have installed and match it against a table (available at the link above) of version numbers to service packs.

Determine your SharePoint version by logging into your Central Administration site and going to Operations > Servers In Farm > Database Schema Version. Your SharePoint version will be listed in the table of servers in the farm.

Note that the link above only has version numbers listed through SP1 (the post is from October 2008). Use this link to get a more up-to-date listing of version numbers:
[http://www.sharepointdesignerstepbystep.com/Blog/Articles/How%20To%20find%20the%20SharePoint%20version.aspx](http://www.sharepointdesignerstepbystep.com/Blog/Articles/How%20To%20find%20the%20SharePoint%20version.aspx)
