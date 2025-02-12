---
title: "ASU RISE Lab - NRI"
layout: textlay
excerpt: "AOA"
sitemap: false
permalink: /nri.html
---

## Scalable and Customizable Intent Inference and Motion Planning for Socially-Adept Autonomous Vehicles

### Project Summary 

The overall objective of this project is to allow future autonomous vehicles to 
interact with multiple surrounding vehicles in a safe and socially-adept manner. This objective will be 
achieved by developing a novel algorithm framework for an autonomous vehicle to anticipate other vehicles’ 
behavior and customize its motion according to the local driving culture. 

This project aims at answering two fundamental research questions: 1) what formalisms of intent inference and motion planning are capable 
of creating socially-adept motions, and 2) what embodiment of these formalisms can achieve scalability for 
multi-vehicle interactions and customizability for changing driving cultures? 

To answer these questions, the research team will pursue the following three goals. First, the project team will build a Bayesian game 
model to represent vehicle interactions, and develop mechanistic intent inference and motion planning policies. 
Second, a message passing neural network will be developed to enable scalable intent inference and motion prediction 
of multiple surrounding vehicles. Third, a social attention mechanism will be developed that allows an autonomous 
vehicle to actively prioritize its various control considerations, e.g., safety and courtesy towards the surrounding vehicles.
<figure>
<img src="{{ site.url }}{{ site.baseurl }}/images/respic/overview_nri.png" width="100%">
</figure>

### Project Team
<div class="row">

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/WL-400450.jpg){: style="width: 111px; float: center; border: 10px"}
Wenlong Zhang, PI
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/yren32.png){: style="width: 125px; float: center; border: 10px"}
Yi Ren, co-PI
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/yyang305.png){: style="width: 125px; float: center; border: 10px"}
Yezhou Yang, co-PI
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/sunny.jpg){: style="width: 125px; float: center; border: 10px"}
Sunny Amatya, researh assistant
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/Lei.jpg){: style="width: 125px; float: center; border: 10px"}
Lei Zhang, researh assistant
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/varun.jpg){: style="width: 125px; float: center; border: 10px"}
Varun Jammula, research assistant
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/sundevil.jpg){: style="width: 125px; float: center; border: 10px"}
Yi Chen, master's student
{: style="font-size: 100%; text-align: center;"}
</div>

<div class="col-sm-2 clearfix">
![]({{ site.url }}{{ site.baseurl }}/images/teampic/sundevil.jpg){: style="width: 125px; float: center; border: 10px"}
Tanner Merry, undergraduate (REU) student
{: style="font-size: 100%; text-align: center;"}
</div>

</div>

<div class="row">

<div class="col-sm-12 clearfix">
<h4>Project Alumni</h4>
{% for member in site.data.alumni_nri %}
{{ member.name }}<br>
{{ member.title }}<br>
{{ member.job }}
{% endfor %}
</div>

</div>


### Publications

[J1] Y. Wang, Y. Ren, S. Elliott and W. Zhang, "[Enabling Courteous Vehicle Interactions Through Game-Based and Dynamics-Aware Intent Inference](https://ieeexplore.ieee.org/abstract/document/8911426/)," 
<em> IEEE Transactions on Intelligent Vehicles </em>, vol. 5, no. 2, pp. 217-228, June 2020, doi: 10.1109/TIV.2019.2955897.
Source code available [here](https://github.com/DesignInformaticsLab/Social_Gracefulness_of_Autonomous_Systems) 

[J2] K. Gunasekar, Q. Qiu and Y. Yang, "[Low to High Dimensional Modality Hallucination Using Aggregated Fields of View](https://ieeexplore.ieee.org/abstract/document/8977350/)," 
in IEEE Robotics and Automation Letters, vol. 5, no. 2, pp. 1983-1990, April 2020, doi: 10.1109/LRA.2020.2970679.
Source code available [here](https://github.com/kausic94/Hallucination) 

[C1] Y. Ren, S. Elliott, Y. Wang, Y. Yang and W. Zhang, "[How Shall I Drive? Interaction Modeling and Motion Planning towards Empathetic and 
Socially-Graceful Driving](https://ieeexplore.ieee.org/abstract/document/8793835/)," <em> 2019 International Conference on Robotics and Automation (ICRA) </em>, 2019, pp. 4325-4331, doi: 10.1109/ICRA.2019.8793835.
Source code available [here](https://github.com/DesignInformaticsLab/Social_Gracefulness_of_Autonomous_Systems) 

[C2] Y. Chen, L. Zhang, T. Merry, S. Amatya, W. Zhang and Y. Ren, "[When Shall I Be Empathetic? The Utility of Empathetic Parameter Estimation in Multi-Agent Interactions](https://arxiv.org/abs/2011.02047)," <em> 2021 International Conference on Robotics and Automation (ICRA) </em>, 2021, accepted.

### Acknowledgement and Disclaimer

This material is based upon work supported by the National Science Foundation under Grant No. 1925403. 
Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors 
and do not necessarily reflect the views of the National Science Foundation.