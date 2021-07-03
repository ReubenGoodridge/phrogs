import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const loader = new GLTFLoader()
var obj
loader.load('phrog.gltf', function (gltf) {
  obj = gltf.scene
  scene.add(gltf.scene)
})

const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 5, 5)
controls.update()

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
