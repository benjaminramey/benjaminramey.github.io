---
layout: post
title:  "Adding a RabbitMQ Configuration File When Running as a Windows Service"
date:   2016-01-04 15:26:00
description: "Instructions to add a RabbitMQ configuration file after having installed the Windows Service already."
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
and finally came upon this line: "For environment changes to take effect on Windows, the service must be re-installed. It is
not sufficient to restart the service."

Oops.  Guess I should have read the documentation more closely the first time around!  It's even italicized.  The 
instructions are even there on the page. Here they are:

 1. cd into the sbin folder under RabbitMQ server installation directory (e.g. C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.6.0\sbin)
 1. Run rabbitmq-service.bat remove
 1. Set environment variables via command line, i.e. run commands like the following: set RABBITMQ_BASE=c:\Data\RabbitMQ
 1. Run rabbitmq-service.bat install
 
Note a couple of things.  First, this only installs the service and leaves it un-started.  To start it, just do this:

	> rabbitmq-service.bat start
	
Second, you'll need to start your command prompt as an administrator.