---
layout: post
title:  "NServiceBus with EntityFramework Persisters"
date:   2014-03-07
description: "NServiceBus with EntityFramework Persisters"
---

    Update 1/13/2016
    This code (much refactored and improved) is now available as a (NuGet package)[http://www.nuget.org/packages/GoodlyFere.NServiceBus.EntityFramework].
    Please see documentation and the code over at the (GitHub repository)[https://github.com/benjaminramey/GoodlyFere.NServiceBus.EntityFramework].

NServiceBus is easily configurable to use NHibernate, RavenDB or in-memory persistence. RavenDB is built in and is the default. You can configure it to use in-memory persistence. You can install a NuGet package to use NHibernate which opens the door to many data stores.

So, for a recent project in which we were using NServiceBus, I decided to use NHibernate as the ORM for our simple domain model. I might just be dumb, but I ran into all sorts of problems with NHibernate and MS DTC when I used a remove SQL server. Try as I might, I just couldn't get NHibernate to work to persist my domain model even though it persisted the NServiceBus stuff just fine.

I decided to switch over to EntityFramework for my domain model. NHibernate and EntityFramework coexisted just fine, but I wanted to use the same ORM for both NServiceBus and my domain model just to make things nice and clean. The problem is, there isn't a prepackaged solution (none that I found at least) out there to use EntityFramework with NServiceBus. I had to implement my own persistence classes for NServiceBus. As it turns out, that wasn't too hard. Below is a description of what you will need to do to get EntityFramework working as NServiceBus' persistence layer. Much of it was modeled directly off of the NHibernate persistence classes found here: https://github.com/Particular/NServiceBus.NHibernate.

Below are all the classes and interfaces I used to implement these persisters. Note that I have EF abstracted away through an IDataContext interface which the persisters use.

 - IPersistSagas
 - ISubscriptionStorage
 - IPersistTimeouts

Actually, this solution isn't tied specifically to EntityFramework.  I have EF abstracted away through an IDataContext interface which the persisters use.

##IDataContext
<script src="https://gist.github.com/benjaminramey/9421173.js" type="text/javascript">
</script>

##BaseDataContext
<script src="https://gist.github.com/benjaminramey/9421291.js">
</script>

##EFDataContext
<script src="https://gist.github.com/benjaminramey/9421303.js">
</script>

##IRepository
<script src="https://gist.github.com/benjaminramey/9421272.js">
</script>

##EFRepository
Not every method is implemented because I didn't need them all on this project. Using TDD, I only implemented methods as I needed them.
<script src="https://gist.github.com/benjaminramey/9421323.js">
</script>

##EFDbContext
This is the project-specific EntityFramework DbContext.
<script src="https://gist.github.com/benjaminramey/9421353.js">
</script>

##EFSagaPersister
<script src="https://gist.github.com/benjaminramey/9421364.js">
</script>

##EFSubscriptionPersister
<script src="https://gist.github.com/benjaminramey/9421372.js">
</script>

##EFTimeoutPersister
<script src="https://gist.github.com/benjaminramey/9421383.js">
</script>

##TimeoutDataEntity
<script src="https://gist.github.com/benjaminramey/9421403.js">
</script>

##Subscription
<script src="https://gist.github.com/benjaminramey/9421461.js">
</script>

##SagaData
<script src="https://gist.github.com/benjaminramey/9421470.js">
</script>

##Criteria classes
<script src="https://gist.github.com/benjaminramey/9421428.js">
</script>
