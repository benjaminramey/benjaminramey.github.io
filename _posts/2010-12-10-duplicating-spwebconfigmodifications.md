---
layout: post
title:  "Duplicating SPWebConfigModifications"
date:   2010-12-10
description: "Duplicating SPWebConfigModifications"
categories: [programming]
tags: [sharepoint]
---
##Problem
Despite everything looking OK (no duplicate SPWebConfigModifications for your web application), your SPWebConfigModifications are adding duplicate elements to your web.config file.

##Solution (at least one possible one)
I ran into this problem today and discovered that in the Name property of the SPWebConfigModification I was not wrapping an attribute value in single quotes.  Since the actual Value property of the SPWebConfigModification had quotes around the attribute value, whenever the SPWebConfigModification was applied, it could not find the existing element and therefore would add a second, duplicate element.

In other words, this is wrong for the SPWebConfigModification Name: “add[@name=valueOfAttribute]“.

This is correct: “add[@name=’valueOfAttribute’]“
