---
layout: post
title:  "Setting Selected Items on Sitefinity 5.1 PagesSelector in Javascript"
date:   2012-10-25
description: "Setting Selected Items on Sitefinity 5.1 PagesSelector in Javascript"
categories: [programming]
tags: [sitefinity]
---
##Problem
Today I nearly tore my hair out trying to get set the selected items (having a list of GUIDs) on the PagesSelector control in Sitefinity through the Javascript API to the control.

You are supposed to be able to use the set_selectedItemIds method to do this, but it doesn’t work. Nothing happens after you call this method.

After doing some debugging through Sitefinity’s javascript, I found a bug which, when fixed, causes the set_selectedItemIds method to work as expected.

##Solution
I am using a WidgetDesigner in which I have the PagesSelector control. My goal is pretty simple: I want the content editors to be able to select a set of pages for which to show links in the footer of their website. When they edit the footer widget, the PagesSelector should show up, let them choose pages (showing the currently selected ones) and let them save those selections.

Everything works fine. Except, once I save a selection in the PagesSelector, on subsequent edits, the currently selected items would not show up, as described above.

Here is the bug I found in the Sitefinity code. The set_selectedItemIds function is really simple. It looks like this:
{% highlight javascript %}
set_selectedItemIds: function(ids) {
  this._selectedItemIds = ids;
  this._updateGridSelection();
  this._updateTreeSelection();
}
{% endhighlight %}

It updates a property (_selectedItemIds) and then updates the grid (not sure what that is) and then the tree (of page nodes). The _updateTreeSelection method is what we’re looking for–this is where the bug is. The method looks like this:

{% highlight javascript %}
_updateTreeSelection: function () {
  if (this._treeIsBound == false) {
    this._treeMustBeUpdated = true;
    return;
  }
  this._treeMustBeUpdated = false;
  var tree = this.get_itemsTree();
  var binder = tree.getBinder();
  if (this._selectedItemId) {
    binder.setSelectedValues([this._selectedItemId], true, true);
  } else {
    var selectedItems = tree.get_selectedItems();
    if (selectedItems) {
      binder.clearSelection();
      binder.setSelectedItems(selectedItems, true, true);
    } else {
      if (this._selectedItemIds) {
        binder.setSelectedValues(this._selectedItemIds, true, true);
      }
    }
  }
  this._raiseSelectionApplied(this, {});
}
{% endhighlight %}

The problem is on line 13. tree.get_selectedItems() returns an empty array when there are no items selected. So, the expression if (selectedItems) { } will always be true–but we want to get to the else statement, as you can see, to set the selection from the this._selectedItemIds array.

The beauty (and danger!) of javascript is that you can easily fix something like this in your own code by simply redefining their method. Here is my code that fixes this bug:

{% highlight javascript %}
var wrapper = this.get_pagesSelector();
var selector = this.get_pagesSelector().get_pageSelector();
var selecting = false;
wrapper.add_selectionApplied(function () {
  if (selecting) {
    return;
  }
  selecting = true;
  var pageIds = controlData.FooterPages;
  if (pageIds) {
    var pages = pageIds.split(",");
    var oldMethod = selector._updateTreeSelection;
    selector._updateTreeSelection = function () {
      if (this._treeIsBound == false) {
        this._treeMustBeUpdated = true;
        return;
      }
      this._treeMustBeUpdated = false;
      var tree = this.get_itemsTree();
      var binder = tree.getBinder();
      if (this._selectedItemId) {
        binder.setSelectedValues([this._selectedItemId], true, true);
      } else {
        var selectedItems = tree.get_selectedItems();
        if (selectedItems && selectedItems.length > 0) {
          binder.clearSelection();
          binder.setSelectedItems(selectedItems, true, true);
        } else {
          if (this._selectedItemIds) {
            binder.setSelectedValues(this._selectedItemIds, true, true);
          }
        }
      }
      this._raiseSelectionApplied(this, {});
    };
    selector.set_selectedItemIds(pages);
    selector._updateTreeSelection = oldMethod;
  }
});
{% endhighlight %}

First, I attach to the selectionApplied method. If you try to do the above code before that is done, your selection will just be overridden (or just not work–not sure which). This event will get called when you call set_selectedItemIds. To avoid an infinite loop, then, I use the selecting flag at the top of the event function I am attaching.

Second, I parse out my ids into an array.

Third, I save the old version of the _updateTreeSelection method and then override it with my own. Notice, the fix on line 13 of that method. I have added ” && selectedItems.length > 0″.

Fourth, now that I have a fixed method, I call selector.set_selectedItemIds, passing in my array of ids and it works!

Lastly, I change the method back to the original (just in case the seemingly faulty if expression is what they intended in other situations).

Hope that helps!
