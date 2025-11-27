ToDo:
- Need to add:
    - Biologically-inspired robot spatial cognition based on rat neurophysiological studies (Barrera & Weitzenfeld, 2007, 2008), cited by AdaptSLAM


- Lingering: 
    - Cited by NeoSLAM1:
        - (growing when required network): self-organizing method for robot navigation based on learned place and head-direction cells
        - (LSTM): Vector-based navigation using grid-like representations in artificial agents
    - Cited by NeoSLAM2:
        - Gist+RatSLAM, a framework that integrates the Gist descriptor into the RatSLAM pipeline
        - [ 32 ], Kasebi et al. used the Scale-Invariant Feature Transform (SIFT) algorithm to improve the visual matching of the RatSLAM system.
    - misc:
        - "Neuromorphic systems are still far away"
            - (2022) https://www.nature.com/articles/s41467-022-28487-2
            - "In general, the overall system design of traditional robotics and even current neuromorphic approaches is still far from any biological inspiration"
            - "the neuromorphic community should focus on the design of modular and reusable sensing and computing module"
            - beyond grasp:
                - full Hebbian learning
                     - Short-Term Depression (STD) and Short-Term Facilitation (STF), or Spike Frequency Adaptation (SFA)
                - rhythmic activity
                - Central Pattern Generator (CPG)
            
        - (2019) Robust Visual Self-localization and Navigation in Outdoor Environments Using Slow Feature Analysis by Benjamin Metka
        - (2020) Visual Localization and Mapping with Hybrid SFA. by M Haris, M Franzius, U Bauer-Wersing, SKK Karanam - CoRL, 
        - (2009) Unsupervised learning in reservoir computing: Modeling hippocampal place cells for small mobile robots by EA Antonelo, B Schrauwen - Artificial Neural Networks–ICANN 
        - (2017) Gridbot: Towards a Neuroinspired Navigation System For Robot Planning
        - (2025) Deep Learning-Emerged Grid Cells-Based Bio-Inspired Navigation in Robotics
            - doesn't mention ring attractor or continuous attractor
            - "Supervised Learning Grid Cell Module" could be used to enhance other systems
        - Prior survey paper: Review of Neurobiologically Based Mobile Robot Navigation System Research Performed Since 2000
        - survey paper: Bioinspired perception and navigation of service robots in indoor environments: A review

- Core questions:
- What are the novel contributions of this paper, specifically things that are different from RatSLAM's approach (RatSLAM uses pose cells, local view cells and an experience map)?
- Does the system use any visual input features (This includes visual templating, feature extraction, etc)?
- Is the camera/image input for the system stereo or monocular? Was it grayscale or color?
- How does the system keep track of head direction? Does it do anything novel to keep track of head direction?
- How does the system keep track of location? Does it use an "experience map"? is it 3D or 2D?
- Did the paper use a robot? If so, which robot?
- If the paper used a robot, what kind of sensors did it use (IMU, lidar, gyro, rgb-d camera, etc)? 
- What metrics of performance did the paper use?
- Did the paper compare against any existing SLAM methods? or only against ground truth?
- Does the paper provide a link to github or mention a codebase? Does it mention a programming language or specific software tools?
- Does the paper use an existing dataset or make its own? If it uses one, which one?
- Does the work use a neuromorphic chip or FPGA? If so, which one?
- Does this system take into account goals or tasks (e.g. beyond localization)?
    
- From research rabbit:
    - 2021: Towards a Predictive Bio-Inspired Navigation Model
    - 2024: Brain-Inspired Multisensor Navigation Information Fusion Model Based on Spatial Representation Cells
    - 2015: Emulating the Functionality of rodents' neurobiological Navigation and Spatial Cognition cells in a Mobile robot
    - 2022: Robotic Navigation Based on Experiences and Predictive Map Inspired by Spatial Cognition
    - 2021: Semi-Bionic SLAM Based on Visual Odometry and Deep Learning Network
    - 2020: Robotic Episodic Cognitive Learning Inspired by Hippocampal Spatial Cells
        - sounds very useful/relevant, but was not anywhere in the search or cited by anything in the search
    - almostQualifiedSystem, 2020 An On-chip Spiking Neural Network for Estimation of the Head Pose of the iCub Robot. 
    - 2020: The Self-Motion Information Response Model in Brain-Inspired Navigation
    
- Redo title of
    "of the simultaneous localization and mapping" to "An Application of the Simultaneous Localization and Mapping (SLAM) Method Based on the Unscented Kalman Filter (UKF) to a Reconfigurable Quadruped Robot with Crawling Locomotion"

- Negative filters:
    antibiotic
    Extracellular
    Pseudomonas aeruginosa Ocular Biofilms
    
- Manually add:
    - Robustness Improvement of Visual Templates Matching Based on Frequency-Tuned Model in RatSLAM
    - Multi-Scale Extension in an Entorhinal-Hippocampal Model for Cognitive Map Building, https://www.frontiersin.org/journals/neurorobotics/articles/10.3389/fnbot.2020.592057/full
    
- check:
    - Continuous State Estimation With Synapse-constrained Connectivity
    - Vision-IMU multi-sensor fusion semantic topological map based on RatSLAM
    - An Improved Loop Closure Detection for RatSLAM
    - The Graph SLAM Algorithm with Applications to Large-Scale Mapping of Urban Structures
- In paper
    - Check if paper used spiking neural network or neuromorphic chip
- conclusions:
    - We need a 3D environment in the browser, a benchmark (contrast, elongation, etc)
    - Lacking a spiking ring attractor RatSLAM

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
- todo:
    - Look at spiking network based on: https://github.com/TomKnowles1994/Biomimetics-Ring-Attractors
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
         
- Understand:
    - pike-Timing-Dependent Plasticity (STDP) learning rule
    - PEPITA - A Forward-Forward Alternative to Backpropagation
    - Understand the Simplified Higher Order Sequence Memory (SHOSM) algorithm (place recognition and HTM theory) from Neubert (cited in NeoSLAM paper)
    - "Multiple bumps can enhance robustness to noise in continuous attractor networks"

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
        - 2024 "A new dynamic shift mechanism based on cyclic group theory for continuous attractor neural networks"
- Do a full annotated pass of NeuroGPR paper
- what is Tianjic (a hybrid neuromorphic chip), how expensive is it? how hard is it to program? how powerful is it?
- Create a refreshed map of navigation and implementation "Are we bio-navigating yet?"
- DONE: Create a performance table of methods (NeoSLAM, LFVB-BioSLAM, ViTa-SLAM, etc)
- Look for related work of "Brain-inspired multimodal hybrid neural network for robot place recognition"
    - A compact neuromorphic system for ultra energy-efficient, on-device robot localization
    - Enhancing Visual Place Recognition via Fast and Slow Adaptive Biasing in Event Cameras
    - Neuromorphic sequence learning with an event camera on routes through vegetation
    - Ensembles of Compact, Region-specific & Regularized Spiking Neural Networks for Scalable Place Recognition
- Cited (by HsiSLAM), an RGB-D based RatSLAM: "RGB-D based cognitive map building and navigation" by Tian, B.; Shim, V.A.; Yuan, M.; Srinivasan, C.; Tang, H.; Li
- https://www.numenta.com/blog/2018/05/25/how-grid-cells-map-space/

Roughly Qualified Systems:
- NeoSLAM:
- NeuroGPR: 
- NeuroSLAM:
- ORB-NeuroSLAM: (ORB)-neuroslam (2024, IEEE Internet of Things Journal)
- HsiSLAM: An Environmental-Adaptability-Improved RatSLAM Method Based on a Biological Vision Model
- BoWSLAM: An Improvement of Loop Closure Detection Based on BoW for RatSLAM
- LFVB-BioSLAM: A Bionic SLAM System with a Light-Weight LiDAR Front End and a Bio-Inspired Visual Back End
- VitaSLAM: A Bio-inspired Visuo-Tactile SLAM for Navigation while Interacting with Aliased Environments
- RatSLAM:
- CannFlyNet: A Hybrid Compact Neural Architecture for Visual Place Recognition
- KeySLAM: A Brain-inspired SLAM System Based on Keyframe Template Matching


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
- Vector-based navigation using grid-like representations in artificial agents: https://github.com/Crouzbehmeshkin/BaninoGrid-Torch

Datasets:
- Nordland summer/fall/winter/sprign
- Oxford RobotCar
- Fusionopolis Building Singapore





Cite:


A virtual rodent predicts the structure of neural activity across behaviours
visual cortex as a limited resource system that self-learns an ecologically-general representation:
        accordingTo:
            $manuallyEntered:
                title: null
                doi: null
                year: null
                publisherFlags: null
                authorNames: null
                link: 'https://www.biorxiv.org/content/10.1101/2021.06.16.448730v6'
                pdfLink: null
                cites: null
                citedBy: null
                abstract: 'Studies of the mouse visual system have revealed a variety of visual brain areas that are thought to support a multitude of behavioral capacities, ranging from stimulus-reward associations, to goal-directed navigation, and object-centric discriminations. However, an overall understanding of the mouse’s visual cortex, and how it supports a range of behaviors, remains unknown. Here, we take a computational approach to help address these questions, providing a high-fidelity quantitative model of mouse visual cortex and identifying key structural and functional principles underlying that model’s success. Structurally, we find that a comparatively shallow network structure with a low-resolution input is optimal for modeling mouse visual cortex. Our main finding is functional—that models trained with task-agnostic, self-supervised objective functions based on the concept of contrastive embeddings are much better matches to mouse cortex, than models trained on supervised objectives or alternative self-supervised methods. This result is very much unlike in primates where prior work showed that the two were roughly equivalent, naturally leading us to ask the question of why these self-supervised objectives are better matches than supervised ones in mouse. To this end, we show that the self-supervised, contrastive objective builds a general-purpose visual representation that enables the system to achieve better transfer on out-of-distribution visual scene understanding and reward-based navigation tasks. Our results suggest that mouse visual cortex is a low-resolution, shallow network that makes best use of the mouse’s limited resources to create a light-weight, general-purpose visual system—in contrast to the deep, high-resolution, and more categorization-dominated visual system of primates.'
                oldLink: 'https://doi.org/10.1101/2021.06.16.448730'
                citationCount: null
            crossref:
                doi: 10.1101/2021.06.16.448730
            openAlex:
                doi: 'https://doi.org/10.1101/2021.06.16.448730'
                title: Mouse visual cortex as a limited resource system that self-learns an ecologically-general representation
                abstract: null
                concepts:
                    - neural dynamics and brain function
                    - neuroscience and neuropharmacology research
                    - neuroinflammation and neurodegeneration mechanisms
                    - cognitive neuroscience
                    - cellular and molecular neuroscience
                    - neurology
                    - visual objects
                    - representation
                    - visual cortex
                    - computer science
                    - categorization
                    - cognitive neuroscience of visual object recognition
                    - artificial intelligence
                    - machine learning
                    - representation (politics)
                    - object (grammar)
                    - psychology
                    - neuroscience
                    - perception
                    - political science
                    - law
                    - politics
                year: 2021
                authorNames:
                    - Aran Nayebi
                    - Nathan C. L. Kong
                    - Chengxu Zhuang
                    - Justin L. Gardner
                    - Anthony M. Norcia
                    - Daniel Yamins
                link: 'https://doi.org/10.1101/2021.06.16.448730'
                pdfLink: 'https://www.biorxiv.org/content/biorxiv/early/2022/08/14/2021.06.16.448730.full.pdf'
                citationCount: 11
                citedAlexIds:
                    - 'https://openalex.org/W114517082'
                    - 'https://openalex.org/W1437335841'
                    - 'https://openalex.org/W1512234833'
                    - 'https://openalex.org/W1715013381'
                    - 'https://openalex.org/W1903029394'
                    - 'https://openalex.org/W1970792572'
                    - 'https://openalex.org/W1984578972'
                    - 'https://openalex.org/W2001901429'
                    - 'https://openalex.org/W2025520018'
                    - 'https://openalex.org/W2032628202'
                    - 'https://openalex.org/W2040036684'
                    - 'https://openalex.org/W2047643928'
                    - 'https://openalex.org/W2052515926'
                    - 'https://openalex.org/W2058616551'
                    - 'https://openalex.org/W2066071461'
                    - 'https://openalex.org/W2084588382'
                    - 'https://openalex.org/W2085989895'
                    - 'https://openalex.org/W2092580449'
                    - 'https://openalex.org/W2094450831'
                    - 'https://openalex.org/W2098580305'
                    - 'https://openalex.org/W2108598243'
                    - 'https://openalex.org/W2116360511'
                    - 'https://openalex.org/W2117940227'
                    - 'https://openalex.org/W2121008432'
                    - 'https://openalex.org/W2135238780'
                    - 'https://openalex.org/W2143886954'
                    - 'https://openalex.org/W2145889472'
                    - 'https://openalex.org/W2146257965'
                    - 'https://openalex.org/W2150412316'
                    - 'https://openalex.org/W2156303437'
                    - 'https://openalex.org/W2160654481'
                    - 'https://openalex.org/W2163605009'
                    - 'https://openalex.org/W2274405424'
                    - 'https://openalex.org/W2286279415'
                    - 'https://openalex.org/W2338467621'
                    - 'https://openalex.org/W2345201999'
                    - 'https://openalex.org/W2407986585'
                    - 'https://openalex.org/W2412480261'
                    - 'https://openalex.org/W2557270725'
                    - 'https://openalex.org/W2563100679'
                    - 'https://openalex.org/W2568734123'
                    - 'https://openalex.org/W2569458742'
                    - 'https://openalex.org/W2717347056'
                    - 'https://openalex.org/W2737416093'
                    - 'https://openalex.org/W2757910899'
                    - 'https://openalex.org/W2785325870'
                    - 'https://openalex.org/W2798991696'
                    - 'https://openalex.org/W2800311957'
                    - 'https://openalex.org/W2809940376'
                    - 'https://openalex.org/W2811245934'
                    - 'https://openalex.org/W2842511635'
                    - 'https://openalex.org/W2892147425'
                    - 'https://openalex.org/W2898929289'
                    - 'https://openalex.org/W2949449018'
                    - 'https://openalex.org/W2949489566'
                    - 'https://openalex.org/W2951506741'
                    - 'https://openalex.org/W2962867885'
                    - 'https://openalex.org/W2963108696'
                    - 'https://openalex.org/W2963463006'
                    - 'https://openalex.org/W2970104209'
                    - 'https://openalex.org/W2971293928'
                    - 'https://openalex.org/W2972831213'
                    - 'https://openalex.org/W2978664050'
                    - 'https://openalex.org/W2982557070'
                    - 'https://openalex.org/W2994737554'
                    - 'https://openalex.org/W2998594809'
                    - 'https://openalex.org/W3009561768'
                    - 'https://openalex.org/W3034978746'
                    - 'https://openalex.org/W3035524453'
                    - 'https://openalex.org/W3048485349'
                    - 'https://openalex.org/W3073499157'
                    - 'https://openalex.org/W3094408775'
                    - 'https://openalex.org/W3097116240'
                    - 'https://openalex.org/W3107175997'
                    - 'https://openalex.org/W3107668149'
                    - 'https://openalex.org/W3118608800'
                    - 'https://openalex.org/W3119948327'
                    - 'https://openalex.org/W3132028004'
                    - 'https://openalex.org/W3142226569'
                    - 'https://openalex.org/W3171007011'
                    - 'https://openalex.org/W3173685023'
                    - 'https://openalex.org/W3193978033'
                    - 'https://openalex.org/W3212185810'
                    - 'https://openalex.org/W3215337369'
                    - 'https://openalex.org/W3217316163'
                    - 'https://openalex.org/W343636949'
                    - 'https://openalex.org/W4284895573'
                relatedAlexIds:
                    - 'https://openalex.org/W4379014468'
                    - 'https://openalex.org/W4242099210'
                    - 'https://openalex.org/W4211183178'
                    - 'https://openalex.org/W3197963161'
                    - 'https://openalex.org/W2158100814'
                    - 'https://openalex.org/W2140151361'
                    - 'https://openalex.org/W2122540908'
                    - 'https://openalex.org/W2101216464'
                    - 'https://openalex.org/W2008808038'
                    - 'https://openalex.org/W1984891974'
                openAlexId: W3195997287
            googleScholar:
                title: Mouse visual cortex as a limited resource system that self-learns an ecologically-general representation
                authorNames:
                    - A Nayebi
                    - NCL Kong
                    - C Zhuang
                pdfLink: null
                link: 'https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1011506'
                citationId: '2471520982509518470'
                multiArticleId: '2471520982509518470'
                citedByLink: 'https://scholar.google.com//scholar?cites=2471520982509518470&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII'
                publisherInfo: 'PLOS Computational, 2023'
                year: 2023
                linkToCitedBy: 'https://scholar.google.com//scholar?cites=2471520982509518470&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII'
                citationCount: 30
        