import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'


// Detecting if page is visible
let visible
window.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    visible = true
  } else {
    visible = false
  }
})

// Get mouse position
let mouseX
let mouseY
window.addEventListener('mousemove', function (e) {
  mouseX = e.x
  mouseY = e.y
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
var mPointGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
for (var i = 0; i < 20; i++) {
  var mPoint = new THREE.Mesh(mPointGeometry, new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }))
  mPoint.position.x = Math.random() * 100 - 50
  mPoint.position.z = Math.random() * 80 - 40
  mPoints.push(mPoint)
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
function feed () {
  if (!fed) {
    let foodPos = mPoints[Math.floor(Math.random() * mPoints.length)]
    if (foodPos === phrogPos) {
      foodPos = mPoints[Math.floor(Math.random() * mPoints.length)]
    }
    foodPoint.x = foodPos.position.x
    foodPoint.z = foodPos.position.z
    food.position.x = foodPoint.x
    food.position.z = foodPoint.z
    scene.add(food)
    fed = true
  } else {
    window.alert('Your phrog is already fed!')
  }
}

// Create a simple movement function
function move (destination) {
  if (destination.x > phrogPos.x) {
    phrogPos.x += 0.1
    phrog.position.x += 0.1
  }
  if (destination.x < phrogPos.x) {
    phrogPos.x -= 0.1
    phrog.position.x -= 0.1
  }
  if (destination.z < phrogPos.z) {
    phrogPos.z -= 0.1
    phrog.position.z -= 0.1
  }
  if (destination.z > phrogPos.z) {
    phrogPos.z += 0.1
    phrog.position.z += 0.1
  }
}

const light = new THREE.HemisphereLight(0xa3b18a, 0x3a5a40, 2)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(-2.427074329283623, 23.32717459671259, 70.114230367885504)
controls.update()

function animate () {
  requestAnimationFrame(animate)
  var delta = clock.getDelta()
  if (fed && phrogPos !== foodPoint) {
    move(foodPoint)
  }
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}
animate()
