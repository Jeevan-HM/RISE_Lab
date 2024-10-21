---
title: "ASU RISE Lab - Research"
layout: textlay
excerpt: "ASU RISE Lab -- Research"
sitemap: false
permalink: /research/uav
---

<script>
function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


</script>


## Template Robotics
Unmanned aerial vehicles (UAVs) are popular in various applications, such as aerial photography, surveillance, search and rescue, and precision agriculture. However, autonomous operations of small UAVs in dynamic environments pose challenges on the design of vehicle hardware and the embedded autonomy algorithms. Our research in this area includes (1) exploring the design of morphing UAVs, (2) developing dynamic models and precision control algorithms for the new hardware, and (3) demonstrating aerial-physical interaction for navigation and manipulation.
<table style="width:100%">
<tr>
<td style="width:70%">

<!-- Tab links -->
<div class="tab">
  <button class="tablinks" onclick="openCity(event, 'Publications')" id="defaultOpen">Publications</button>
  <button class="tablinks" onclick="openCity(event, 'Projects')">Projects</button>
  <button class="tablinks" onclick="openCity(event, 'Outreach')">Outreach</button>
</div>

<!-- Tab content -->
<div id="Publications" class="tabcontent">
  <h3>Publications</h3>
  <p>London is the capital city of England.</p>
</div>

<div id="Projects" class="tabcontent" markdown="1">
  <h3>Projects</h3>
  <h4>Soft Robotic Arm</h4>
  - Goal
    - Modeling and control of a soft robotic arm
  - Project Description
    - Work on pneumatically operated soft robotic arm to test, train and implement models and develop control algorithms to achieve tasks including but not limited to trajectory tracking.
  - Looking for:
    - Modify/upgrade the design of soft robotic arm and evaluation protocol for different experiments.
	- Identify and implement different types of input/output data collection trials to train/test models.
</div>

<div id="Outreach" class="tabcontent">
  <h3>Outreach</h3>
  <p>Tokyo is the capital of Japan.</p>
</div>

<script>
document.getElementById("defaultOpen").click();
</script>

</td>
<td style="width:30%;padding-left:1em" markdown="1">
#### Team Members
- Weija Tao

- Jahnav Rokalaboina

- Raj Kodithyala

- Chach Chaimongkol

</td>
</tr>
</table>
### Collaborators
 - ABRC
 - BNI
 - UIUC
 - Virginia Tech
 - SRP
<hr>
