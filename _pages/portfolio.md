---
layout: single
title: "Portfolio"
permalink: /portfolio/
author_profile: true
classes: wide
date: February 21, 2022

feature_row1:
  - image_path: assets/images/stabilityflexibility.png
    # link: ../stability-flexibility-tradeoff
    alt: "Cognitive Stability and Flexibility"
    title: "Cognitive Stability and Flexibility"
    excerpt: "Adaptive behavior requires the ability to focus on a particular task or goal while avoiding distraction, known as cognitive stability, like reading a book in a busy coffee shop. It is also necessary to shift to new tasks in response to changing circumstances, known as cognitive flexibility, like answering an unexpected phone call. How these cognitive processes interact, and the computations underlying their regulation, remains an outstanding question in the field of cognitive psychology and neuroscience."
    url: https://psycnet.apa.org/record/2022-64811-001
    btn_label: "Geddert & Egner, 2022"
    btn_class: "btn--primary"
    # url2: https://github.com/rmgeddert/stability-flexibility-tradeoff
    # btn_label2: "Testing 2022"
    # btn_class2: "btn--primary"
    tags:
      - Javascript
      - R
      - Python

feature_row2:
  - image_path: assets/images/cognitive-map.png
    alt: "Cognitive Maps"
    link: "../cognitive_maps"
    title: "Cognitive Maps"
    excerpt: "Humans organize hierarchical information about their world into so-called \"cognitive maps\". But, do cognitive maps also guide higher cognitive processes and strategies like attention or cognitive control? In this line of work, I explore the fundamental computational bases of these processes and how they are organized in the brain."
    # url: "https://github.com/rmgeddert/Networks"
    # btn_label: "Javascript Task Code"
    # btn_class: "btn--primary"
    tags:
      - Javascript
      - R
      - Python

feature_row3:
  - title: "Computational Modeling"
    excerpt: "Rigorous computational theory on the stability - flexibility tradeoff is lacking, and models of independent stability-flexibility control adjustments are almost nonexistent. In this line of work, I employ Bayesian hierarchical parameter estimation combined with drift diffusion models (DDMs) and reinforcement learning to investigate the computational mechanisms underlying these cognitive processes."
    image_path: assets/images/modeling.jpg
    tags:
      - BRMS
      - Bayesian Model Fitting
      - STAN

feature_row4:
  - title: "Intercranial EEG"
    excerpt: "Intercranial electroencephalography (iEEG) offers a rare and powerful look into the temporal and neural basis of cognitive computations in the brain. Here, I employ permutation based clustering algorithms to identify neural subregions that relate to cognitive control processes in an attentional shifting task. We specifically focus on high-frequency signals (so called high-frequency bandwidth, or HFB; >50Hz), as these offer the closest mirroring of neural during behavior during these cognitive processes."
    image_path: assets/images/dlpfc_congruency.jpg
    tags:
      - Permutation Testing
      - Nonparametric Stats
      - Cluster Correction
      - R
      - Matlab

feature_row5:
  - title: "Chess AI Algorithm From Scratch"
    excerpt: "I love chess, and I love programming! In this series of blog posts, I create and implement a chess AI in javascript that you can play against. Using algorithms like minimax with optimizations like alpha-beta pruning and iterative deepening, I create a fearsome opponent that won't rollover so easily!"
    image_path: assets/images/minimax.jpg
    link: /simple-chess-ai-part1
    tags:
      - Minimax algorithm
      - Alpha-beta pruning
      - Iterative deepening
      - JavasScript

feature_row6:
  - title: "Linear and Logistic Regression from Scratch"
    excerpt: "One fun project I had the opportunity to do was implementing logistic regression and its extension, multiclass logistic regression, from scratch in Python. Besides being super interesting from a conceptual standpoint, this taught me so much about gradient descent algorithms and how we can evaluate gradients using derivatives."
    url: https://github.com/rmgeddert/MachineLearningPythonExercises
    image_path: assets/images/logreg.jpg
    btn_label: "Python Notebook"
    btn_class: "btn--primary"
    tags:
      - Logistic Regression
      - Cross-Entropy Loss



---

<link rel="stylesheet" href="../assets/css/styles.css">

Welcome to my portfolio! I am a cognitive and computational neuroscientist, exploring questions relating to human attention, cognitive control, and reinforcement learning. I am an avid programmer, data scientist, and hobbyist as well, and have frequently pursued passion projects to learn new skills (or just for fun!). You can find some of my research and some of the data science projects I have worked on below.

<hr>
## My PhD Research

{% include feature_row id="feature_row1" type="left" %}
{% include feature_row id="feature_row2" type="left" %}
{% include feature_row id="feature_row3" type="left" %}
{% include feature_row id="feature_row4" type="left" %}

<hr>

## Data Science, Machine Learning, and AI Projects/Hobbies

{% include feature_row id="feature_row5" type="left" %}
{% include feature_row id="feature_row6" type="left" %}
