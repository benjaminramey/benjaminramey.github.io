---
layout: post
title:  "Grouping into Rows with XSLT"
date:   2012-03-05
description: "Grouping into Rows with XSLT"
---
Let’s say you have a simple XML document that looks something like this:

{% highlight xml %}
<root>
	<Pod id="1"></Pod>
	<Pod id="2"></Pod>
	<Pod id="3"></Pod>
	<Pod id="4"></Pod>
</root>
{% endhighlight %}

The content or meaning of the pods is irrelevant. The idea is that you have a “list” of elements (pods in this case) in your XML. How, then, do you use XSLT to group these pods into rows of two, three or whatever number of pods across? Something like this:

{% highlight xml %}
<div>
	<div class="row">
		<div class="pod"> pod 1 </div>
		<div class="pod"> pod 2 </div>
		<div class="pod"> pod 3 </div>
	</div>
		<div class="row">
		<div class="pod"> pod 4 </div>
	</div>
</div>
{% endhighlight %}

This example would required three pods per row. The example XSLT below will work for any number of pods per row with a simple edit (explained below).

My first thought was from a very normal programmer’s perspective. I’d use some kind of looping (with xsl:for-each) and just start a new row for each x number of pods. So, I did it that way and it worked. It was pretty ugly XSLT, but I didn’t really think there was a better way to do it. But then a colleague looked over my shoulder and chuckled. “I did it that way at first too”, he said, “but that’s not the XSLT way to do it.” He gave me a little bit of a clue of how it really should be done then he left, leaving me determined to find the “XSLT way” of doing it!

Turns out, it really isn’t difficult. You just have to think a little differently and start using xsl:template, xsl:call-template and xsl:apply-templates effectively along with their select and match attributes. So, take a look at this XSLT file:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	exclude-result-prefixes="msxsl">
	<xsl:output method="html"
		version="1.0"
		omit-xml-declaration="yes"
		indent="yes"
		encoding="utf-8" />
	
	<xsl:template match="/root">
		<xsl:apply-templates select="Pod[position() mod 3 = 1]" />
	</xsl:template>
	
	<xsl:template name="PodRow"
		match="Pod[position() mod 3 = 1]">
		<div class="row">
			<xsl:choose>
				<xsl:call-template name="PodWrapper"/>
				<xsl:apply-templates
					select="following-sibling::Pod[position() &lt; 3]"/>
			</xsl:choose>
		</div>
	</xsl:template>
	
	<xsl:template name="PodWrapper"
		match="Pod[position() mod 3 &gt; 1]">
		<div class="pod">
			<xsl:call-template name="PodContent"/>
		</div>
	</xsl:template>
	
	<xsl:template name="PodContent">
		<!– whatever content your "pods" contain can be marked up here –>
	</xsl:template>
</xsl:stylesheet>
{% endhighlight %}

Here’s what’s going on: first, we call xsl:apply-templates on the first and then every third Pod using “Pod[position() mod 3 = 1]”. This will select the Pod at the start of every row: Pods 1 and 4. Notice that XSLT indexing starts at 1 and NOT 0. The PodRow template will match these selected Pods.

Inside the PodRow template we have the HTML for the row. Inside the row HTML, we explicitly call the PodWrapper template for the current Pod. We then call xsl:apply-templates on the following siblings of the current Pod, but only on the next two of them. This grabs the remaining Pods in the row. This xsl:apply-templates select will match the PodWrapper template which creates the HTML for a single Pod.

Easy as pie! To change the number of pods in a row, update all of the “position() mod 3″s by replacing 3 with however many pods you want in a row. Then also make sure to update the xsl:apply-templates select attribute inside PodRow to be “position() < n-1″ where n is the number of Pods in a row.

##Identifying the last cell of every row
I needed another feature from my XSLT though. I needed every last pod in each row to have a special CSS class. This meant determining which pod was the last one in each row whether the row was full or not. This made the XSLT significantly more complicated, but not overwhelmingly so.

I needed my HTML to look like this (notice the additional “last” class):

{% highlight xml %}
<div>
	<div class="row">
		<div class="pod"> pod 1 </div>
		<div class="pod"> pod 2 </div>
		<div class="pod last"> pod 3 </div>
	</div>
	<div class="row">
		<div class="pod last"> pod 4 </div>
	</div>
</div>
{% endhighlight %}

So, this is what I had to do:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	exclude-result-prefixes="msxsl">
	<xsl:output method="html"
		version="1.0"
		omit-xml-declaration="yes"
		indent="yes"
		encoding="utf-8" />
	
	<xsl:template match="/root">
		<xsl:apply-templates select="Pod[position() mod 3 = 1]" />
	</xsl:template>
	
	<xsl:template name="PodRow"
		match="Pod[position() mod 3 = 1]"
		priority="2">
		<div class="row">
			<xsl:choose>
				<xsl:when test="count(following-sibling::Pod) = 0">
					<xsl:call-template name="PodWrapperLast"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="PodWrapper"/>
					<xsl:apply-templates
						select="following-sibling::Pod[position() &lt; 3]"/>
				</xsl:otherwise>
			</xsl:choose>
		</div>	
	</xsl:template>
	
	<xsl:template name="PodWrapper"
		match="Pod[position() mod 3 &gt; 1]"
		priority="0">
		<div class="pod">
			<xsl:call-template name="PodContent"/>
		</div>
	</xsl:template>
	
	<xsl:template name="PodWrapperLast"
		priority="1"
		match="Pod[position() mod 3 = 0 or position() = last()]">
		<div class="pod last">
			<xsl:call-template name="PodContent"/>
		</div>
	</xsl:template>
	
	<xsl:template name="PodContent">
		<!– whatever content your "pods" contain can be marked up here –>
	</xsl:template>
</xsl:stylesheet>
{% endhighlight %}

This version of the XSLT functions exactly the same as the previous one. The only additions are for identifying the last pod in each row for all cases. So, here is what has changed.

The xsl:apply-templates call inside of PodRow now matches one of two templates: PodWrapper or PodWrapperLast. You guessed it, PodWrapperLast just has an extra “last” class on the Pod div and a fancy match attribute. “Pod[position() mod 3 = 0 or position() = last()]” will match Pod numbers 3, 6, etc (in other words, the last Pod of every row) or the last Pod in the XML (no matter what number it is).

Notice the new xsl:choose inside of our PodRow template. This handles the case where the last Pod in the XML is also the first Pod in a row.

Notice also the “priority” attributes on the templates now. This prevents the PodWrapperLast template from matching the first Pod in a row if that first Pod is also the last Pod in the XML.