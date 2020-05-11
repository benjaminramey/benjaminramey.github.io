---
layout: post
title:  "Adding a RabbitMQ Configuration File When Running as a Windows Service"
date:   2016-01-04 15:26:00
description: "Instructions to add a RabbitMQ configuration file after having installed the Windows Service already."
categories: [programming]
tags: [rabbitmq]
---
## A little context
I was having a hard time adding a rabbitmq.config file today.  I added it in the right location, restarted
the RabbitMQ Windows service and the logs still showed that the configuration file was not found.

If you're experiencing the same problem, you'll see a similar error message in the RabbitMQ log file after
you restart the Windows service.

{% highlight text %}
=INFO REPORT==== <date here>
node			: rabbit@<server>
home dir		: C:\Windows
config file(s)	: c:/path/to/config/rabbitmq.config (not found)
...some other stuff...
{% endhighlight %}

This will happen if you just install your RabbitMQ server with the normal, default installation process
and then try to add a configuration file later.  By default, RabbitMQ doesn't install configuration file and just
uses all it's defined defaults.

## Solution
I read the [documentation](http://www.rabbitmq.com/configure.html) a little more closely
and finally came upon this line: "Windows service users will need to re-install the service after adding
or removing a configuration file."

Oops.  Guess I should have read the documentation more closely the first time around!  The easiest way to
do this is as follows (start a command prompt as administrator):

	> cd "C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.6.0\sbin"
	> .\rabbitmq-service.bat remove
	> .\rabbitmq-service.bat install
	> .\rabbitmq-service.bat start

Of course, The path you cd into will depend on the version of RabbitMQ you have installed.
