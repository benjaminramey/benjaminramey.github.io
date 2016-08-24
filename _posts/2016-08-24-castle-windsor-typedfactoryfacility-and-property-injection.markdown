---
layout: post
title:  "Castle.Windsor TypedFactoryFacility and Unexpected Property Injection Behavior"
date:   2016-08-24 12:37:00
description: "Interesting (and unexpected) behavior of Windsor's property injection when using TypedFactoryFacility."
---

I finally got to the bottom of an issue today that came down to the way Castle.Windsor
does property injection (injecting dependencies into public properties) when 
you are also using their TypedFactoryFacility.  It was a tough one to track down, so
I thought I'd put the solution out there for everyone else's benefit.

## The Problem
Here's what the problem looked like.

### The Error Message
First things first, this is what the symptom looked like:

{% highlight text %}
[ComponentNotFoundException: No component for supporting the service System.Threading.Tasks.Task was found]
   Castle.MicroKernel.DefaultKernel.Castle.MicroKernel.IKernelInternal.Resolve(Type service, IDictionary arguments, IReleasePolicy policy) +120
   Castle.Facilities.TypedFactory.Internal.TypedFactoryInterceptor.Resolve(IInvocation invocation) +147
   Castle.Facilities.TypedFactory.Internal.TypedFactoryInterceptor.Intercept(IInvocation invocation) +123
   Castle.DynamicProxy.AbstractInvocation.Proceed() +448
   Castle.Proxies.Func`2Proxy.Invoke(OAuthMatchEndpointContext arg) +168

   ...
{% endhighlight %}

This is actually a pretty standard error when you're using Castle.Windsor. It usually
means Windsor tried to resolve some dependency but discovered that it was missing a
registration.  Translation: you forgot to register a component or type in your Windsor
setup.  Usually it's an easy fix; just register your dependency properly.

In this case, however, as you can see, the missing registration was of type
System.Threading.Tasks.Task.  I didn't have any dependencies on the `Task` class and so
I didn't want to "fix" any Windsor setup to register it.  This wasn't making sense.

### Step One: TypedFactoryInterceptor?
The first oddity I noticed was that this error was happening somewhere in the flow
of the TypedFactoryInterceptor.  I could tell where the error was coming from in my
code (from the rest of the stack trace that I didn't include above).  The problem
was that it had nothing to do with any TypedFactoryFacility.

So, I inspected my registrations a little closer.  I basically had a setup like this.

{% highlight csharp %}
public class ChildClass : ParentClass
{
  public override Task DoSomething(Options options)
  {
    ...
  }
}

public class ParentClass : IInterface
{
  public Func<Options, Task> OnDoSomething { get; set; }
  public Func<Options, Task> OnDoSomethingElse { get; set; }

  public virtual Task DoSomething(Options options)
  {
    return OnDoSomething(options);
  }

  public virtual Task DoSomethingElse(Options options)
  {
    return OnDoSomethingElse.Invoke(options);
  }
}
{% endhighlight %}

Notice a couple of things.
 1. ParentClass has several virtual methods.  I'm only overriding one.
 2. ParentClass is setup to allow you to override the virtual methods or to just supply
 it with Funcs.
 3. The implementation of the virtual methods is to simply call the corresponding Funcs.

### Finding the Location of the Problem
After lots of testing and debugging, I finally figured out that somehow a FuncProxy
(see line 6 in the error stack trace above) was being injected into all of the 
public `Func<,>` properties on ParentClass.  Then, when methods were called that
I did not override in my ChildClass, the Func would be called in the ParentClass
and that's where Windsor was hooking in and eventually causing an error when it 
eventually tried to resolve a dependency on `Task`.

### One More Clue
As I mentioned above, the presence of a TypedFactoryInterceptor in the stack trace
was strange to me.  I wasn't using Windor's TypedFactoryFacility to register my ChildClass.
So, why was it sticking its nose into my class somehow?

I did some simple debugging and turned off the TypedFactoryFacility in my Windsor setup.
Just like magic,
the error I was seeing went away.  So, my conclusion: somehow TypedFactoryFacility was
inserting itself into my ChildClass registration and injecting `FuncProxy`s into the
ParentClass public `Func<,>` properties.

## The Solution
This looked an aweful lot like property injection to me.  I started searching related to
TypedFactoryFacility and property injection.  I pretty quickly came upon this documentation:
[https://github.com/castleproject/Windsor/blob/master/docs/how-properties-are-injected.md](https://github.com/castleproject/Windsor/blob/master/docs/how-properties-are-injected.md).

That page describes how Windsor does property injection, which I actually thought was
an opt-in feature of Windsor.  In fact, Windsor does it by default, as describe on that page.

Combining this revelation (to me) with the fact that TypedFactoryFacility also allows you
to take a dependency on a simple `Func` and turn it into a factory call into your Windsor
container, I concluded that, by turning on the TypedFactoryFacility in Windsor, I was opening
up public properties that had `Func<>` types to property injection by Windsor.

Now, I hate property injection, so I was fine with just turning it off completely.  Luckily,
the documentation link above also included instructions how to do it. I've included that code
here.

{% highlight csharp %}
var propInjector = Kernel.ComponentModelBuilder
                         .Contributors
                         .OfType<PropertiesDependenciesModelInspector>()
                         .Single();
Kernel.ComponentModelBuilder.RemoveContributor(propInjector);
{% endhighlight %}

I added this code into my Windsor container setup and tried again.  Everything worked just
as expected.  

## Lessons Learned
A couple of quick takeaways:
 1. Windsor does property injection by default.  Check out the documentation link above for
 the criteria it uses to determine when it should or not.
 2. Using TypedFactoryFacility is fantastic, but turn off property injection if you have
 public `Func<>` properties anywhere.