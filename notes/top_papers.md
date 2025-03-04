ToDo:
- Understand the Simplified Higher Order Sequence Memory (SHOSM) algorithm (place recognition and HTM theory) from Neubert (cited in NeoSLAM paper)
- Figure out what "FlyNet" is (comparision used in NeuroGPR paper)
- Figure out what "SPL" is (comparision used in NeuroGPR paper)
- what is Tianjic (a hybrid neuromorphic chip)
- Search more for components and implementation, ex: "head direction cells" and "pytorch"
- Create a refreshed map of navigation and implementation "Are we bio-navigating yet?"
- Create a performance table of methods (NeoSLAM, LFVB-BioSLAM, ViTa-SLAM, etc)
    - Performance compared to ORB-SLAM3
    - Is codebase available? (what language?)
    - Year
    - Tested on hardware
    - 3D
    - Stero cameras
    - Spectrums range (grayscale, color, polarization, IR-depth, lidar)
- Summarize the key facts of the 3D rat paper
- Learn what a "mushroom body" is, in relation to insect navigation (has to do with object recognition)
- Look for related work of "Brain-inspired multimodal hybrid neural network for robot place recognition"
    - A compact neuromorphic system for ultra energy-efficient, on-device robot localization
    - Enhancing Visual Place Recognition via Fast and Slow Adaptive Biasing in Event Cameras
    - Neuromorphic sequence learning with an event camera on routes through vegetation
    - Ensembles of Compact, Region-specific & Regularized Spiking Neural Networks for Scalable Place Recognition

Top Papers:
- Continuous State Estimation With Synapse-constrained Connectivity
- (ORB)-neuroslam (2024, IEEE Internet of Things Journal)
- An Environmental-Adaptability-Improved RatSLAM Method Based on a Biological Vision Model
- An Improvement of Loop Closure Detection Based on BoW for RatSLAM
- Vision-IMU multi-sensor fusion semantic topological map based on RatSLAM

Check performance / results of:
- NeoSLAM (hierchical temporal memory), code
- LFVB-BioSLAM: A Bionic SLAM System with a Light-Weight LiDAR Front End and a Bio-Inspired Visual Back End
- ViTa-SLAM: A Bio-inspired Visuo-Tactile SLAM for Navigation while Interacting with Aliased Environments (2019, IEEE)


Random facts:
- Anesthesia disrupts distance, but not direction, of path integration memory (that is also the title of the paper)

Future Code help:
- CNN based on fly's brain https://github.com/borstlab/normalization_paper/blob/master/cnn/model.py
- Ring attractor code: https://github.com/aplbrain/seismic/blob/main/neuroaiengines/networks/ring_attractor.py 
- Ring attractor code from NeuroGPR: https://github.com/cognav/NeuroGPR/blob/main/src/model/cann.py
- Vita SLAM: https://github.com/aalto-intelligent-robotics/ViTa-SLAM

Datasets:
- Nordland summer/fall/winter/sprign
- Oxford RobotCar