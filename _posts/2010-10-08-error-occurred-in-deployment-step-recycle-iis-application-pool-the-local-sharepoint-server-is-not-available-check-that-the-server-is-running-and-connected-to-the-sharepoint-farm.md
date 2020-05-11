---
layout: post
title:  "Error occurred in deployment step ‘Recycle IIS Application Pool’: The local SharePoint server is not available. Check that the server is running and connected to the SharePoint farm."
date:   2010-10-08
description: "Error occurred in deployment step ‘Recycle IIS Application Pool’: The local SharePoint server is not available. Check that the server is running and connected to the SharePoint farm."
categories: [programming]
tags: [sharepoint]
---
I got the above error today while trying to deploy a SharePoint 2010 project in Visual Studio 2010.  Very frustrating!!

The answer turned out to be simple enough, though no clues are really provided in the error message (typical).  I had to add my user account to the db_owner role for the SharePoint_Admin database that the site I was deploying to was using.

Once I did that, the deployment in Visual Studio did just great.

The following post led me to the solution: [http://social.technet.microsoft.com/Forums/en-US/sharepoint2010programming/thread/a97a8413-a0ae-47f2-aab7-fae1cf40595a](http://social.technet.microsoft.com/Forums/en-US/sharepoint2010programming/thread/a97a8413-a0ae-47f2-aab7-fae1cf40595a)
