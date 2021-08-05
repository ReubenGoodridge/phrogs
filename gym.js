import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js'

// Setup Scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0x5da9e9)
var mixer
var clock = new THREE.Clock()
const light = new THREE.HemisphereLight(0xdee2e6, 0x6c757d, 2)
scene.add(light)

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(-0.7459779635844269, 7.1697673169203275, 18.476521551573796)
controls.update()

// Load Phrog Models
var phrogPos = new THREE.Vector3()
const basePhrog = new GLTFLoader()
let phrog
basePhrog.load('assets/models/Phrogs/base phrog/phrog.gltf', function (gltf) {
  mixer = new THREE.AnimationMixer(gltf.scene)
  phrog = gltf.scene
  phrog.position.x = 0
  phrog.position.y = 0
  phrog.position.z = 0
  phrogPos.x = phrog.position.x
  phrogPos.z = phrog.position.z
  scene.add(phrog)
  var action = mixer.clipAction(gltf.animations[0])
  action.loop = THREE.LoopOnce
})

// Add Dumbell
var dumbellLoad = new GLTFLoader()
let dumbell
let dumbellMixer
let strength = 0
dumbellLoad.load('assets/models/Equipment/dumbell/dumbell.glb', function (gltf) {
  dumbell = gltf.scene
  dumbell.position.z += 1.5
  dumbell.position.y += 0.5
  scene.add(dumbell)
  dumbellMixer = new THREE.AnimationMixer(gltf.scene)
  var dumbellAnimation = dumbellMixer.clipAction(gltf.animations[0])
  dumbellAnimation.loop = THREE.LoopOnce
  window.onkeydown = function (gfg) {
    if (gfg.keyCode === 32) {
      if (strength <= 99) {
        dumbellAnimation.play()
        dumbellAnimation.reset()
        strength += 1
        localStorage.setItem('strength', strength)
        document.getElementById('strengthText').innerHTML = `Your phrog's strength is: ${strength}`
      } else { alert("Your phrog has reached it's maximum strength") }
    }
  }
})

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animate loop
function animate () {
  requestAnimationFrame(animate)
  var delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  if (dumbellMixer) dumbellMixer.update(delta)
  renderer.render(scene, camera)
}
animate()
