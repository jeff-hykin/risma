Many researchers have improved different aspects of the RatSLAM algorithm, 
yet the improved methods are not very flexible in scenes with lighting changes.

Sun, C et al. 
    To solve the loop-closure problem, used a fast and accurate descriptor called ORB (oriented fast and rotated brief) as the feature matching method [10]. 

Kazmi et al.
    Accordingly, used the Gist descriptor as the feature matching method, which can also reduce the matching error in traditional RatSLAM [11]. Using a descriptor of features can help increase the precision of loop-closure detection by improving the accuracy of feature matching.

Tian et al [13]
    proposed an RGB-D-based RatSLAM system

Tubman et al. [12]
    To compensate for the odometer error, added a grid map into the system to describe environmental features with a 3D structure similar to Tian.
    The results showed that both methods could solve the problem of missed feature points caused by white walls. 

Salman et al.
    integrated a whisker sensor that can move along three axes into the system to form a Whisker-RatSLAM [14].
    Their preprocessed tactile method and control scheme can reduce the error of a robot’s pose estimation to a certain extent.

Milford et al.
    used multiple cameras instead of a single monocular camera in the visual odometer [15].
    The combination of data from multiple cameras provided more-accurate 3D motion information, thus substantially promoting map quality.
    
Silveira et al
    From the aspect of bionics, extended the original RatSLAM system from a 2D ground vehicle model to an underwater environment with a 3D model.
    The system they created is a dolphin SLAM based on mammalian navigation [16].

Ball et al
    Using a mouse-sized robotic platform as an experimental vehicle, changed the significance of visual cues and the effectiveness of different visual filtering techniques [17,18].
    In their improvement, the vision sensor’s field of vision was narrower and closer to the ground, which avoided the effect of visual angle on the formation and use of cognitive maps.


Chong Wu
    Added HSL to RatSLAM in "An Environmental-Adaptability-Improved RatSLAM Method Based on a Biological Vision Model"
