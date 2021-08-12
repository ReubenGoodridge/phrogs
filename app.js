import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'
var strength = localStorage.getItem('strength')

// Detecting if page is visible
let visible
window.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    visible = true
  } else {
    visible = false
  }
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0x6a994e)

var mixer
var clock = new THREE.Clock()

// Create random move points
var mPoints = []
var geometry = new THREE.DodecahedronGeometry(0.5)
for (var i = 0; i < 20; i++) {
  var mPoint = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xadb5bd }))
  mPoint.position.x = Math.random() * 50 - 25
  mPoint.position.z = Math.random() * 40 - 20
  mPoints.push(mPoint)
}

for (var l = 0; l < 6; l++) {
  scene.add(mPoints[Math.floor(Math.random() * mPoints.length)])
}

// Choose starting point for phrog
var startPoint = mPoints[Math.floor(Math.random() * mPoints.length)]

// Load Phrog Models
var phrogPos = new THREE.Vector3()
const basePhrog = new GLTFLoader()
let phrog
basePhrog.load('assets/models/Phrogs/base phrog/phrog.gltf', function (gltf) {
  mixer = new THREE.AnimationMixer(gltf.scene)
  phrog = gltf.scene
  phrog.position.x = startPoint.position.x
  phrog.position.z = startPoint.position.z
  phrogPos.x = phrog.position.x
  phrogPos.z = phrog.position.z
  scene.add(phrog)
  var action = mixer.clipAction(gltf.animations[0])
  action.loop = THREE.LoopOnce

  // Play animation randomly every 1-10s.
  setInterval(() => {
    action
      .reset()
      .play()
  }, Math.random() * 9000 + 1000)
})

// Add Food
const foodGeometry = new THREE.SphereGeometry()
const foodColour = new THREE.MeshBasicMaterial({ color: 0xddbea9 })
const food = new THREE.Mesh(foodGeometry, foodColour)

// Pick random point for food
var foodPoint = new THREE.Vector3()
document.getElementById('food').onclick = feed
let fed = false
let feeding = false
function feed () {
  if (!fed && !feeding) {
    feeding = true
    phrogPos.x = phrog.position.x
    phrogPos.y = phrog.position.y
    phrogPos.z = phrog.position.z
    let foodPos = mPoints[Math.floor(Math.random() * mPoints.length)]
    if (foodPos === phrogPos) {
      foodPos = mPoints[Math.floor(Math.random() * mPoints.length)]
      foodPoint.x = foodPos.position.x
      foodPoint.z = foodPos.position.z
      console.log('Food at phrog position, moved somewhere new')
    }
    foodPoint.x = foodPos.position.x
    foodPoint.z = foodPos.position.z
    food.position.x = foodPoint.x
    food.position.z = foodPoint.z
    scene.add(food)
    // Calculate Midpoint between Phrog and Food
    const midX = (phrogPos.x + foodPoint.x) / 2
    const midZ = (phrogPos.z + foodPoint.z) / 2
    const Midpoint = new THREE.Vector3()
    Midpoint.x = midX
    Midpoint.z = midZ
    strength = localStorage.getItem('strength')
    console.log(strength)
    if (strength === 0) {
      Midpoint.y = 0.5
    } else {
      Midpoint.y = 10 + (strength / 2)
    }
    // Create a tween to move to the food
    var position = { x: phrogPos.x, y: phrogPos.y, z: phrogPos.z }
    var destination = { x: foodPoint.x, z: foodPoint.z, y: foodPoint.y }
    // Move to the Midpoint
    var tween = new TWEEN.Tween(position).to(Midpoint, 2000)
    tween.easing(TWEEN.Easing.Cubic.Out)
    tween.onUpdate(function () {
      phrog.position.x = position.x
      phrog.position.z = position.z
      phrog.position.y = position.y
    })
    tween.onComplete(function () {
      phrogPos.x = phrog.position.x
      phrogPos.y = phrog.position.y
      phrogPos.z = phrog.position.z
    })
    tween.start()
    // Move to destination
    var tweenA = new TWEEN.Tween(Midpoint).to(destination, 2000)
    tweenA.easing(TWEEN.Easing.Cubic.Out)
    tweenA.onUpdate(function () {
      phrogPos.x = phrog.position.x
      phrogPos.y = phrog.position.y
      phrogPos.z = phrog.position.z
      phrog.position.x = position.x
      phrog.position.z = position.z
      phrog.position.y = position.y
    })
    tweenA.onComplete(function () {
      scene.remove(food)
      feeding = false
    })
    tweenA.start()
    tween.chain(tweenA)
    // fed = true
  } else {
    window.alert('Your phrog is already fed!')
  }
}

const light = new THREE.HemisphereLight(0xa3b18a, 0x3a5a40, 2)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(-1.71353716464, 12.1635872984, 30.5571151839)
controls.update()

function animate () {
  requestAnimationFrame(animate)
  TWEEN.update()
  var delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}
animate()
