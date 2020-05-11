---
layout: post
title:  "You Can't Subscribe to IEvent with NServiceBus"
date:   2016-02-25 15:56:00
description: "The problems with trying to subscribe to IEvent with NServiceBus"
---

The reason you might want to subscribe to `IEvent` is pretty straightforward. I
wanted to do it for the simple reason of wanting to be able to choose (based
on configuration) whether I wanted to notify anyone of any event that
could be published on my bus.

In other words, whenever an event of any type was published, I wanted one particular
endpoint to subscribe to that event and then decide whether it should do
anything with it.

I thought the code to do that should be pretty simple.  Since all published
events *should* implement the `IEvent` interface and NServiceBus supports
polymorphism in its message handling, creating a message handler that
implemented `IHandleMessages<IEvent>` should be all I should have needed!

I was testing this with only partial success and so I thought it was working.

```
public class EventHandler : IHandleMessages<IEvent>
{
   public void Handle(IEvent message)
   {
     ...
   }
}
```

## My Partial Success
The reason I had partial success was because I was also *explicitly* handling
other events in the same endpoint on a special saga I had setup.  So, when
the endpoint started up, it would subscribe to these events.  At first, I only
wanted to send notifications for these events anyway, so it all seemed to be
working.  My special `IEvent` would work because the `Saga` subscribed this same
endpoint to those few events explicitly.

## My Full Failure
I realized I had only partially succeeded when I started wanting to send notifications
for other events that were not in that `Saga`.  I dug into the issue for a few
hours and finally began to wonder if NServiceBus (or maybe the RabbitMQ transport)
was explicitly ignoring `IEvent` when it setup subscriptions.

Sure enough, it does.  

To build a list of types to subscribe to, NServiceBus uses the `Conventions`
class in the `NServiceBus.Core` namespace.  One of the checks that code does
is to filter the list of potential types with the `IsEventType` method.  This
method checks if the `Type` is in a Particular (NServiceBus) DLL.  See the
code here: [IsEventType](https://github.com/Particular/NServiceBus/blob/e4bc405509e3b9c3fc91e21a56333bb40ac54a60/src/NServiceBus.Core/Conventions.cs#L154)

## My Solution
The solution is simple enough.  Instead of listening to `IEvent`, listen
to a custom interface that you implement on all of your events.  This is probably
more close to what you are trying to do anyway--listen to all events that your
system produces.

So, I simply created a marker interface called `ICustomEvent`.

```
public interface ICustomEvent : IEvent { }
```

Then, on all of my bus event classes, instead of implementing `IEvent` directly,
I implemented `ICustomEvent`.

My handler then looked like this.

```
public class EventHandler : IHandleMessages<ICustomEvent>
{
   public void Handle(ICustomEvent message)
   {
     ...
   }
}
```

Now, the right subscriptions are all set up and my single handler gets
every single event published by my entire bus.
