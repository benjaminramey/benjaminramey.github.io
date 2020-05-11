---
layout: post
title:  "How to Create a Brightcove Player Logo Overlay"
date:   2012-02-03
description: "How to Create a Brightcove Player Logo Overlay"
---
As simple as it ended up being, it took me quite a while to figure out how to correctly add a simple overlaying graphic to a Brightcove video player yesterday.  It involves a couple of steps which I did not find clearly laid out anywhere I looked.  So, I thought a nice little step-by-step blog post would be helpful to anyone else looking for the same thing.

First, Brightcove has a nice and easy method (I say that because it looks easy…I didn’t try this method) of adding logo overlays to an individual video.  You just:

1. Log into your video cloud Brightcove Studio
1. Click on the Media icon in the top navigation bar
1. Find and select your video (by clicking on it)
1. Click on the Edit button at the bottom of the list of videos
1. Follow the process outlined on the Logo Overlay tab of the Edit popup

This isn’t what I wanted though.  I needed these videos to appear logo-free in certain instances.  So, the best solution was to use one player in the instance where I didn’t need a logo and then use a different player that included the logo overlay for my other scenario.  That required add an overlay to a player, not a video.

So, on to the solution!

##Step One: Create a new player template
This part is easy.  Actually, all the parts are easy.  You just need to know what to do.

1. Under the Publishing tab in your Brightcove Studio, click on All Templates in the left sidebar.
1. Select one of the templates that Brightcove gives you and duplicate it (use the Duplicate button at the bottom of the list of templates)
1. Select your new template and click on the Edit button
1. In the Layout field (the XML that describes the player), add an Image element inside the Layout element.  See the BEML reference documentationfor details.  Here is what my Image element looks like:

{% highlight xml %}
<Image id="logoOverlay"
width="50"
height="50"
scaleMode="exactFit"
visible="{!videoPlayer.menu.open}"/>
{% endhighlight %}

All of the attributes are optional except the id attribute.  It doesn’t have to be named “logoOverlay”, but you have to have something there.  Notice the value for my “visible” attribute.  This ensures that my logo disappears when the video is done and doesn’t awkwardly overlay any of the video menu UI elements.  Remove it if you want your logo to display the whole time.  Also note the “x” and “y” values.  Change these to your liking.  You might have to wait to finish Step Two below when you’ve added a logo and then you can test a video with your player to see where the logo fits best.  From there, you can keep adjusting your logo until you’re satisfied.
1. Now click on All Players in the left sidebar and then click on the New Player button at the bottom
1. Create a new player with whatever name is appropriate from the template you just created

That’s it for the template!  You’re done with Step One.

##Step Two: Add Your Logo
I figured out step one all on my own pretty quickly.  I figured out step two all on my own too, but it look a lot longer!

1. Under the Publishing tab (you’re probably already there), click on All Players in the left sidebar
1. Select the player you just created in Step One and click on the Styles button at the bottom of the page.
1. If you gave your Image element an id (you should have!), then you should see an item underneath Editable Areas in the right sidebar with the same name as your Image id.  Click on it.
1. Just below (also in the right sidebar), you should now see an Image Selection tab in the Edit pane
1. Click on Upload and upload your logo (or whatever image).
1. Add a URL that the image links to and a tooltip to show when you hover over the image, if you want
1. Click on Save & Close

You’re done!  Now, any video you display with that player will have a logo overlay.