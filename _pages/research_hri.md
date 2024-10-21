---
title: "ASU RISE Lab - HRI Research"
layout: textlay
excerpt: "ASU RISE Lab -- Human-Robot Interaction Research"
sitemap: false
permalink: /research/hri
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


<h2 style="text-align:center"> Human-Robot Interaction</h2>
Robots are increasingly employed in close proximity to humans. For the humans and robots to collaborate safely and efficiently, a robot needs to understand human intents, predict human actions, consider human factors, in order to optimize its own actions to complete a task with human safely, efficiently, and friendly. Here we will explore a game-theoretic framework to model the bilateral inference and decision making process between the human and robot. We are interested in both proximal and physical tasks that involve joint decision-making and joint-action between the human and robot. One major challenge is to model the human actions in highly dynamic tasks given the strong variability and uncertainty of humans. We will apply the developed algorithms in various human-robot collaboration scenarios, including autonomous vehicles, collaborative manufacturing, wearable robots, and assistive devices. For more details about how we apply the developed algorithms to autonomous vehicles, please check this page.

<table style="width:100%;height:600px">
<tr>
<td style="width:80%">

<!-- Tab links -->
<div class="tab">
  <button class="tablinks" onclick="openCity(event, 'Publications')" id="defaultOpen">Publications</button>
  <button class="tablinks" onclick="openCity(event, 'Projects')">Projects</button>
  <button class="tablinks" onclick="openCity(event, 'Outreach')">Outreach</button>
</div>

<!-- Tab content -->
<div id="Publications" class="tabcontent"  markdown="1" style="height:500px;overflow:scroll">
  <h3>Publications</h3>
<table style="width:100%">
  <tr>
    <td width="50%"><a href="https://ieeexplore.ieee.org/abstract/document/10065388">Learning Post-Stroke Gait Training Strategies by Modeling Patient-Therapist Interaction</a></td>
    <td style="width:50%" style="text-align:center"><img src="/images/respic/hri/hri1.png" width="200px"></td>
  </tr>
  <tr>
    <td><a href="https://ieeexplore.ieee.org/abstract/document/9982108">Bounded Rational Game-theoretical Modeling of Human Joint Actions with Incomplete Information</a></td>
    <td style="text-align:center"><img src="/images/respic/hri/hri2.png" width="200px"></td>
  </tr>
  <tr>
    <td><a href="[https://ieeexplore.ieee.org/abstract/document/9982108](https://ieeexplore.ieee.org/abstract/document/9867155)">When Shall I Estimate Your Intent? Costs and Benefits of Intent Inference in Multi-Agent Interactions</a></td>
    <td style="text-align:center"><img src="/images/respic/hri/25.png" width="200px"></td>
  </tr>
</table>
<!--
  <p><a href="https://ieeexplore.ieee.org/abstract/document/10065388">Learning Post-Stroke Gait Training Strategies by Modeling Patient-Therapist Interaction</a></p> <img src="/images/respic/hri/hri1.png" width="200px">
  <p><a href="https://ieeexplore.ieee.org/abstract/document/9982108">Bounded Rational Game-theoretical Modeling of Human Joint Actions with Incomplete Information</a></p> <img src="/images/respic/hri/hri2.png" width="200px">
  <p><a href="[https://ieeexplore.ieee.org/abstract/document/9982108](https://ieeexplore.ieee.org/abstract/document/9867155)">When Shall I Estimate Your Intent? Costs and Benefits of Intent Inference in Multi-Agent Interactions</a></p> <img src="/images/respic/hri/25.png" width="200px">
  -->
	
</div>

<div id="Projects" class="tabcontent" markdown="1" style="height:500px;overflow:scroll">
  <h3>Projects</h3>
  <h4>Prospect-Theoretic Reinforcement Learning in Overcooked</h4>
<!--
  - Goal
    - Make AI better understand human preferences and decisions to make AI better able to assist
  - Project Description
    - Integrate risk-aware cognitive models (CPT) into interactive AI planning in an Overcooked environment
  - Looking for:
    - Set up Overcooked RL environment
    - Modify overcooked to induce risk
    - Train standard baseline policies
    - Train discrete prospect-theoretic models
    - Estimate latent human parameters online
  -->
<table style="width:100%">
  <tr>
    <td> 
<ul> 
	<li>
		Goal
	</li>
	<ul>
		<li>
			Make AI better understand human preferences and decisions to make AI better able to assist
		</li>
	</ul>
 <li>
		Project Description
	</li>
 <ul>
		<li>
			Integrate risk-aware cognitive models (CPT) into interactive AI planning in an Overcooked environment
		</li>
 </ul>
 <li>
		Looking for:
	</li>
<ul>
		<li>
			Set up Overcooked RL environment
		</li>
	<li>
			Modify overcooked to induce risk
		</li>
	<li>
			Train standard baseline policies
		</li>
	<li>
			Train discrete prospect-theoretic models
		</li>
	<li>
			Estimate latent human parameters online
		</li>
</ul>
</ul>
    </td>
    <td markdown = "span" style="width:50%">
	    <img src="/images/respic/hri/hri3.PNG" width="300px"> <br>
	    <img src="/images/respic/hri/hri4.png" width="300px">
    </td>
  </tr>
</table>

 
  <h4>Game Theoretical Modeling of Physical Human-Robot Interactions </h4>
<table style="width:100%">
  <tr>
    <td> 
<ul> 
	<li>
		Goal
	</li>
	<ul>
		<li>
			Developing a game theoretical-based controller for physical human-robot interaction scenarios such as controlling assistive wearable robots 
		</li>
	</ul>
 <li>
		Project Description
	</li>
 <ul>
		<li>
			We are aiming to integrate incomplete information
	games With optimal control and reinforcement learning
to infer the human intent during HRI tasks and also model
the possible learning process of the human while interacting
with the robot

		</li>
 </ul>
 <li>
		Looking for:
	</li>
<ul>
		<li>
			Developing a framework for solving incomplete information
Multi-agent interactions.

		</li>
	<li>
			Modify overcooked to induce risk
		</li>
	<li>
			Applying the developed  framework to actual HRI scenarios and 
model the human learning process.

		</li>
	<li>
			Applying the results on the control of assistive wearable robots
To have a more compliant and robust controller

		</li>
</ul>
</ul>
    </td>
    <td markdown = "span" style="width:50%">
	    <img src="/images/respic/hri/hri5.png" width="300px">
    </td>
  </tr>
</table>
</div>

<div id="Outreach" class="tabcontent" style="height:500px;">
  <h3>Outreach</h3>
  <img src="/images/respic/hri/hri_outreach.png" width="100%">
</div>

<script>
document.getElementById("defaultOpen").click();
</script>

</td>
<td style="width:20%;padding-left:1em" markdown="1">
#### Team Members
- <a href="{{ site.url }}{{ site.baseurl }}/team">Sunny Amatya</a>

- <a href="{{ site.url }}{{ site.baseurl }}/team">Jonathan Bush</a>

- <a href="{{ site.url }}{{ site.baseurl }}/team">Mason Smith</a>

- <a href="{{ site.url }}{{ site.baseurl }}/team">Yousef Soltanian</a>

</td>
</tr>
</table>
### Collaborators
<img src="/images/NSF_logo.svg" alt="National Science Foundation" height="200px">
<img src="/images/Air_Force_Research_Laboratory.png" height="200px">

<hr>
