---
title: "ASU RISE Lab - Team"
layout: gridlay
excerpt: "ASU RISE Lab - Team"
sitemap: false
permalink: /team/
---

# Group Members

 **If you are interested in joining our lab as an undergraduate or masters student, please fill out [this form](https://forms.gle/eeDiRDo6nhceJv2K9).** **!**


Jump to [faculty](#faculty), [graduate students](#graduate-students), [undergradaute students](#undergraduate-students), [alumni](#alumni).

## Faculty
{% assign number_printed = 0 %}
{% for member in site.data.team_members %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-12 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="24%" style="float: left" />
  <h4>{{ member.name }}</h4>
  <i>{{ member.info }}<br>Email: <{{ member.email }}></i>
  <ul style="overflow: hidden">

  {% if member.number_educ == 1 %}
  <li> {{ member.education1 }} </li>
  {% endif %}

  {% if member.number_educ == 2 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  {% endif %}

  {% if member.number_educ == 3 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  {% endif %}

  {% if member.number_educ == 4 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  <li> {{ member.education4 }} </li>
  {% endif %}

  {% if member.number_educ == 5 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  <li> {{ member.education4 }} </li>
  <li> {{ member.education5 }} </li>
  {% endif %}

  </ul>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}

## Doctoral Students
{% assign number_printed = 0 %}
{% for member in site.data.docstudents %}

{% assign even_odd = number_printed | modulo: 3 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-4 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="100" style="float: left" />
  <h4>{{ member.name }}</h4>
  <i>{{ member.info }}<br> <a href="{{ member.link.url }}">{{ member.link.display }}</a>
  <br> <a href="{{ member.link2.url }}">{{ member.link2.display }}</a></i>
  <ul style="overflow: hidden">

  {% if member.number_educ == 1 %}
  <li> {{ member.education1 }} </li>
  {% endif %}

  {% if member.number_educ == 2 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  {% endif %}

  {% if member.number_educ == 3 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  {% endif %}

  {% if member.number_educ == 4 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  <li> {{ member.education4 }} </li>
  {% endif %}

  </ul>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 2 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 3 %}
{% if even_odd == 1 %}
</div>
{% endif %}

{% if even_odd == 2 %}
</div>
{% endif %}

## Master Students
{% assign number_printed = 0 %}
{% for member in site.data.msstudents %}

{% assign even_odd = number_printed | modulo: 3 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-4 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="100" style="float: left" />
  <h4>{{ member.name }}</h4>
  <i>{{ member.info }}<br> <a href="{{ member.link.url }}">{{ member.link.display }}</a>
  <br> <a href="{{ member.link2.url }}">{{ member.link2.display }}</a></i>
  <ul style="overflow: hidden">

  {% if member.number_educ == 1 %}
  <li> {{ member.education1 }} </li>
  {% endif %}

  {% if member.number_educ == 2 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  {% endif %}

  {% if member.number_educ == 3 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  {% endif %}

  {% if member.number_educ == 4 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  <li> {{ member.education4 }} </li>
  {% endif %}

  </ul>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 2 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 3 %}
{% if even_odd == 1 %}
</div>
{% endif %}

{% if even_odd == 2 %}
</div>
{% endif %}

## Undergraduate Students
{% assign number_printed = 0 %}
{% for member in site.data.students %}

{% assign even_odd = number_printed | modulo: 3 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-4 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="100" style="float: left" />
  <h4>{{ member.name }}</h4>
  <i>{{ member.info }}<br> <a href="{{ member.link.url }}">{{ member.link.display }}</a></i>
  <ul style="overflow: hidden">

  {% if member.number_educ == 1 %}
  <li> {{ member.education1 }} </li>
  {% endif %}

  {% if member.number_educ == 2 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  {% endif %}

  {% if member.number_educ == 3 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  {% endif %}

  {% if member.number_educ == 4 %}
  <li> {{ member.education1 }} </li>
  <li> {{ member.education2 }} </li>
  <li> {{ member.education3 }} </li>
  <li> {{ member.education4 }} </li>
  {% endif %}

  </ul>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 2 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 3 %}
{% if even_odd == 1 %}
</div>
{% endif %}

{% if even_odd == 2 %}
</div>
{% endif %}

## Openings
### PhD Student in Soft Robotics
The Robotics and Intelligent Systems Laboratory at the Ira A. Fulton Schools of Engineering, Arizona State University (ASU), invites applications for a fully-funded PhD position starting in Spring 2026 or Fall 2026. The applicant should have a BS or MS degree in mechanical engineering, computer science, or a related field. The project is at the intersection of control systems, robot learning, and soft robotics. Self-motivated students with a strong background in one or more of the following disciplines are encouraged to apply:
- Dynamic modeling and control of soft robots
- Design optimization, fabrication, and integration of soft robotic actuators
- Reinforcement learning, motion planning, and human-in-the-loop optimization

The successful candidates will have opportunities to conduct both analytical and hands-on research, publish papers in professional journals, make presentations at major academic conferences, and serve as mentors for undergraduate research projects. Evidence of abilities to work in collaborative teams and good communication skills (oral and written) is essential.

[More Info](../downloads/opening_phd_2025.pdf)

### Postdoctoral Researcher
The Robotics and Intelligent Systems Laboratory at the Ira A. Fulton Schools of Engineering, Arizona State University (ASU), invites applications for an open postdoctoral researcher position, with the earliest start date being January 2026. Initial appointment will be for one year, which may be renewed pending satisfactory performance and availability of funding. The applicant should have a PhD degree in mechanical engineering, computer science, or a related field.

The successful candidate will have opportunities to work on design, planning, and control of soft robots in various applications, such as walking assistance, in-pipe inspection, and aerial monitoring and manipulation. We are looking for candidates with a strong background in one or more areas: 1) robot modeling and planning in contact-rich settings, 2) dynamic modeling and high-fidelity simulation of soft robots, and 3) physics-informed machine learning in robot modeling and control.

[More Info](../downloads/opening_postdoc_2025.pdf)

## Alumni

<div class="row">

<div class="col-sm-12 clearfix">
<h4>Doctoral Students</h4>
{% for member in site.data.alumni_phd %}
{{ member.name }} {{ member.job }}
{% comment %}
<i>Dissertation: {{ member.thesis }}</i><br>
{% endcomment %}
{% endfor %}
</div>

<div class="col-sm-6 clearfix">
<h4>Master Students (thesis option)</h4>
{% for member in site.data.alumni_msc %}
{{ member.name }}
{% endfor %}
</div>

<div class="col-sm-6 clearfix">
<h4>Bachelor Students (honor's thesis)</h4>
{% for member in site.data.alumni_bsc %}
{{ member.name }}
{% endfor %}
</div>

</div>
