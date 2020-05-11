---
layout: post
title:  "Limit Selected Items on Sitecore Multilist Field"
date:   2012-06-12
description: "Limit Selected Items on Sitecore Multilist Field"
categories: [programming]
tags: [sitecore]
---
##Problem
You want to limit the number of items a user can choose for a multilist field in a data template in sitecore.

##Solution
The solution is easy enough.  Just add some validation to the field that will “count” the number of GUIDs in the raw value of the MultiList field.

1. Open up the template in the tree navigation and click on the MultiList field you want to limit
![sitecore_template_property_nav](/public/images/2012-06-12-limit-selected-items-on-sitecore-multilist-field/sitecore_template_property_nav.png)

2. Scroll down to the Validation field and enter this: ^(\{[^}]+\}\|?){0,5}$.  This regular expression simply makes sure you have between 0 and 5 GUIDs in the value of the MultiList, effectively limiting the number of items you select in the list.  The {0,5} is the range.  So, change the 0 to limit the lower bound and change the 5 to limit the upper bound.
![sitecore_template_validation_field](/public/images/2012-06-12-limit-selected-items-on-sitecore-multilist-field/sitecore_template_validation_field.png)

3. Enter an appropriate message that explains why the validation failed in the ValidationText field.
![sitecore_template_validationtext_field](/public/images/2012-06-12-limit-selected-items-on-sitecore-multilist-field/sitecore_template_validationtext_field.png)
