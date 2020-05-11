---
layout: post
title:  "Permutations with Iterators in C#"
date:   2015-09-03 12:27:00
description: "Link to great code for generator permutations of objects with iterators"
categories: [programming]
tags: [.net]
---

I recently ran across a need to generate all permutations of an array of objects
in some unit testing I was doing.

The specific situation was testing that, no matter what the order, when certain messages
were picked up by an [NServiceBus][nsbus] [Saga][sagas], that a certain state was consistent after all
messages were received.  Since I explicitly wanted to test the state no matter what order
the messages arrived in, I needed all permutations of those messages so I could send
them to the Saga in each order and test the resulting state.

I found this super article on the subject that gave all the code I needed: [Generating Permutations with C# Iterators][article].

Thanks IanG on Tap!

[nsbus]:http://particular.net/
[article]:http://www.interact-sw.co.uk/iangblog/2004/09/16/permuterate
[sagas]:particular.net/articles/sagas-in-nservicebus
