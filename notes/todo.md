ToDo:
- check:
    - A Brain-inspired SLAM System Based on Keyframe Template Matching
    - Continuous State Estimation With Synapse-constrained Connectivity
    - Vision-IMU multi-sensor fusion semantic topological map based on RatSLAM
    - An Improved Loop Closure Detection for RatSLAM

- create some buckets:
    - possible-state of the art bio-solutions solving core problem
    - reference work:
        - neuro work (mushroom body, hebbian learning, behavior of drosophila, etc)
        - spiking neural work
        - memory approaches and justifications (hierarchical temporal memory, etc)
        - old RatSLAM
    - related work:
        - locomotion
        - sound localization
        - pose estimation
    - appendix:
        - sensor limitations
        - survey of neuromorphic hardware
        - survey of spiking neural network performance
        - survey of SLAM performance
- notes:
    - positive:
    - negative:
        - õ
        - for stock trading
        - LiDAR
    - neutral:
        - goal
        - FPGA
    - look at:
        - AntBot: A six-legged walking robot able to home like desert ants in outdoor environments
        - SMCN: Simplified mini-column network for visual place recognition
        - Self-organized attractoring in locomoting animals and robots: an emerging field
        - NeuroMechFly v2: simulating embodied sensorimotor control in adult Drosophila
        - Cortical mechanisms of multisensory linear self-motion perception
    - personal curiosity:
        - Neurodynamic sensory-motor phase binding for multi-legged walking robots
        - Bioinspired sensors and applications in intelligent robots: a review
         
         
- Understand the Simplified Higher Order Sequence Memory (SHOSM) algorithm (place recognition and HTM theory) from Neubert (cited in NeoSLAM paper)
- Figure out what "SPL" is (comparision used in NeuroGPR paper)
- non-navigation searches
    - navigation components and implementation, ex: "head direction cells" and "pytorch"
        - done: "ring attractor" and "pytorch"
            - seismic
            - rat in a box
        - done: "continuous attractor" and "pytorch"
            - none
    - finish exploring the spiking neural network stuff
        - LoCS-Net: Localizing convolutional spiking neural network for fast visual place recognition
        - Ensembles of Compact, Region-specific & Regularized Spiking Neural Networks for Scalable Place Recognition
        - Reinforcement co-Learning of Deep and Spiking Neural Networks for Energy-Efficient Mapless Navigation with Neuromorphic Hardware
        - Spiking Neural Networks for Visual Place Recognition Via Weighted Neuronal Assignments
        - Exploiting semantic information in a spiking neural SLAM system
        - VPRTempo: A Fast Temporally Encoded Spiking Neural Network for Visual Place Recognition
        - Event-driven Tactile Sensing With Dense Spiking Graph Neural Networks
        - Spatio-Temporal Backpropagation for Training High-Performance Spiking Neural Networks
        - Pose Estimation and Map Formation with Spiking Neural Networks: towards Neuromorphic SLAM (2018) 
        - Reinforcement co-Learning of Deep and Spiking Neural Networks for Energy-Efficient Mapless Navigation with Neuromorphic Hardware (2020)
        - Spiking Neural Networks for Visual Place Recognition Via Weighted Neuronal Assignments (2022)
    - current neuro knowledge
        - Summarize the key facts of the 3D rat paper
        - Learn what a "mushroom body" is, in relation to insect navigation (has to do with object recognition)
- Do a full annotated pass of NeuroGPR paper
- what is Tianjic (a hybrid neuromorphic chip), how expensive is it? how hard is it to program? how powerful is it?
- Create a refreshed map of navigation and implementation "Are we bio-navigating yet?"
- DONE: Create a performance table of methods (NeoSLAM, LFVB-BioSLAM, ViTa-SLAM, etc)
- Look for related work of "Brain-inspired multimodal hybrid neural network for robot place recognition"
    - A compact neuromorphic system for ultra energy-efficient, on-device robot localization
    - Enhancing Visual Place Recognition via Fast and Slow Adaptive Biasing in Event Cameras
    - Neuromorphic sequence learning with an event camera on routes through vegetation
    - Ensembles of Compact, Region-specific & Regularized Spiking Neural Networks for Scalable Place Recognition

Qualified Systems:
- NeoSLAM:
- NeuroGPR: 
- NeuroSLAM:
- ORB-NeuroSLAM: (ORB)-neuroslam (2024, IEEE Internet of Things Journal)
- HsiSLAM: An Environmental-Adaptability-Improved RatSLAM Method Based on a Biological Vision Model
- BoWSLAM: An Improvement of Loop Closure Detection Based on BoW for RatSLAM
- LFVB-BioSLAM: A Bionic SLAM System with a Light-Weight LiDAR Front End and a Bio-Inspired Visual Back End
- VitaSLAM: A Bio-inspired Visuo-Tactile SLAM for Navigation while Interacting with Aliased Environments
- RatSLAM:

Spiking Systems:
- VPRTempo: A Fast Temporally Encoded Spiking Neural Network for Visual Place Recognition
- LoCS-Net: Localizing convolutional spiking neural network for fast visual place recognition
- Spiking Neural Networks for Visual Place Recognition Via Weighted Neuronal Assignments (2022)
- Ensembles of Compact, Region-specific & Regularized Spiking Neural Networks for Scalable Place Recognition
- Pose Estimation and Map Formation with Spiking Neural Networks: towards Neuromorphic SLAM (2018)
- Reinforcement co-Learning of Deep and Spiking Neural Networks for Energy-Efficient Mapless Navigation with Neuromorphic Hardware
- Exploiting semantic information in a spiking neural SLAM system
- Event-driven Tactile Sensing With Dense Spiking Graph Neural Networks
- Spatio-Temporal Backpropagation for Training High-Performance Spiking Neural Networks
- Reinforcement co-Learning of Deep and Spiking Neural Networks for Energy-Efficient Mapless Navigation with Neuromorphic Hardware (2020)


Misc Papers I might want to cite:
- VPR-Bench: An Open-Source Visual Place Recognition Evaluation Framework with Quantifiable Viewpoint and Appearance Change

Random facts:
- Anesthesia disrupts distance, but not direction, of path integration memory (that is also the title of the paper)

Future Code help:
- CNN based on fly's brain https://github.com/borstlab/normalization_paper/blob/master/cnn/model.py
- Ring attractor code: https://github.com/aplbrain/seismic/blob/main/neuroaiengines/networks/ring_attractor.py 
- Ring attractor code from NeuroGPR: https://github.com/cognav/NeuroGPR/blob/main/src/model/cann.py
- Vita SLAM: https://github.com/aalto-intelligent-robotics/ViTa-SLAM
- Rat Simulator for getting data: https://github.com/RatInABox-Lab/RatInABox
- Event Camera Emulation: https://github.com/af-a/event_camera_emulation.

Datasets:
- Nordland summer/fall/winter/sprign
- Oxford RobotCar