---
layout: post
title:  "SharePoint Unknown Error After Database Attach"
date:   2013-06-06
description: "SharePoint Unknown Error After Database Attach"
---
There are many reasons you might get one of those blank screens with just the text “An unknown error has occurred” when working with SharePoint.  Just search for it online and you’ll find many fixes.

I found another one last night.  One of our system admins setup a SharePoint web application for me for development purposes.  We attached a database from a backup of our client’s production content.  But, I couldn’t get to the site.  It gave me the unknown error screen.

I noticed in the ULS logs that the page request was immediately being redirected to the Access Denied page, but that wasn’t rendering either.

As it turns out, the system admin that setup the site was let go a couple of weeks ago and as a result his Windows domain account was deactivated.  However, he was the lone Site Collection Administrator on the site.  Once I removed him and added myself, the site came up as expected.
