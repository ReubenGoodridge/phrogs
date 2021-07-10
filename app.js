import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0x6a994e)

var mixer
var clock = new THREE.Clock()

// Load Phrog Model
const basePhrog = new GLTFLoader()
var obj
basePhrog.load('assets/models/Phrogs/base phrog/phrog.gltf', function (gltf) {
  mixer = new THREE.AnimationMixer(gltf.scene)
  obj = gltf.scene
  var action = mixer.clipAction(gltf.animations[0])
  scene.add(gltf.scene)
  action.play()
})

const stonePhrog = new GLTFLoader()
var stonePhrogMixer
var stonePhrogObj
stonePhrog.load('assets/models/Phrogs/stone phrog/stone-phrog.glb', function (gltf) {
  stonePhrogMixer = new THREE.AnimationMixer(gltf.scene)
  stonePhrogObj = gltf.scene
  var action = stonePhrogMixer.clipAction(gltf.animations[0])
  scene.add(gltf.scene)
  stonePhrogObj.position.x -= 5
  action.play()
})

const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(5, 5, 5)
controls.update()

function animate () {
  requestAnimationFrame(animate)
  var delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  if (stonePhrogMixer) stonePhrogMixer.update(delta)
  renderer.render(scene, camera)
}
animate()
