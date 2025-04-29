---
title: "ASU RISE Lab - Research"
layout: textlay
excerpt: "ASU RISE Lab -- Research"
sitemap: false
permalink: /research/
---

# Research

The overarching goal of our research is to integrate soft and compliant robot structures with novel learning and control algorithms to enable robots to safely and efficiently collaborate with humans and autonomously operate in challenging environments. Ongoing projects in the lab include [aerial robotics](#aerial-robotics), [soft robotics](#soft-robotics), and [human-robot interaction](#human-robot-interaction). Please check the summary of each 
project below and feel free to contact us if you have any questions or want to know more details!


We greatly acknowledge the National Science Foundation (NSF), Air Force Office of Scientific Research (AFOSR), Office of Naval Research (ONR), National Aeronautics and Space Administration (NASA), Science Foundation Arizona, Arizona Department of Health Services, Salt River Project, Northrop Grumman Cooperation, Honeywell Aerospace Technologies, and several internal funding sources, for supporting our past and current research.
<br>

<center>
<table style="text-align:center">
<tr>
<td markdown="span">
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/NSF_logo.svg){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/AFOSR.png){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/ONR.png){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/NASA_seal.svg){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/sfaz.png){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
</td>
</tr>
<tr>
<td markdown="span">
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/ADHS-ABRC-full-v_3cc.png){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/500_bluesrplogo.jpg){: style="max-height:100px; max-width:150px;  float: left; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/ngc.svg){: style="max-height:100px; max-width:150px;  float: none; border: 10px"}
![NSF]({{ site.url }}{{ site.baseurl }}/images/logopic/Honeywell_logo.svg){: style="max-height:100px; max-width:150px;  float: none; border: 10px"}
</td>
</tr>
</table>
</center>

<div class="col-sm-12" id="aerial-robotics">
## Aerial Robotics

<div class="col-sm-6 clearfix">
Unmanned aerial vehicles (UAVs) have been applied in aerial photography, surveillance, search and rescue, and precision agriculture. However, autonomous operations of small UAVs in dynamic environments pose challenges on the design of vehicle hardware and the embedded autonomy algorithms. Our research in this area includes (1) design of morphing UAVs, (2) dynamic modeling and precision control for the new hardware, and (3) aerial-physical interaction for navigation and manipulation.
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/uav/lab_website_all-drone_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<div class="col-sm-12 clearfix">
<details>
  <summary>
	> High-Fidelity Simulation of Aerial Robots
  </summary>
  <div class="col-sm-6 clearfix">
  <h4>Project Description</h4>
  Make a simulation pipeline to rapidly test algorithms for aerial robots.
  
  Integrate controllers using ROS2 into a simulation environment with Ardupilot and PX4 flight controllers.
  <h4>Representative Publications</h4>
[Nonlinear Wrench Observer of an Underactuated Aerial Manipulator](https://arc.aiaa.org/doi/abs/10.2514/6.2024-0660)


[Multi-Objective Optimization for Quadrotor Multibody Dynamic Simulations](https://arc.aiaa.org/doi/10.2514/6.2023-1280)

</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/KMJfgCVvdks?si=IqiogsKKsGcQrSq5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>

<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Design and Control of Flexible Quadrotors
  </summary>
  <div class="col-sm-6 clearfix">
  <h4>Project Description</h4>
To exploit the physical contact between the multi-rotor drone and its environment for better control and  manipulation and higher safety.

Developing various compliant multi-rotor drones for passive resilience in contacts, detecting the contacts via different sensing methods. Modeling and simulation of contacts/collisions between drones and their physical environment.
<h4>Representative Publications</h4>
[A Soft-Bodied Aerial Robot for Collision Resilience and Contact-Reactive Perching](https://www.liebertpub.com/doi/full/10.1089/soro.2022.0010)

[Design, Characterization and Control of a Whole-body Grasping and Perching (WHOPPEr) Drone](https://ieeexplore.ieee.org/abstract/document/10341722/)
</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/jpi-mJ6xJ6o?si=X2tbF-NcHKyHICI2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>

<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Contact Based Safe Navigation
  </summary>
  <div class="col-sm-6 clearfix">
<h4>Project Description</h4>
To exploit the physical contact between the multi-rotor drone and its environment for better control, motion planning and higher safety.
Developing a safe planning and control algorithm for collision based efficient navigation. Building a simulator for RL based planning integrating contact model and recovery controller. 
<h4>Representative Publications</h4>
[Tactile-based Exploration, Mapping and Navigation with Collision-Resilient Aerial Vehicles](https://arxiv.org/abs/2305.17217)

[Adaptive attitude control for foldable quadrotors](https://ieeexplore.ieee.org/abstract/document/10005814)
</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/tx7cvL9qyaM?si=IB3X3UdxQVEGvuZ5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>

<div class="col-sm-12 clearfix" id="soft-robotics">
## Soft Robotics

<div class="col-sm-6 clearfix">
Soft robotics is reshaping the future of technology by developing flexible, adaptable systems that safely interact with humans and operate in complex environments. Current projects include soft robotic manipulators designed for advanced modeling and control, fabric-based exosuits for assistance and rehabilitation, and a soft pipe inspection robot capable of navigating intricate pipelines for health monitoring. 
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/soft/lab_website_all-Soft_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<br><br><br><br>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Soft Robotics Arm
  </summary>
  <div class="col-sm-6 clearfix">
<h4>Project Description</h4> 
Modeling and control of Soft Robotic Arm.
Work on pneumatically operated soft robotic arm to test, train and implement models and develop control algorithms to achieve tasks including but not limited to trajectory tracking.
<h4>Representative Publications</h4>
[Design and computational Modeling of fabric Soft pneumatic Actuators for Wearable Assistive Devices](https://www.nature.com/articles/s41598-020-65003-2)

[Design and control of a 3-chambered fiber reinforced soft actuator with off-the-shelf stretch sensors](https://link.springer.com/article/10.1007/s41315-017-0020-z)
</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/n7Hid2VH8OA?si=m3KFShtuB-QgyWXs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Soft Robotic Exosuits
  </summary>
  <div class="col-sm-6 clearfix">
<h4>Project Description</h4>
Design, characterize and test soft inflatable actuator based exosuit on healthy human subjects to evaluate the assistance provided by exosuit.
Design and evaluate Soft Robotic exosuit powered by a new Inflatable Actuators and develop controls.
To evaluate the effect of exosuit during flexion and extension, surface electromyography (sEMG) sensors are placed to record the muscle activity. 
<h4>Representative Publications</h4>
[Gait Sensing and Haptic Feedback Using an Inflatable Soft Haptic Sensor](https://asmedigitalcollection.asme.org/lettersdynsys/article/4/1/011003/1193780)

[A Kinematically Constrained Kalman Filter for Sensor Fusion in a Wearable Origami Robot](https://asmedigitalcollection.asme.org/lettersdynsys/article/3/1/011005/1159780/A-Kinematically-Constrained-Kalman-Filter-for)
</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/2VuCrtyNzt0?si=TI-9l6E10lrhQbyB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Soft Pipe Inspection Robot
  </summary>
  <div class="col-sm-6 clearfix">
  <h4>Project Descriptiont</h4>
  This pipe inspection robot consists of several bistable inflatable fabric actuators, enabling it to navigate pipes of various sizes (4-6 inches in diameter) using inchworm locomotion.
Designed to handle obstacles within the pipes. The large bistable actuator located in the center of the robot generates impact force, allowing it to push away or break through obstructions. The smaller bistable actuators at the head and tail can adapt to diameter changes in pipes. 
Improving bistable structure (materials, fabrication methods.etc) to make it more reliable and robust
Control the robot to perform a jumping gait inside the pipe.
<h4>Representative Publications</h4>
[Design and Gait Optimization of an In-Pipe Robot with Bistable Inflatable Fabric Actuators](https://ieeexplore.ieee.org/abstract/document/10637194)

[Design, Characterization, and Dynamic Modeling of BEAST: a Bistable Elastomeric Actuator for Swift Tasks](https://ieeexplore.ieee.org/abstract/document/9762223)
</div>
<div class="col-sm-6 clearfix">
<iframe width="100%" height="256" src="https://www.youtube.com/embed/4QxHrXKJn4M?si=pcX88zSsp6uS9ZO2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
</details>
</div>

<div class="col-sm-12 clearfix" id="human-robot-interaction">
## Human-Robot Interaction
<div>
<div class="col-sm-6 clearfix">
For the humans and robots to collaborate safely and efficiently, a robot needs to understand human intents, predict human actions, consider human factors, to optimize its own actions to complete a task with human safely, efficiently, and friendly. One major challenge is to model the human actions in highly dynamic tasks given the strong variability and uncertainty of humans. We have developed a game-theoretic framework to model the bilateral inference and decision-making process between the human and robot. Applications include autonomous vehicles, collaborative manufacturing, and wearable robots. For more details about how we apply the developed algorithms to autonomous vehicles, please check [this page](../nri.html).
</div>

<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/hri/lab_website_all-HRI_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<br><br><br><br>
</div>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Modeling Human Bias and Uncertainties in HRI
  </summary>
  <div class="col-sm-6 clearfix">
  <h4>Project Description</h4>
Make AI better understand human preferences and decisions to make AI better able to assist.
Integrate risk-aware cognitive models (CPT) into interactive AI planning in an Overcooked environment and robotic Smart Bike.
<h4>Representative Publications</h4>
[What if I’m Wrong? Team Performance and Trustworthiness when Modeling Risk-Sensitivity in Human-Robot Collaboration]()

[Research Needs in Human-Autonomy Teaming: Thematic Analysis of Priority Features for Testbed Development](https://ieeexplore.ieee.org/abstract/document/10731453)
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/hri/risky_coordination_ring_seeking.gif){: style="width: 49%; float: right; border: 10px"}
![]({{ site.url }}{{ site.baseurl }}/images/respic/hri/risky_coordination_ring_averse.gif){: style="width: 49%; float: right; border: 10px"}
</div>
</details>
</div>

<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Bilateral Reasoning and Learning in HRI
  </summary>
  <div class="col-sm-6 clearfix">
  <h4>Project Description</h4>
Developing a game theoretical based controller
for physical human-robot interaction scenarios
such as controlling assistive wearable robots. 
We are aiming to integrate incomplete information
games with optimal control and reinforcement learning
to infer the human intent during HRI tasks and also model
the possible learning process of the human while interacting
with the robot.
<h4>Representative Publications</h4>
[Bounded Rational Game-theoretical Modeling of Human Joint Actions with Incomplete Information. ](https://ieeexplore.ieee.org/abstract/document/9982108)

[When Shall I Estimate Your Intent? Costs and Benefits of Intent Inference in Multi-Agent Interactions](https://ieeexplore.ieee.org/abstract/document/9867155)
</div>
<div class="col-sm-6 clearfix">

<!--<iframe width="100%" height="259" src="https://www.youtube.com/embed/0crb0119sgM?si=JEi-PcbdFbKU0ywg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>-->
![]({{ site.url }}{{ site.baseurl }}/images/respic/hri/Empathetic_V_NE.gif){: style="width: 95%; float: right; border: 10px"}
</div>

</details>

</div>

<p> &nbsp; </p>
