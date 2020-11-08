3D Disco Party
==============
Due to the recent lockdown, going to the Disco is no longer possible. Therefore, 3D Disco Party will bring the party to your browser at home using Three.js library.  
https://jiaying.zhangfr.gitlab.io/disco-party/Assign/index.html

Model Import
------------
A range of 3D models in the collada format have been included into the scene. Alongside the animated characters dancing, a model of the UCC Campus is also included.

Animation
--------
All characters are animated to perform a dance to the music. The animation is encapsulated in the collada data format. Using the Three.AnimationMixer, animation is as simple as calling the update function in the render step. 

Lighting
---------
Several different light sources illuminate the dance floor. Lighting is of upmost importance when creating an atmosphere suitable for a disco. A colorful spotlight is used to highlight the main character of the scene.

Custom Shaders
--------------
Custom Shaders are applied to three objects in the scene for special effects. The "marsball" has the appearance of a lava-like surface. The "discoball" grows and shrinks over time. The "volleyball" has different surface colors without texture map and rotates to highlight this achievement. 

Particle System
---------------
Nothing makes a disco more complete than light spots rotating around the dance scene. This is achieved by using built-in ParticleSystem. 1500 light spots are are randomly placed on the scene, registered as particles and rotated around the dance floor. 

Video Texture
-------------
In order to dance our characters need an adequate song. The music video for "Shape Of You" is added on a large screen on the backside of the dance floor. The video can be controlled by the keyboard inputs:
* 'p' for play
* ' ' for pause
* 's' for stop
* 'r' for rewind

Unfortunately autoplay does no longer work in modern web browsers. The user is therefore requested to take the place of the DJ and start the music.

Stats
-----
Statistics about the performance of the 3D application are shown on the left-top part of the screen.

Code Quality
------------
Several steps were taken to not only make the resulting video but also the code beautiful. Concepts from functional programming were used for that end.

### Separate Data from Functionality
An expanded loader for the collada models was written that does not only load the model, but also takes care of registering animation callbacks and shadows. The only thing that loader expects is an url to the model and a position and scaling in the final scene. Therefore it was possible to configure the whole scene in a simple array.

### Callback Registry
A lot of objects require an initialization at the beginning and and update in every rendering cycle. This usually implies that a lot of variables need to have global scope. This issue can be solved by registering a callback function that will later get executed in the rendering cycle. The callback function is created as a closure inside the objects initialization routine. It can therefore access all the variables from the initialization function directly and there is no need for global variables.

### Decorators
Decorators are higher-level functions. Their input and output is not data but functions. They take a basic function as an input and wrap it, the composite is then returned as an output. This allows the user to easily add side-effects like log-printouts to all functions in his codebase. A decorator are used here for logging function calls to the console.


Attributions
------------
* UCC Quad : https://3dwarehouse.sketchup.com/model/6462d7654febede2b26f9a938223dcc5/The-Main-Quad-University-College-Cork?hl=en
* Dankdog Model : https://dddance.party/?ref=three
* Nudepatty Model: https://dddance.party/?ref=three
* Sponge Model: https://dddance.party/?ref=three
* Starfighter Model: https://dddance.party/?ref=three
* Shape.mp4 Video: https://www.youtube.com/watch?v=JGwWNGJdvx8



Author
------------
JIAYING ZHANG



