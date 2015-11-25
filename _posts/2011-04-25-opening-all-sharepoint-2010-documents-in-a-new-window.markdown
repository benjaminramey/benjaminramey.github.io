---
layout: post
title:  "Opening all SharePoint 2010 Documents in a new window"
date:   2011-04-25
description: "Opening all SharePoint 2010 Documents in a new window"
---
We wanted an easy solution to open every document in a SharePoint from a document library in a new window.  This way, the user stays on the page he is originally on and the document (PDF, Word doc, Excel files–whatever) will open in a blank window.

I don’t know of any way to do this via a setting in SharePoint, but a little JavaScript employing jQuery does the job just perfectly.

{% highlight javascript %}
$(document).ready(
	function () {
		// has to be on an interval for grouped doc libraries
		// where the actual links are loaded only once a group
		// is expanded
		setInterval(
			function () {
				$("a[onclick*=’return DispEx’][target!=’_blank’]")
					.attr("target", "_blank")
					.removeAttr("onclick");
					
				// document type icons
				$("td.ms-vb-icon>img[onclick]:not([documentUrl])")
					.click(function (e) {
						window.open($(this).attr("documentUrl"), "_blank");
						e.stopPropagation();
						e.preventDefault();
						return false;
					})
					.each(function () {
						$(this).attr(
							"documentUrl",
							$.trim(String($(this).attr("onclick"))
								.split("=")[1]
								.replace(/["'{}]/g, "")
								.split(";")[0])
							);
						this.onclick = null;
					});
				},
				500
		);
	}
);
{% endhighlight %}

This JavaScript takes into account that some Document Libraries are grouped and so not all the document links (or icon links) will appear on the page load. This is the reason for the half-second interval.  At the most half a second after the group is expanded the newly loaded links will be altered to also open in a new window.

You’ll notice that there are two things happening on each interval.  The first line does any Title links for the document.  The second line (and following) handles the document type icons that are also links to the document.  Note that if you want only one or the other link to open in a new window (for example, on the document type icon opens in a new window and the Title link opens in the same window) then all you need to do is remove the appropriate line.