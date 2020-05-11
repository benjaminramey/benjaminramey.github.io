---
layout: post
title:  "EPiServer 7: Cannot decrypt password"
date:   2014-04-17
description: "EPiServer 7: Cannot decrypt password"
categories: [programming]
tags: [episerver]
---

##Problem
I’ve been dealing with an issue in EPiServer 7 recently.  I got this error when trying to log into the admin back-end of the site.

{% highlight text %}
Cannot decrypt password

Description: An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.

Exception Details: System.InvalidOperationException: Cannot decrypt password

Source Error:

An unhandled exception was generated during the execution of the current web request. Information regarding the origin and location of the exception can be identified using the exception stack trace below.

Stack Trace:

[InvalidOperationException: Cannot decrypt password]
EPiServer.Common.Security.HMACPasswordProvider.DecryptPassword(Byte[] ciphertext) +60
EPiServer.Common.Web.Authorization.Integrator.SynchronizeUser(MembershipUser membershipUser, String password, Boolean enableCreateNew) +1116
System.Web.SyncEventExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() +80
System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously) +165
{% endhighlight %}

##Scenario
We originally installed the Relate+ site for our EPiServer installation. Through various bad decisions, we didn’t keep the custom code and templates we wrote separate from the Relate+ stuff. So, we inevitably created a mess where we did not need a ton of the Relate+ templates, page types, block types, etc but we could not longer easily pull our custom stuff out from the tangled mess.

Well, we undertook the disentangling anyway (a good decision) and ended up with a much cleaner code base. This meant re-installing EPiServer for a clean (without Relate+) beginning. The database would remain the same to keep our content.

We ran into this error when we got the new, cleaned-up site installed and running and then tried to log into the administration portion of the site.

##Solution
At first, I found this post online: http://world.episerver.com/Modules/Forum/Pages/Thread.aspx?id=77776 which suggested changing over to the multiplexing membership and role providers and described the new hashing mechanism in EPiServer 7.

At first, this seemed to work. Yay! But, the joy didn’t last long. I soon got the error again even after using the multiplexing providers. I dug a little deeper into the issue.

What I found was (in retrospect) pretty obvious. When we did the new, clean installation of EPiServer, it also created a new web.config with new attributes on the machineKey element. These properties are used with forms authentication to encrypt and decrypt information. Well, we didn’t make sure to keep the same values between the old install and the new install. So, when it tried to decrypt login information created with the old descryptionKey using the new decryptionKey, it obviously didn’t work.

Luckily, our trusty Systems Admins always keep backups of stuff they replace. We just went into the old web.config file from the previous site, copied the entire <machineKey> element and overwrite it in the new web.config. After an app pool recycle, the login was working great.
