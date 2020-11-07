"use strict"

var scene

/* callback functions can be registered here
   They will be executed in each render loop */
var updateFuncs = []

function log(fn) {
    return function() {
        console.log(`${fn.name} called`)
        return fn.apply(arguments)
    }
}

function init() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0x000000, 1.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xd1011)

    const clock = new THREE.Clock()

    const stats = new Stats()
    stats.showPanel( 1 ) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom )
   
    const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1, 1000)
    camera.position.x = 40
    camera.position.y = 40
    camera.position.z = 170
    camera.lookAt(scene.position)
    const control = new THREE.OrbitControls(camera, renderer.domElement)
    window.addEventListener( 'resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize( window.innerWidth, window.innerHeight )
    }, false)

    createLight()
    ground()
    loadModel()
    volleyBall()
    discoBall()
    marsBall()
    loadVideo()
    particle()

    function render() {
        stats.begin()
        renderer.render( scene, camera )
        stats.end()
        const delta = clock.getDelta()
        const t = clock.getElapsedTime()
        updateFuncs.forEach(fnc => fnc(delta, t))
        requestAnimationFrame( render )
    }
    render()
}
init = log(init)

function createLight() {
    
    const ambientLight = new THREE.AmbientLight( 0x111111 )
    scene.add(ambientLight)
    
    const spotLight = new THREE.SpotLight( 0x7F00FF )
    spotLight.position.set(-15, 40, 10)
    spotLight.shadow.camera.near = 20
    spotLight.shadow.camera.far = 50
    spotLight.castShadow = true
    scene.add(spotLight)

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 )
    hemiLight.position.set( 0, 20, 0 )
    scene.add( hemiLight )
    
    const dirLight = new THREE.DirectionalLight( 0x00FF7F )
    dirLight.castShadow = true
    dirLight.position.set( - 15, 20, -20 )
    dirLight.shadow.camera.top = 2
    dirLight.shadow.camera.bottom = - 2
    dirLight.shadow.camera.left = - 2
    dirLight.shadow.camera.right = 2
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 40
    scene.add( dirLight ) 
    
}
createLight = log(createLight)

function ground() {
   
    const grid = new THREE.GridHelper( 200, 40, 0xeae4e9, 0xeae4e9 )
    grid.material.opacity = 0.2
    grid.material.transparent = true
    grid.receiveShadow = true
    scene.add( grid )
    
}
ground = log(ground)

function loadModel() {

    const loader = new THREE.ColladaLoader()

    loader.load('../assets/Quad/quad.dae', function(collada) {
        console.log(`loading ../assets/Quad/quad.dae`)
        scene.add(collada.scene)
    })
   

    const models = [{
            path: '../assets/Dankdog/dankdog_d1.dae',
            position: [15, 0, 18],
            scale: 12
        },{
            path: '../assets/Starfighter/starfighter_d1.dae',
            position: [-40, 0, 40],
            scale: 15
        },{
            path: '../assets/Sponge/spongeybud_d1.dae',
            position: [5, 0, 70],
            scale: 13
        },{
            path: '../assets/Nudepatty/nudepatty_d3.dae',
            position: [45, 0, 50],
            scale: 2
        }
    ]

    models.forEach(function(x){
        loader.load(x.path, function(collada) {
            console.log(`loading ${x.path}`)
            const obj = collada.scene
            obj.position.set( ... x.position)
            obj.scale.set(x.scale,x.scale,x.scale)
            obj.traverse(function(child) {
                child.castShadow = true;
                child.receiveShadow = true;
            })
            const mixer = new THREE.AnimationMixer(obj)
            const animations = collada.animations
            mixer.clipAction(animations[0]).play()
            updateFuncs.push(function(delta){
                mixer.update(delta)
            })
            scene.add(obj)   
        })
    })
}
loadModel = log(loadModel)

function volleyBall(){
    const material = new THREE.ShaderMaterial({
        uniforms: {
            colour_dark : {type: "v4", value: new THREE.Vector4(0.0, 0.0, 1.0, 1.0)},
            temp: {type: "f", value: 1.0}
        },
        vertexShader: document.getElementById("vs0").textContent,
        fragmentShader: document.getElementById("fs0").textContent
    })

    const mesh = new THREE.Mesh(new THREE.SphereGeometry( 5, 20, 20 ), material)
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.position.set(60,5,60)
    scene.add(mesh)

    updateFuncs.push(function(delta) {
        mesh.rotation.x += 0.5 * delta
        mesh.rotation.y += 1 * delta
    })
}
volleyBall = log(volleyBall)

function discoBall(){
    const ballTexture = (new THREE.TextureLoader()).load('../images/disco.jpg')
    const customUniforms = {
		baseTexture: { type: "t", value: ballTexture },
		mixAmount: 	 { type: "f", value: 0.0 }
	}

    const material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: document.getElementById("vs1").textContent,
        fragmentShader: document.getElementById("fs1").textContent
    })

    const mesh = new THREE.Mesh(new THREE.SphereGeometry( 15, 25, 45 ), material)
    mesh.position.set(60,40,10)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    updateFuncs.push(function(_,t){
        customUniforms.mixAmount.value = 0.5 * (1.0 + Math.sin(t))
    })
}
discoBall = log(discoBall)

function marsBall(){
    const noiseTexture = (new THREE.TextureLoader()).load( '../images/cloud.png' )
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping 
		
	const lavaTexture = (new THREE.TextureLoader()).load( '../images/lava.jpg' )
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping 
    
    const customUniforms = {
		baseTexture: 	{ type: "t", value: lavaTexture },
		baseSpeed: 		{ type: "f", value: 0.05 },
		noiseTexture: 	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: 0.5337 },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 }
	}

    const material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: document.getElementById("vs2").textContent,
        fragmentShader: document.getElementById("fs2").textContent
    })

    const mesh = new THREE.Mesh(new THREE.SphereGeometry( 15, 15, 50 ), material)
    mesh.position.set(-55,40,10)
    mesh.receiveShadow = true
    mesh.castShadow = true
    scene.add(mesh)

    updateFuncs.push(function(delta){
        customUniforms.time.value += delta
    })
}
marsBall = log(marsBall)

function loadVideo() {
    
    const video = document.createElement('video')
    video.src = "../videos/Shape.mp4"
    video.load()
	
	const videoImage = document.createElement( 'canvas' )
	videoImage.width = 480
	videoImage.height = 204

	const videoImageContext = videoImage.getContext( '2d' )
	// background color if no video present
	videoImageContext.fillStyle = '#000000'
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height )

	const videoTexture = new THREE.Texture( videoImage )
	videoTexture.minFilter = THREE.LinearFilter
	videoTexture.magFilter = THREE.LinearFilter
	
	const movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, side:THREE.DoubleSide } )
	// the geometry on which the movie will be displayed
	// movie image will be scaled to fit these dimensions.
	const movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4)
	const movieScreen = new THREE.Mesh( movieGeometry, movieMaterial )
	movieScreen.position.set(-10,50,-80)
    scene.add(movieScreen)
    const keyboard = new THREEx.KeyboardState()
    updateFuncs.push(function(){
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
        {
            videoImageContext.drawImage( video, 0, 0 )
            if ( videoTexture ) 
                videoTexture.needsUpdate = true
        }
        if ( keyboard.pressed("p") ) // play the video
            video.play()
            
        if ( keyboard.pressed("space") ) // pause the video
            video.pause()
    
        if ( keyboard.pressed("s") ) // stop the video
        {
            video.pause()
            video.currentTime = 0
        }
        
        if ( keyboard.pressed("r") ) // rewind the video
            video.currentTime = 0
    })
    
}
loadVideo = log(loadVideo)

function particle() {
    const particleCount = 1500
    const particles = new THREE.Geometry()
    const pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 10,
        map: (new THREE.TextureLoader()).load("../images/particle.png"),
        blending: THREE.AdditiveBlending,
        transparent: true
    })

    function random(min, max){
        return Math.random() * (max - min) + min
    }

    for(let p = 0; p < particleCount; p++) {
        const particle = new THREE.Vector3(
            random(-250, 250), 
            random(-250, 250), 
            random(-250, 250)
        )
        particle.velocity = new THREE.Vector3(0. -Math.random(), 0)
        particles.vertices.push(particle)
    }

    const particleSystem = new THREE.Points(particles, pMaterial)

    particleSystem.sortParticles = true

    scene.add(particleSystem)
    updateFuncs.push(function(delta) {
		particleSystem.rotation.y += 0.01 * delta*10
        particles.vertices.forEach(function(p){
            if(p.y< -200){
                p.y = 200
                p.velocity.y = 0
            }
            p.velocity.y -= Math.random() * 0.1
            p.add(p.velocity.multiplyScalar(delta*10))
        })
		
		// flag to the particle system that we have 
		// changed its vertices.
		particleSystem.geometry.__dirtyVertices = true
    })
}
particle = log(particle)

document.body.onload = init
