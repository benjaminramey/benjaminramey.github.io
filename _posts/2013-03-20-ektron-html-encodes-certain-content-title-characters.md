---
layout: post
title:  "Ektron Html Encodes Certain Content Title Characters"
date:   2013-03-20
description: "Ektron Html Encodes Certain Content Title Characters"
categories: [programming]
tags: [ektron]
---
I found out today, while trying to search for certain content items in Ektron, that Ektron HTML encodes certain characters in content titles–but does not, apparently, HTML encode the entire title.

Here is a list of characters I’ve found so far that Ektron encodes in the title:

 - / (forward slash)
 - ‘ (apostrophe – single quote)
 - & (ampersand)

Here is what I know they do NOT encode in titles:

® (registered trademark symbol)

So, if you need to perform a search for Ektron content with a title like “Miner’s Hat”, then you need to encode it as “Miner&#39;s Hat” to find it.
