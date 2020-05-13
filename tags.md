---
layout: page
title: Tags
---

Browse posts by tag.

<ul>
    {% for tag in site.tags %}
        <li><a href="{{ '/tags/' | append: tag[0] | relative_url }}">{{ tag[0] }} ({{ tag[1].count }})</a></li>
    {% endfor %}
</ul>
