---
title: "ASU RISE Lab - Research"
layout: textlay
excerpt: "ASU RISE Lab -- Research"
sitemap: false
permalink: /research/
---

# Research

The overarching goal of our research is to develop novel learning and 
control algorithms to enable robots to safely and efficiently collaborate 
with humans and other robots to complete complex tasks. The algorithms are 
applied to various robot platforms, including [aerial robotics](#aerial-robotics), [soft robotics](#soft-robotics), and [human-robot interaction](#human-robot-interaction). Please check the summary of each 
project below and feel free to contact us if you have any questions or want to know more details!

We greatly acknowledge the National Science Foundation, Office of Naval Research, 
Science Foundation Arizona, Arizona Department of Health Services, Salt River Project, Northrop Grumman Cooperation, 
and several internal funding sources, for supporting our past and current research.
<div class="col-sm-12" id="aerial-robotics">
## Aerial Robotics

<div class="col-sm-6 clearfix">
Unmanned aerial vehicles (UAVs) are popular in various applications, such as aerial photography, surveillance, search and rescue, and precision agriculture. However, autonomous operations of small UAVs in dynamic environments pose challenges on the design of vehicle hardware and the embedded autonomy algorithms. Our research in this area includes (1) exploring the design of morphing UAVs, (2) developing dynamic models and precision control algorithms for the new hardware, and (3) demonstrating aerial-physical interaction for navigation and manipulation.
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/uav/lab_website_all-drone_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<div class="col-sm-12 clearfix">
<details>
  <summary>
	> Software-in-the-Loop Simulation of Aerial Robots
  </summary>
  <h4>Goal</h4>
  Make a simulation pipeline to rapidly test algorithms for aerial robots.
  <h4>Project Description</h4>
  Integrate controllers using ROS2 into a simulation environment with Ardupilot and PX4 flight controllers.
</details>

<details>
  <summary>
    > Contact Based Soft Aerial Robots
  </summary>
  <h4>Goal</h4>
To exploit the physical contact between the multi-rotor drone and its environment for better control and  manipulation and higher safety.
<h4>Project Description</h4>
Developing various compliant multi-rotor drones for passive resilience in contacts, detecting the contacts via different sensing methods. Modeling and simulation of contacts/collisions between drones and their physical environment.

</details>

<details>
  <summary>
    > Contact Based Safe Navigation for Aerial Robots
  </summary>
<h4>Goal</h4>
To exploit the physical contact between the multi-rotor drone and its environment for better control, motion planning and higher safety.
<h4>Project Description</h4>
Developing a safe planning and control algorithm for collision based efficient navigation. Building a simulator for RL based planning integrating contact model and recovery controller. 

</details>
</div>

<div class="col-sm-12 clearfix" id="soft-robotics">
## Soft Robotics

<div class="col-sm-6 clearfix">
Soft robotics is reshaping the future of technology by developing flexible, adaptable systems that safely interact with humans and operate in complex environments. By utilizing soft, deformable materials, this work focuses on creating robots that address real-world challenges across various industries. Current projects include a precision-engineered soft robotic arm designed for advanced modeling and control, pneumatic fabric-based exosuits that offer personalized support for individuals in rehabilitation, and a soft pipe inspection robot capable of navigating intricate pipelines to ensure safe and efficient maintenance. These technologies aim to improve quality of life, enhance mobility, and enable safer infrastructure management. The driving mission is to push the boundaries of robotics through human-centered, adaptable designs that meet the growing demand for innovative solutions in healthcare, industry, and beyond, offering systems that are not only efficient but also intuitive in their interaction with people.
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/soft/lab_website_all-Soft_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<br><br><br><br>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Soft Robotic Arm
  </summary>
<h4>Goal</h4> 
Modeling and control of Soft Robotic Arm.
<h4>Project Description</h4> 
Work on pneumatically operated soft robotic arm to test, train and implement models and develop control algorithms to achieve tasks including but not limited to trajectory tracking.

</details>

<details>
  <summary>
    > Soft Knee Exosuit
  </summary>
<h4>Goal</h4>
Design, characterize and test soft inflatable actuator based exosuit on healthy human subjects to evaluate the assistance provided by exosuit.
<h4>Project Description</h4>
Design and evaluate Soft Robotic exosuit powered by a new Inflatable Actuators and develop controls.
To evaluate the effect of exosuit during flexion and extension, surface electromyography (sEMG) sensors are placed to record the muscle activity. 

</details>

<details>
  <summary>
    > Pipe Inspection Robot
  </summary>
  <h4>Goal</h4>
  This pipe inspection robot consists of several bistable inflatable fabric actuators, enabling it to navigate pipes of various sizes (4-6 inches in diameter) using inchworm locomotion.
<h4>Project Description</h4>
Designed to handle obstacles within the pipes. The large bistable actuator located in the center of the robot generates impact force, allowing it to push away or break through obstructions. The smaller bistable actuators at the head and tail can adapt to diameter changes in pipes. 
<h4>Projects related to this work including</h4>
Improving bistable structure (materials, fabrication methods.etc) to make it more reliable and robust
Control the robot to perform a jumping gait inside the pipe.

</details>
</div>

<div class="col-sm-12 clearfix" id="human-robot-interaction">
## Human-Robot Interaction

<div class="col-sm-6 clearfix">
Robots are increasingly employed in close proximity to humans. For the humans and robots to collaborate safely and efficiently, a robot needs to understand human intents, predict human actions, consider human factors, in order to optimize its own actions to complete a task with human safely, efficiently, and friendly. Here we will explore a game-theoretic framework to model the bilateral inference and decision making process between the human and robot. We are interested in both proximal and physical tasks that involve joint decision-making and joint-action between the human and robot. One major challenge is to model the human actions in highly dynamic tasks given the strong variability and uncertainty of humans. We will apply the developed algorithms in various human-robot collaboration scenarios, including autonomous vehicles, collaborative manufacturing, wearable robots, and assistive devices. For more details about how we apply the developed algorithms to autonomous vehicles, please check [this page](../nri.html).
</div>
<div class="col-sm-6 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/respic/hri/lab_website_all-HRI_all.png){: style="width: 95%; float: right; border: 10px"}
</div>
</div>
<br><br><br><br>
<div class="col-sm-12 clearfix">
<details>
  <summary>
    > Prospect-Theoretic Reinforcement Learning in Overcooked
  </summary>
  <h4>Goal</h4>
Make AI better understand human preferences and decisions to make AI better able to assist.
<h4>Project Description</h4>
Integrate risk-aware cognitive models (CPT) into interactive AI planning in an Overcooked environment.

</details>

<details>
  <summary>
    > Game Theoretical Modeling of Physical Human-Robot Interactions
  </summary>
  <h4>Goal</h4>
Developing a game theoretical based controller
for physical human-robot interactions scenario
such as controlling assistive wearable robots. 
<h4>Project Description</h4>
We are aiming to integrate incomplete information
	games with optimal control and reinforcement learning
to infer the human intent during HRI tasks and also model
the possible learning process of the human while interacting
with the robot.

</details>

<details>
  <summary>
    > Assistive and Autonomous Vehicles
  </summary>
 <h4>Goal</h4>
Apply smart algorithms in vehicular systems to interpret and predict human actions for improved intent inference and assistance.
<h4>Project Description</h4>
Design and implement human models, algorithms on standard bicycles and simulated autonomous vehicles to provide advance warning of obstacles and collisions.

</details>
</div>

<p> &nbsp; </p>