---
layout: page
title: Categories
---

Browse posts by category.

<ul>
    {% for category in site.categories %}
        <li><a href="{{ '/categories/' | append: category[0] | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% endfor %}
</ul>
