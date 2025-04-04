#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from '../main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'
import { rankedCompare } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/ranked_compare.js'
import { indent } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/indent.js'
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"


const references = Object.values(main.activeProject.references).sort((a,b)=>rankedCompare(b.score,a.score))
const discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)

const manualAbstracts = {
    "3D pose estimation enables virtual head fixation in freely moving rats": "The impact of spontaneous movements on neuronal activity has created the need to quantify behavior. We present a versatile framework to directly capture the 3D motion of freely definable body points in a marker-free manner with high precision and reliability. Combining the tracking with neural recordings revealed multiplexing of information in the motor cortex neurons of freely moving rats. By integrating multiple behavioral variables into a model of the neural response, we derived a virtual head fixation for which the influence of specific body movements was removed. This strategy enabled us to analyze the behavior of interest (e.g., front paw movements). Thus, we unveiled an unexpectedly large fraction of neurons in the motor cortex with tuning to the paw movements, which was previously masked by body posture tuning. Once established, our framework can be efficiently applied to large datasets while minimizing the experimental workload caused by animal training and manual labeling.",
    "A thalamic reticular circuit for head direction cell tuning and spatial navigation": "As we navigate in space, external landmarks and internal information guide our movement. Circuit and synaptic mechanisms that integrate these cues with head-direction (HD) signals remain, however, unclear. We identify an excitatory synaptic projection from the presubiculum (PreS) and the multisensory-associative retrosplenial cortex (RSC) to the anterodorsal thalamic reticular nucleus (TRN), so far classically implied in gating sensory information flow. In vitro, projections to TRN involve AMPA/NMDA-type glutamate receptors that initiate TRN cell burst discharge and feedforward inhibition of anterior thalamic nuclei. In vivo, chemogenetic anterodorsal TRN inhibition modulates PreS/RSC-induced anterior thalamic firing dynamics, broadens the tuning of thalamic HD cells, and leads to preferential use of allo- over egocentric search strategies in the Morris water maze. TRN-dependent thalamic inhibition is thus an integral part of limbic navigational circuits wherein it coordinates external sensory and internal HD signals to regulate the choice of search strategies during spatial navigation.",
    "The neurobiology of mammalian navigation": "Mammals have evolved specialized brain systems to support efficient navigation within diverse habitats and over varied distances, but while navigational strategies and sensory mechanisms vary across species, core spatial components appear to be widely shared. This review presents common elements found in mammalian spatial mapping systems, focusing on the cells in the hippocampal formation representing orientational and locational spatial information, and ‘core’ mammalian hippocampal circuitry. Mammalian spatial mapping systems make use of both allothetic cues (space-defining cues in the external environment) and idiothetic cues (cues derived from self-motion). As examples of each cue type, we discuss: environmental boundaries, which control both orientational and locational neuronal activity and behaviour; and ‘path integration’, a process that allows the estimation of linear translation from velocity signals, thought to depend upon grid cells in the entorhinal cortex. Building cognitive maps entails sampling environments: we consider how the mapping system controls exploration to acquire spatial information, and how exploratory strategies may integrate idiothetic with allothetic information. We discuss how ‘replay’ may act to consolidate spatial maps, and simulate trajectories to aid navigational planning. Finally, we discuss grid cell models of vector navigation.", 
    "Long-distance descending spinal neurons ensure quadrupedal locomotor stability": "Locomotion is an essential animal behavior used for translocation. The spinal cord acts as key executing center, but how it coordinates many body parts located across distance remains poorly understood. Here we employed mouse genetic and viral approaches to reveal organizational principles of long-projecting spinal circuits and their role in quadrupedal locomotion. Using neurotransmitter identity, developmental origin, and projection patterns as criteria, we uncover that spinal segments controlling forelimbs and hindlimbs are bidirectionally connected by symmetrically organized direct synaptic pathways that encompass multiple genetically tractable neuronal subpopulations. We demonstrate that selective ablation of descending spinal neurons linking cervical to lumbar segments impairs coherent locomotion, by reducing postural stability and speed during exploratory locomotion, as well as perturbing interlimb coordination during reinforced high-speed stepping. Together, our results implicate a highly organized long-distance projection system of spinal origin in the control of postural body stabilization and reliability during quadrupedal locomotion.", 
    "Robotics and neuroscience": "In the attempt to build adaptive and intelligent machines, roboticists have looked at neuroscience for more than half a century as a source of inspiration for perception and control. More recently, neuroscientists have resorted to robots for testing hypotheses and validating models of biological nervous systems. Here, we give an overview of the work at the intersection of robotics and neuroscience and highlight the most promising approaches and areas where interactions between the two fields have generated significant new insights. We articulate the work in three sections, invertebrate, vertebrate and primate neuroscience. We argue that robots generate valuable insight into the function of nervous systems, which is intimately linked to behaviour and embodiment, and that brain-inspired algorithms and devices give robots life-like capabilities.", 
    "Alzheimer's pathology causes impaired inhibitory connections and reactivation of spatial codes during spatial navigation": "Synapse loss and altered synaptic strength are thought to underlie cognitive impairment in Alzheimer’s disease (AD) by disrupting neural activity essential for memory. While synaptic dysfunction in AD has been well characterized in anesthetized animals and in vitro, it remains unknown how synaptic transmission is altered during behavior. By measuring synaptic efficacy as mice navigate in a virtual reality task, we find deficits in interneuron connection strength onto pyramidal cells in hippocampal CA1 in the 5XFAD mouse model of AD. These inhibitory synaptic deficits are most pronounced during sharp-wave ripples, network oscillations important for memory that require inhibition. Indeed, 5XFAD mice exhibit fewer and shorter sharp-wave ripples with impaired place cell reactivation. By showing inhibitory synaptic dysfunction in 5XFAD mice during spatial navigation behavior and suggesting a synaptic mechanism underlying deficits in network activity essential for memory, this work bridges the gap between synaptic and neural activity deficits in AD.", 
    "Stimulus-dependent synaptic plasticity underlies neuronal circuitry refinement in the mouse primary visual cortex": "Perceptual learning improves our ability to interpret sensory stimuli present in our environment through experience. Despite its importance, the underlying mechanisms that enable perceptual learning in our sensory cortices are still not fully understood. In this study, we used in vivo two-photon imaging to investigate the functional and structural changes induced by visual stimulation in the mouse primary visual cortex (V1). Our results demonstrate that repeated stimulation leads to a refinement of V1 circuitry by decreasing the number of responsive neurons while potentiating their response. At the synaptic level, we observe a reduction in the number of dendritic spines and an overall increase in spine AMPA receptor levels in the same subset of neurons. In addition, visual stimulation induces synaptic potentiation in neighboring spines within individual dendrites. These findings provide insights into the mechanisms of synaptic plasticity underlying information processing in the neocortex.", 
    "Effects of neuromodulation-inspired mechanisms on the performance of deep neural networks in a spatial learning task": "In recent years, the biological underpinnings of adaptive learning have been modeled, leading to faster model convergence and various behavioral benefits in tasks including spatial navigation and cue-reward association. Furthermore, studies have investigated how the neuromodulatory system, a major driver of synaptic plasticity and state-dependent changes in the brain neuronal activities, plays a role in training deep neural networks (DNNs). In this study, we extended previous studies on neuromodulation-inspired DNNs and explored the effects of neuromodulatory components on learning and single unit activities in a spatial learning task. Under the multiscale neuromodulatory framework, plastic components, dropout probability modulation, and learning rate decay were added to the single unit, layer, and whole network levels of DNN models, respectively. We observed behavioral benefits including faster learning and smaller error of ambulation. We then concluded that neuromodulatory components can affect learning trajectories, outcomes, and single unit activities, in a component- and hyperparameter-dependent manner.", 
    "When the ventral visual stream is not enough: A deep learning account of medial temporal lobe involvement in perception": "The medial temporal lobe (MTL) supports a constellation of memory-related behaviors. Its involvement in perceptual processing, however, has been subject to enduring debate. This debate centers on perirhinal cortex (PRC), an MTL structure at the apex of the ventral visual stream (VVS). Here we leverage a deep learning framework that approximates visual behaviors supported by the VVS (i.e., lacking PRC). We first apply this approach retroactively, modeling 30 published visual discrimination experiments: excluding non-diagnostic stimulus sets, there is a striking correspondence between VVS-modeled and PRC-lesioned behavior, while each is outperformed by PRC-intact participants. We corroborate and extend these results with a novel experiment, directly comparing PRC-intact human performance to electrophysiological recordings from the macaque VVS: PRC-intact participants outperform a linear readout of high-level visual cortex. By situating lesion, electrophysiological, and behavioral results within a shared computational framework, this work resolves decades of seemingly inconsistent findings surrounding PRC involvement in perception.", 
    "Coherently remapping toroidal cells but not grid cells are responsible for path integration in virtual agents": "It is widely believed that grid cells provide cues for path integration, with place cells encoding an animal’s location and environmental identity. When entering a new environment, these cells remap concurrently, sparking debates about their causal relationship. Using a continuous attractor recurrent neural network, we study spatial cell dynamics in multiple environments. We investigate grid cell remapping as a function of global remapping in place-like units through random resampling of place cell centers. Dimensionality reduction techniques reveal that a subset of cells manifest a persistent torus across environments. Unexpectedly, these toroidal cells resemble band-like cells rather than high grid score units. Subsequent pruning studies reveal that toroidal cells are crucial for path integration while grid cells are not. As we extend the model to operate across many environments, we delineate its generalization boundaries, revealing challenges with modeling many environments in current models.", 
    "Parallel pathways carrying direction-and orientation-selective retinal signals to layer 4 of the mouse visual cortex": "Parallel visual pathways from the retina to the primary visual cortex (V1) via the lateral geniculate nucleus are common to many mammalian species, including mice, carnivores, and primates. However, it remains unclear which visual features present in both retina and V1 may be inherited from parallel pathways versus extracted by V1 circuits in the mouse. Here, using calcium imaging and rabies circuit tracing, we explore the relationships between tuning of layer 4 (L4) V1 neurons and their retinal ganglion cell (RGC) inputs. We find that subpopulations of L4 V1 neurons differ in their tuning for direction, orientation, spatial frequency, temporal frequency, and speed. Furthermore, we find that direction-tuned L4 V1 neurons receive input from direction-selective RGCs, whereas orientation-tuned L4 V1 neurons receive input from orientation-selective RGCs. These results suggest that direction and orientation tuning of V1 neurons may be partly inherited from parallel pathways originating in the retina.", 
    "A visual-cue-dependent memory circuit for place navigation": "The ability to remember and to navigate to safe places is necessary for survival. Place navigation is known to involve medial entorhinal cortex (MEC)-hippocampal connections. However, learning-dependent changes in neuronal activity in the distinct circuits remain unknown. Here, by using optic fiber photometry in freely behaving mice, we discovered the experience-dependent induction of a persistent-task-associated (PTA) activity. This PTA activity critically depends on learned visual cues and builds up selectively in the MEC layer II-dentate gyrus, but not in the MEC layer III-CA1 pathway, and its optogenetic suppression disrupts navigation to the target location. The findings suggest that the visual system, the MEC layer II, and the dentate gyrus are essential hubs of a memory circuit for visually guided navigation.", 
    "Predictive sequence learning in the hippocampal formation": "The hippocampus receives sequences of sensory inputs from the cortex during exploration and encodes the sequences with millisecond precision. We developed a predictive autoencoder model of the hippocampus including the trisynaptic and monosynaptic circuits from the entorhinal cortex (EC). CA3 was trained as a self-supervised recurrent neural network to predict its next input. We confirmed that CA3 is predicting ahead by analyzing the spike coupling between simultaneously recorded neurons in the dentate gyrus, CA3, and CA1 of the mouse hippocampus. In the model, CA1 neurons signal prediction errors by comparing CA3 predictions to the next direct EC input. The model exhibits the rapid appearance and slow fading of CA1 place cells and displays replay and phase precession from CA3. The model could be learned in a biologically plausible way with error-encoding neurons. Similarities between the hippocampal and thalamocortical circuits suggest that such computation motif could also underlie self-supervised sequence learning in the cortex.", 
    "Integration and competition between space and time in the hippocampus": "Episodic memory is organized in both spatial and temporal contexts. The hippocampus is crucial for episodic memory and has been demonstrated to encode spatial and temporal information. However, how the representations of space and time interact in the hippocampal memory system is still unclear. Here, we recorded the activity of hippocampal CA1 neurons in mice in a variety of one-dimensional navigation tasks while systematically varying the speed of the animals. For all tasks, we found neurons simultaneously represented space and elapsed time. There was a negative correlation between the preferred space and lap duration, e.g., the preferred spatial position shifted more toward the origin when the lap duration became longer. A similar relationship between the preferred time and traveled distance was also observed. The results strongly suggest a competitive and integrated representation of space-time by single hippocampal neurons, which may provide the neural basis for spatiotemporal contexts.", 
    "Different encoding of reward location in dorsal and intermediate hippocampus": "Hippocampal place cells fire at specific locations in the environment. They form a cognitive map that encodes spatial relations in the environment, including reward locations.1 As part of this encoding, dorsal CA1 (dCA1) place cells accumulate at reward.2–5 The encoding of learned reward location could vary between the dorsal and intermediate hippocampus, which differ in gene expression and cortical and subcortical connectivity.6 While the dorsal hippocampus is critical for spatial navigation, the involvement of intermediate CA1 (iCA1) in spatial navigation might depend on task complexity7 and learning phase.8–10 The intermediate-to-ventral hippocampus regulates reward-seeking,11–15 but little is known about the involvement in reward-directed navigation. Here, we compared the encoding of learned reward locations in dCA1 and iCA1 during spatial navigation. We used calcium imaging with a head-mounted microscope to track the activity of CA1 cells over multiple days during which mice learned different reward locations. In dCA1, the fraction of active place cells increased in anticipation of reward, but the pool of active cells changed with the reward location. In iCA1, the same cells anticipated multiple reward locations. Our results support a model in which the dCA1 cognitive map incorporates a changing population of cells that encodes reward proximity through increased population activity, while iCA1 provides a reward-predictive code through a dedicated subpopulation. Both of these location-invariant codes persisted over time, and together they provide a dual hippocampal reward location code, assisting goal-directed navigation.16,17", 
    "The choroid plexus synergizes with immune cells during neuroinflammation": "The choroid plexus (ChP) is a vital brain barrier and source of cerebrospinal fluid (CSF). Here, we use longitudinal two-photon imaging in awake mice and single-cell transcriptomics to elucidate the mechanisms of ChP regulation of brain inflammation. We used intracerebroventricular injections of lipopolysaccharides (LPS) to model meningitis in mice and observed that neutrophils and monocytes accumulated in the ChP stroma and surged across the epithelial barrier into the CSF. Bi-directional recruitment of monocytes from the periphery and, unexpectedly, macrophages from the CSF to the ChP helped eliminate neutrophils and repair the barrier. Transcriptomic analyses detailed the molecular steps accompanying this process and revealed that ChP epithelial cells transiently specialize to nurture immune cells, coordinating their recruitment, survival, and differentiation as well as regulation of the tight junctions that control the permeability of the ChP brain barrier. Collectively, we provide a mechanistic understanding and a comprehensive roadmap of neuroinflammation at the ChP brain barrier.", 
    "Hippocampal place fields maintain a coherent and flexible map across long timescales": "To provide a substrate for remembering where in space events have occurred, place cells must reliably encode the same positions across long timescales. However, in many cases, place cells exhibit instability by randomly reorganizing their place fields between experiences, challenging this premise. Recent evidence suggests that, in some cases, instability could also arise from coherent rotations of place fields, as well as from random reorganization. To investigate this possibility, we performed in vivo calcium imaging in dorsal hippocampal region CA1 of freely moving mice while they explored two arenas with different geometry and visual cues across 8 days. The two arenas were rotated randomly between sessions and then connected, allowing us to probe how cue rotations, the integration of new information about the environment, and the passage of time concurrently influenced the spatial coherence of place fields. We found that spatially coherent rotations of place-field maps in the same arena predominated, persisting up to 6 days later, and that they frequently rotated in a manner that did not match that of the arena rotation. Furthermore, place-field maps were flexible, as mice frequently employed a similar, coherent configuration of place fields to represent each arena despite their differing geometry and eventual connection. These results highlight the ability of the hippocampus to retain consistent relationships between cells across long timescales and suggest that, in many cases, apparent instability might result from a coherent rotation of place fields.", 
    "Orientation and direction selectivity of synaptic inputs in visual cortical neurons: a diversity of combinations produces spike tuning": "This intracellular study investigates synaptic mechanisms of orientation and direction selectivity in cat area 17. Visually evoked inhibition was analyzed in 88 cells by detecting spike suppression, hyperpolarization, and reduction of trial-to-trial variability of membrane potential. In 25 of these cells, inhibition visibility was enhanced by depolarization and spike inactivation and by direct measurement of synaptic conductances. We conclude that excitatory and inhibitory inputs share the tuning preference of spiking output in 60% of cases, whereas inhibition is tuned to a different orientation in 40% of cases. For this latter type of cells, conductance measurements showed that excitation shared either the preference of the spiking output or that of the inhibition. This diversity of input combinations may reflect inhomogeneities in functional intracortical connectivity regulated by correlation-based activity-dependent processes.", 
    "Distributed plasticity drives visual habituation learning in larval zebrafish": "Habituation is a simple form of learning where animals learn to reduce their responses to repeated innocuous stimuli [1]. Habituation is thought to occur via at least two temporally and molecularly distinct mechanisms, which lead to short-term memories that last for seconds to minutes and long-term memories that last for hours or longer [1, 2]. Here, we focus on long-term habituation, which, due to the extended time course, necessitates stable alterations to circuit properties [2–4]. In its simplest form, long-term habituation could result from a plasticity event at a single point in a circuit, and many studies have focused on identifying the site and underlying mechanism of plasticity [5–10]. However, it is possible that these individual sites are only one of many points in the circuit where plasticity is occurring. Indeed, studies of short-term habituation in C. elegans indicate that in this paradigm, multiple genetically separable mechanisms operate to adapt specific aspects of behavior [11–13]. Here, we use a visual assay in which larval zebrafish habituate their response to sudden reductions in illumination (dark flashes) [14, 15]. Through behavioral analyses, we find that multiple components of the dark-flash response habituate independently of one another using different molecular mechanisms. This is consistent with a modular model in which habituation originates from multiple independent processes, each adapting specific components of behavior. This may allow animals to more specifically or flexibly habituate based on stimulus context or internal states.", 
    "Retinotopic separation of nasal and temporal motion selectivity in the mouse superior colliculus": "Sensory neurons often display an ordered spatial arrangement that enhances the encoding of specific features on different sides of natural borders in the visual field (for example, [1–3]). In central visual areas, one prominent natural border is formed by the confluence of information from the two eyes, the monocular-binocular border [4]. Here, we investigate whether receptive field properties of neurons in the mouse superior colliculus show any systematic organization about the monocular-binocular border. The superior colliculus is a layered midbrain structure that plays a significant role in the orienting responses of the eye, head, and body [5]. Its superficial layers receive direct input from the majority of retinal ganglion cells and are retinotopically organized [6, 7]. Using two-photon calcium imaging, we recorded the activity of collicular neurons from the superficial layers of awake mice and determined their direction selectivity, orientation selectivity, and retinotopic location. This revealed that nearby direction-selective neurons have a strong tendency to prefer the same motion direction. In retinotopic space, the local preference of direction-selective neurons shows a sharp transition in the preference for nasal versus temporal motion at the monocular-binocular border. The maps representing orientation and direction appear to be independent. These results illustrate the important coherence between the spatial organization of inputs and response properties within the visual system and suggest a re-analysis of the receptive field organization within the superior colliculus from an ecological perspective.", 
    "Making sense of real-world scenes": "To interact with the world, we have to make sense of the continuous sensory input conveying information about our environment. A recent surge of studies has investigated the processes enabling scene understanding, using increasingly complex stimuli and sophisticated analyses to highlight the visual features and brain regions involved. However, there are two major challenges to producing a comprehensive framework for scene understanding. First, scene perception is highly dynamic, subserving multiple behavioral goals. Second, a multitude of different visual properties co-occur across scenes and may be correlated or independent. We synthesize the recent literature and argue that for a complete view of scene understanding, it is necessary to account for both differing observer goals and the contribution of diverse scene properties.", 
    "Rethinking retrosplenial cortex: Perspectives and predictions": "The last decade has produced exciting new ideas about retrosplenial cortex (RSC) and its role in integrating diverse inputs. Here, we review the diversity in forms of spatial and directional tuning of RSC activity, temporal organization of RSC activity, and features of RSC interconnectivity with other brain structures. We find that RSC anatomy and dynamics are more consistent with roles in multiple sensorimotor and cognitive processes than with any isolated function. However, two more generalized categories of function may best characterize roles for RSC in complex cognitive processes: (1) shifting and relating perspectives for spatial cognition and (2) prediction and error correction for current sensory states with internal representations of the environment. Both functions likely take advantage of RSC’s capacity to encode conjunctions among sensory, motor, and spatial mapping information streams. Together, these functions provide the scaffold for intelligent actions, such as navigation, perspective taking, interaction with others, and error detection.", 
    "Neural responses in retrosplenial cortex associated with environmental alterations": "The retrosplenial cortex (RSC) is an area interconnected with regions of the brain that display spatial correlates. Neurons in connected regions may encode an animal’s position in the environment and location or proximity to objects or boundaries. RSC has also been shown to be important for spatial memory, such as tracking distance from and between landmarks, contextual information, and orientation within an environment. For these reasons, it is important to determine how neurons in RSC represent cues such as objects or boundaries and their relationship to the environment. In the current work, we performed electrophysiological recordings in RSC, whereas rats foraged in arenas that could contain an object or in which the environment was altered. We report RSC neurons display changes in mean firing rate responding to alterations of the environment. These alterations include the arena rotating, changing size or shape, or an object being introduced into the arena.", 
    "Perisaccadic and attentional remapping of receptive fields in lateral intraparietal area and frontal eye fields": "The nature and function of perisaccadic receptive field (RF) remapping have been controversial. We use a delayed saccade task to reduce previous confounds and examine the remapping time course in the lateral intraparietal area and frontal eye fields. In the delay period, the RF shift direction turns from the initial fixation to the saccade target. In the perisaccadic period, RFs first shift toward the target (convergent remapping), but around the time of saccade onset/offset, the shifts become predominantly toward the post-saccadic RF locations (forward remapping). Thus, unlike forward remapping that depends on the corollary discharge (CD) of the saccade command, convergent remapping appears to follow attention from the initial fixation to the target. We model the data with attention-modulated and CD-gated connections and show that both sets of connections emerge automatically in neural networks trained to update stimulus retinal locations across saccades. Our work thus unifies previous findings into a mechanism for transsaccadic visual stability.", 
    "Rapid methods for the evaluation of fluorescent reporters in tissue clearing and the segmentation of large vascular structures": "Light sheet fluorescence microscopy (LSFM) of large tissue samples does not require mechanical sectioning and allows efficient visualization of spatially complex or rare structures. Therefore, LSFM has become invaluable in developmental and biomedical research. Because sample size may limit whole-mount staining, LSFM benefits from transgenic reporter organisms expressing fluorescent proteins (FPs) and, however, requires optical clearing and computational data visualization and analysis. The former often interferes with FPs, while the latter requires massive computing resources. Here, we describe 3D-polymerized cell dispersions, a rapid and straightforward method, based on recombinant FP expression in freely selectable tester cells, to evaluate and compare fluorescence retention in different tissue-clearing protocols. For the analysis of large LSFM data, which usually requires huge computing resources, we introduce a refined, interactive, hierarchical random walker approach that is capable of efficient segmentation of the vasculature in data sets even on a consumer grade PC.", 
    "Running speed and REM sleep control two distinct modes of rapid interhemispheric communication": "Rhythmic gamma-band communication within and across cortical hemispheres is critical for optimal perception, navigation, and memory. Here, using multisite recordings in both rats and mice, we show that even faster ∼140 Hz rhythms are robustly anti-phase across cortical hemispheres, visually resembling splines, the interlocking teeth on mechanical gears. Splines are strongest in superficial granular retrosplenial cortex, a region important for spatial navigation and memory. Spline-frequency interhemispheric communication becomes more coherent and more precisely anti-phase at faster running speeds. Anti-phase splines also demarcate high-activity frames during REM sleep. While splines and associated neuronal spiking are anti-phase across retrosplenial hemispheres during navigation and REM sleep, gamma-rhythmic interhemispheric communication is precisely in-phase. Gamma and splines occur at distinct points of a theta cycle and thus highlight the ability of interhemispheric cortical communication to rapidly switch between in-phase (gamma) and anti-phase (spline) modes within individual theta cycles during both navigation and REM sleep.", 
    "Refinement of the retinogeniculate synapse by bouton clustering": "Mammalian sensory circuits become refined over development in an activity-dependent manner. Retinal ganglion cell (RGC) axons from each eye first map to their target in the geniculate and then segregate into eye-specific layers by the removal and addition of axon branches. Once segregation is complete, robust functional remodeling continues as the number of afferent inputs to each geniculate neuron decreases from many to a few. It is widely assumed that large-scale axon retraction underlies this later phase of circuit refinement. On the contrary, RGC axons remain stable during functional pruning. Instead, presynaptic boutons grow in size and cluster during this process. Moreover, they exhibit dynamic spatial reorganization in response to sensory experience. Surprisingly, axon complexity decreases only after the completion of the thalamic critical period. Therefore, dynamic bouton redistribution along a broad axon backbone represents an unappreciated form of plasticity underlying developmental wiring and rewiring in the CNS.", 
    
    "An experimental study on feature-based SLAM for multi-legged robots with RGB-D sensors": "Purpose\nThis paper aims to evaluate four different simultaneous localization and mapping (SLAM) systems in the context of localization of multi-legged walking robots equipped with compact RGB-D sensors. This paper identifies problems related to in-motion data acquisition in a legged robot and evaluates the particular building blocks and concepts applied in contemporary SLAM systems against these problems. The SLAM systems are evaluated on two independent experimental set-ups, applying a well-established methodology and performance metrics.\nDesign/methodology/approach\nFour feature-based SLAM architectures are evaluated with respect to their suitability for localization of multi-legged walking robots. The evaluation methodology is based on the computation of the absolute trajectory error (ATE) and relative pose error (RPE), which are performance metrics well-established in the robotics community. Four sequences of RGB-D frames acquired in two independent experiments using two different six-legged walking robots are used in the evaluation process.\nFindings\nThe experiments revealed that the predominant problem characteristics of the legged robots as platforms for SLAM are the abrupt and unpredictable sensor motions, as well as oscillations and vibrations, which corrupt the images captured in-motion. The tested adaptive gait allowed the evaluated SLAM systems to reconstruct proper trajectories. The bundle adjustment-based SLAM systems produced best results, thanks to the use of a map, which enables to establish a large number of constraints for the estimated trajectory.\nResearch limitations/implications\nThe evaluation was performed using indoor mockups of terrain. Experiments in more natural and challenging environments are envisioned as part of future research.\nPractical implications\nThe lack of accurate self-localization methods is considered as one of the most important limitations of walking robots. Thus, the evaluation of the state-of-the-art SLAM methods on legged platforms may be useful for all researchers working on walking robots’ autonomy and their use in various applications, such as search, security, agriculture and mining.\nOriginality/value\nThe main contribution lies in the integration of the state-of-the-art SLAM methods on walking robots and their thorough experimental evaluation using a well-established methodology. Moreover, a SLAM system designed especially for RGB-D sensors and real-world applications is presented in details.",
    "Bio-inspired mobile robot design and autonomous exploration strategy for underground special space": "Purpose\nTo make the robot that have real autonomous ability is always the goal of mobile robot research. For mobile robots, simultaneous localization and mapping (SLAM) research is no longer satisfied with enabling robots to build maps by remote control, more needs will focus on the autonomous exploration of unknown areas, which refer to the low light, complex spatial features and a series of unstructured environment, lick underground special space (dark and multiintersection). This study aims to propose a novel robot structure with mapping and autonomous exploration algorithms. The experiment proves the detection ability of the robot.\nDesign/methodology/approach\nA small bio-inspired mobile robot suitable for underground special space (dark and multiintersection) is designed, and the control system is set up based on STM32 and Jetson Nano. The robot is equipped with double laser sensor and Ackerman chassis structure, which can adapt to the practical requirements of exploration in underground special space. Based on the graph optimization SLAM method, an optimization method for map construction is proposed. The Iterative Closest Point (ICP) algorithm is used to match two frames of laser to recalculate the relative pose of the robot, which improves the sensor utilization rate of the robot in underground space and also increase the synchronous positioning accuracy. Moreover, based on boundary cells and rapidly-exploring random tree (RRT) algorithm, a new Bio-RRT method for robot autonomous exploration is proposed in addition.\nFindings\nAccording to the experimental results, it can be seen that the upgraded SLAM method proposed in this paper achieves better results in map construction. At the same time, the algorithm presents good real-time performance as well as high accuracy and strong maintainability, particularly it can update the map continuously with the passing of time and ensure the positioning accuracy in the process of map updating. The Bio-RRT method fused with the firing excitation mechanism of boundary cells has a more purposeful random tree growth. The number of random tree expansion nodes is less, and the amount of information to be processed is reduced, which leads to the path planning time shorter and the efficiency higher. In addition, the target bias makes the random tree grow directly toward the target point with a certain probability, and the obtained path nodes are basically distributed on or on both sides of the line between the initial point and the target point, which makes the path length shorter and reduces the moving cost of the mobile robot. The final experimental results demonstrate that the proposed upgraded SLAM and Bio-RRT methods can better complete the underground special space exploration task.\nOriginality/value\nBased on the background of robot autonomous exploration in underground special space, a new bio-inspired mobile robot structure with mapping and autonomous exploration algorithm is proposed in this paper. The robot structure is constructed, and the perceptual unit, control unit, driving unit and communication unit are described in detail. The robot can satisfy the practical requirements of exploring the underground dark and multiintersection space. Then, the upgraded graph optimization laser SLAM algorithm and interframe matching optimization method are proposed in this paper. The Bio-RRT independent exploration method is finally proposed, which takes shorter time in equally open space and the search strategy for multiintersection space is more efficient. The experimental results demonstrate that the proposed upgrade SLAM and Bio-RRT methods can better complete the underground space exploration task.",
    "Bioinspired sensors and applications in intelligent robots: a review": "Purpose\nVision, audition, olfactory, tactile and taste are five important senses that human uses to interact with the real world. As facing more and more complex environments, a sensing system is essential for intelligent robots with various types of sensors. To mimic human-like abilities, sensors similar to human perception capabilities are indispensable. However, most research only concentrated on analyzing literature on single-modal sensors and their robotics application.\nDesign/methodology/approach\nThis study presents a systematic review of five bioinspired senses, especially considering a brief introduction of multimodal sensing applications and predicting current trends and future directions of this field, which may have continuous enlightenments.\nFindings\nThis review shows that bioinspired sensors can enable robots to better understand the environment, and multiple sensor combinations can support the robot’s ability to behave intelligently.\nOriginality/value\nThe review starts with a brief survey of the biological sensing mechanisms of the five senses, which are followed by their bioinspired electronic counterparts. Their applications in the robots are then reviewed as another emphasis, covering the main application scopes of localization and navigation, objection identification, dexterous manipulation, compliant interaction and so on. Finally, the trends, difficulties and challenges of this research were discussed to help guide future research on intelligent robot sensors.",

    "Editorial: Multimodal behavior from animals to bio-inspired robots": "Animals exhibit multimodal behavior, which means that they can behave in different motion patterns, such as crawling, running, jumping, hunting, and escaping. Quadrupeds can maintain balance and coordination in challenging terrains. Amphibians can transit on land and in water. Insects can freely fly and crawl. These innate locomotion talents are simple and natural to animals and enable them to survive in nature by efficiently exploiting their body morphology and neural control system. Thus, it is very important to investigate the mechanism and influencing factors of multimodal behavior, especially for the development of dexterous, agile, and stable robots through biologically inspired guidance.\nVarious attempts, including the use of hybrid structure systems, neural control, and embodied intelligence, have been made to mimic such impressive multimodal behaviors for robots, e.g., the turtle robot (Baines et al., 2022), salamander robot (Ijspeert et al., 2007), gecko robot (Shao et al., 2022), quadruped robot (Miki et al., 2022), millipede robot (Homchanthanakul and Manoonpong, 2023), and dung beetle robot (Xiong and Manoonpong, 2021). However, in comparison to their biological counterparts, robots still fail in terms of adaptability, flexibility, and versatility, because multimodal behaviors involve the synthesis of structure, control, planning, and optimization. Although the multimodal concept, previously realized in vehicle engineering and electrical engineering, will greatly improve the agility and intelligence of bio-inspired robots' behavioral control, it also poses new challenges. For example, the muscle tissue and body morphology of an animal are quite different from the actuators of robots, and the animal's neural system is also much more complex than the control system of robots. To bridge the gap between biology and bio-inspired robots, these factors must be taken into account (Manoonpong et al., 2021). Therefore, further research and discussions relating to the multimodal concept of robot behavior still need to be conducted.\nThe goal of this Research Topic is to demonstrate the recent progress in relation to “Multimodal Behavior from Animals to Bio-Inspired Robots,” including the design of the mechanical structure, sensory systems, control strategy, and enhancements between biology and engineering. The topic contains four articles, each addressing the control methods for the multimodal behavior of bionic robots with different structures, including biped and hexapod robots, as well as sensor systems and reinforcement learning methods for multimodal behavior.",
    "Topographica: building and analyzing map-level simulations from Python, C/C++, MATLAB, NEST, or NEURON components": "Many neural regions are arranged into two-dimensional topographic maps, such as the retinotopic maps in mammalian visual cortex. Computational simulations have led to valuable insights about how cortical topography develops and functions, but further progress has been hindered by the lack of appropriate tools. It has been particularly difficult to bridge across levels of detail, because simulators are typically geared to a specific level, while interfacing between simulators has been a major technical challenge. In this paper, we show that the Python-based Topographica simulator makes it straightforward to build systems that cross levels of analysis, as well as providing a common framework for evaluating and comparing models implemented in other simulators. These results rely on the general-purpose abstractions around which Topographica is designed, along with the Python interfaces becoming available for many simulators. In particular, we present a detailed, general-purpose example of how to wrap an external spiking PyNN/NEST simulation as a Topographica component using only a dozen lines of Python code, making it possible to use any of the extensive input presentation, analysis, and plotting tools of Topographica. Additional examples show how to interface easily with models in other types of simulators. Researchers simulating topographic maps externally should consider using Topographica’s analysis tools (such as preference map, receptive field, or tuning curve measurement) to compare results consistently, and for connecting models at different levels. This seamless interoperability will help neuroscientists and computational scientists to work together to understand how neurons in topographic maps organize and operate.",
}
for (const reference of Object.values(references)) {
    if (manualAbstracts[reference.title]) {
        reference.accordingTo.$manuallyEntered.abstract = manualAbstracts[reference.title]
    }
}
await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
Deno.exit()
// 
// link fixer
// 
    // const badLinks = JSON.parse(Deno.readTextFileSync("/Users/jeffhykin/repos/risma/links.json"))
    // let promises = []
    // let fixedCount = 0
    // for (let eachBadLink of badLinks) {
    //     const refWithBadLink = references.find(ref=>ref.link==eachBadLink)
    //     if (refWithBadLink) {
    //         promises.push(((async ()=>{
    //             let fixedTheLink = false
    //             try {
    //                 const fixedLink = await getRedirectedUrl(eachBadLink)
    //                 if (fixedLink) {
    //                     fixedCount++
    //                     console.log(`fixed: ${eachBadLink}`)
    //                     fixedTheLink = true
    //                     refWithBadLink.accordingTo.$manuallyEntered.oldLink = eachBadLink
    //                     refWithBadLink.accordingTo.$manuallyEntered.link = fixedLink
    //                     if (fixedCount % 10 == 0) {
    //                         await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
    //                     }
    //                 }
    //             } catch (error) {
                    
    //             }
    //             if (!fixedTheLink) {
    //                 console.warn(`could not fix link for ${refWithBadLink.title}: ${eachBadLink}`)
    //             }
    //         })()))
    //     }
    // }
    // await Promise.all(promises)
    // await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
    // Deno.exit()


// 
// list all tags
// 
    const allTags = new Set()
    for (const reference of references) {
        reference.notes.keyTags = reference.notes.keyTags || []
        allTags.add(...reference.notes.keyTags.filter(each=>each))
    }
    // console.debug(`allTags is:`,allTags)

// 
// categories
// 

const categories = {
    "qualifiedSystem": new Set(),
    "almostQualifiedSystem": new Set(),
    "surroundingWork": new Set(),
    "noteForQualifiedSystem": new Set(),
    "historicalNeuroscience": new Set(),
    "extraNeuroscience": new Set(),
    "directSupportNeuroscience": new Set(),
    "nonBioSlam": new Set(),
    "similarProblemSurveys": new Set(),
    "tooling": new Set(),
}
const allTitles = new Set()
for (const reference of references) {
    reference.notes.keyTags = reference.notes.keyTags || []
    const title = reference.title.toLowerCase()
    const nickname = reference.notes.nickname
    const isDuplicate = reference.notes.isDuplicate
    if (categories[title.category]) {
        categories[title.category].add(title)
        continue
    }
    if (nickname || isDuplicate) {
        continue
    }
    if (reference.notes.resumeStatus.startsWith("super-relevent")) {
        allTitles.add(title)
    }
    if (title.includes("neuroslam") || title.includes("neoslam") || title.includes("ratslam")) {
        allTitles.add(title)
    }
    if (title.match(/place recognition/i) && (title.includes("neuromorphic")||title.includes("spiking"))) {
        allTitles.add(title)
    }
    if (reference.notes.comment && reference.notes.comment != "") {
        allTitles.add(title)
    }
}
// for (let each of allTitles) {
//     console.debug(`- `,each)
// }

// 
// get abstracts
// 
    import { Reference, search, loadReferences, getReferences } from '../../academic_api/main/main.js'
    import { coerceInsignificantEdgeCases } from '../../academic_api/main/reference.js'
    import { getRedirectedUrl } from '../../academic_api/main/tools/fetch_tools.js'
    import { toRepresentation } from '../../academic_api/main/imports/good.js'
    console.log(`running add_stuff`)
    console.group()
    const processNext = [
        
    ]
    const refsToProcess = []
    for (let each of processNext) {
        try {
            let match = references.find(ref=>ref.title==each)
            if (match) {
                refsToProcess.push(
                    match
                )
            } else {
                let match = references.find(ref=>ref.title.toLowerCase()==each.toLowerCase())
                if (match) {
                    refsToProcess.push(
                        match
                    )
                } else {
                    console.debug(`    no match for:`,each)
                }
            }
        } catch (error) {
            console.debug(`    error is:`,error)
        }
    }
    console.debug(`refsToProcess.length is:`,refsToProcess.length)
    for (let each of refsToProcess) {
        if (!(each.accordingTo instanceof Object)) {
            console.debug(`each is:`,each)
        }
    }
    // convert to newer cleaner format
    let processed = refsToProcess.map(each=>({
        $accordingTo: Object.fromEntries(Object.entries(each.accordingTo).map(
            ([key, value])=>{
                if (key=="crossref") {
                    key="crossRef"
                }
                value = structuredClone(value)
                value.url = value.link
                delete value.link
                value.pdfUrl = value.pdfLink
                delete value.pdfLink
                coerceInsignificantEdgeCases(value)
                const allNulls = Object.values(value).every(each=>!each)
                if (allNulls) {
                    value = null
                } else {
                    value.title = value.title||each.title
                }
                return [key, value]
            }
        )),
    }))
    
    loadReferences(
        processed
    )
    const otherReferences = getReferences()
    
    // import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2"
    import { launch } from "../subrepos/astral.js"
    const astralBrowser = await launch()
    try {
        let resumeAt = null
        for (const reference of refsToProcess) {
            // skip to specific title
            if (resumeAt) {
                if (reference.title==resumeAt) {
                    resumeAt = null
                } else {
                    continue
                }
            }

            // skip if already has abstract
            if (reference.abstract || reference?.link?.startsWith?.("https://books.google.com/")) {
                // console.log(`has abstract already`)
                // console.groupEnd()
                continue
            } else {
                console.log(`reference.title is:`,blue`${JSON.stringify(reference.title)}`)
            }
            console.group()
            
            let otherRef
            // unify by doi
            if (typeof reference.doi == "string") {
                try {
                    otherRef = otherReferences.find(each=>each.doi==reference.doi)
                } catch (error) {
                    
                }
            }
            // fallback unify by title
            if (!otherRef && typeof reference.title == "string") {
                try {
                    otherRef = otherReferences.find(each=>each.title==reference.title)
                } catch (error) {
                    
                }
            }
            // 
            // get abstract
            // 
            if (otherRef && !reference.abstract) {
                // 
                // get redirected doi value
                // 
                for (const [source, value] of Object.entries(otherRef.$accordingTo)) {
                    if ((value?.url||"").startsWith("https://www.doi.org/")) {
                        const newUrl = await getRedirectedUrl(value.url)
                        if (typeof newUrl =="string" && !newUrl.startsWith("https://validate.perfdrive.com")) {
                            value.url = newUrl
                        }
                    }
                }
                // for (const [source, value] of Object.entries(reference.accordingTo)) {
                //     if ((value?.link||"").startsWith("https://www.doi.org/")) {
                //         const newUrl = await getRedirectedUrl(value.link)
                //         if (typeof newUrl =="string" && !newUrl.startsWith("https://validate.perfdrive.com")) {
                //             value.link = newUrl
                //         }
                //     }
                // }

                try {
                    const { abstracts, warnings } = await otherRef.fillAbstractsFromHtml({astralBrowser})
                    console.debug(`abstracts is:`,JSON.stringify(abstracts))
                    const hadAbstract = abstracts.length >= 1
                    if (hadAbstract) {
                        // save it on old object
                        reference.accordingTo.$manuallyEntered.abstract = abstracts[0]
                    }
                    const hadWarnings = (Object.values(warnings||{}).length > 0)
                    if (hadWarnings) {
                        console.warn(`warnings:`)
                        console.warn(warnings)
                        try {
                            reference.accordingTo.$manuallyEntered.warnings = JSON.parse(JSON.stringify(warnings,0,4))
                        } catch (error) {
                            console.error(error)
                        }
                    } else {
                        delete reference.accordingTo.$manuallyEntered.warnings
                    }
                    if (hadWarnings || hadAbstract) {
                        await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
                    }
                    try {
                        if (Object.values(warnings||{}).length > 0) {
                            console.warn(`warnings:`)
                        }
                        for (const [key, warningMessage] of Object.entries(warnings||{})) {
                            let message
                            try {
                                message = warningMessage.stack
                            } catch (error) {
                                
                            }
                            if (!message) {
                                message = warningMessage
                            }
                            console.log(`     warning ${key}:`, yellow`${indent({string: toRepresentation(warningMessage), by: "    "})}`)
                        }
                    } catch (error) {
                        console.warn(`error is:`,error)
                    }
                } catch (error) {
                    console.warn(`error is:`,error)
                }
            }
            console.groupEnd()
        }
    } finally {
        astralBrowser.close()
    }

// 
// auto tags
// 
    
    // for (const [key, reference] of Object.entries(references)) {
    //     reference.notes.keyTags = reference.notes.keyTags || []
        
    //     const title = reference.title.toLowerCase()
    //     const primaryBioRelated = !!title.match(/\bneuro|\bbio|\bhippocamp|\bbrain|\bhebbia|drosophila|visual(-| )cortex|ring(-| )attractor|continuous(-| )attractor|\bMD-CAN\b|head(-| )direction(-| )cell|grid(-| )cell|place(-| )cell|synaptic|\bmice\b|\brat|\bbee\b|mushroom(-| )bod|insect/i)
    //     const secondairlyBioRelated = !!title.match(/neuromorph|\bloihi|\bspiking neural network|hierarchical temporal memory|sparse distributed representation/i)
    //     const isSolvingAReleventProblem = !!title.match(/place(-| )recognition|localization|slam\b|pose(-| )estimation|navigation|landmark(-| )stability/i)
    //     const secondairlyReleventProblem = !!title.match(/sensori(-| |)motor(-| )control|\bpercept|scene(-| )understanding|proprioception|holistic(-| )scene|object(-| )detection|object(-| )tracking|locomotion/i)
    //     const usedReleventHardwareOfSomeKind = !!title.match(/robot|clearpath|unitree|\bloihi|event(-| )camera|stereo(-| )cameras|stereo(-| )vision|stereoscopic(-| )vision|jetson|\bugv\b|legged|quadruped|humanoid(-| )robot/i)
    //     const usedRelevantSoftwareOfSomeKind = !!title.match(/simulat|neuroSLAM|ratSLAM|neoSLAM|emulat|BINDSnet|\bros\b|ros2|bullet|python|pytorch|tensorflow|spiking neural network|\bsnn\b|c\+\+/i)
        
    //     // 
    //     // Biologically Based
    //     // 
    //     if (primaryBioRelated) {
    //         reference.notes.keyTags.push("biologicallyBased1")
    //         reference.notes.keyTags.push("biologicallyBased2")
    //     } else if (secondairlyBioRelated) {
    //         reference.notes.keyTags.push("biologicallyBased2")
    //     }
        
    //     // 
    //     // relevant task
    //     // 
    //     if (isSolvingAReleventProblem) {
    //         reference.notes.keyTags.push("relevantTask1")
    //         reference.notes.keyTags.push("relevantTask2")
    //     } else if (secondairlyReleventProblem) {
    //         reference.notes.keyTags.push("relevantTask2")
    //     }
        
    //     // 
    //     // tangible
    //     // 
    //     if (usedReleventHardwareOfSomeKind && usedRelevantSoftwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible1")
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleHardware")
    //         reference.notes.keyTags.push("tangibleSoftware")
    //     } else if (usedReleventHardwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleHardware")
    //     } else if (usedRelevantSoftwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleSoftware")
    //     }
    // }


// main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})