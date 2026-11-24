import * as THREE from './vendor/three.module.js';

const WIDTH = 5.65;
const HEIGHT = 3.05;
const LEFT = -WIDTH / 2;
const RIGHT = WIDTH / 2;
const TOP = HEIGHT / 2;
const BOTTOM = -HEIGHT / 2;
const OPEN_DURATION = 3.2;
const OPEN_MILLISECONDS = 850;

function canvasTexture(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGrain() {
  return canvasTexture(256, 256, (context, width, height) => {
    const data = context.createImageData(width, height);
    let seed = 79;
    for (let i = 0; i < data.data.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const shade = 240 - (seed >>> 27);
      data.data.set([shade, shade, shade, 255], i);
    }
    context.putImageData(data, 0, 0);
  });
}

function paperMaterial(color, grain) {
  return new THREE.MeshStandardMaterial({
    color, map: grain, bumpMap: grain, bumpScale: .013, roughness: .84, side: THREE.DoubleSide,
  });
}

function panel(vertices, material, depth) {
  const shape = new THREE.Shape();
  shape.moveTo(...vertices[0]);
  for (const [x, y] of vertices.slice(1)) shape.lineTo(x, y);
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  const uv = geometry.attributes.uv;
  for (let index = 0; index < uv.count; index++) {
    uv.setXY(index, (uv.getX(index) - LEFT) / WIDTH, (uv.getY(index) - BOTTOM) / HEIGHT);
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = depth;
  return mesh;
}

function edges(points, depth, color) {
  const vertices = points.map(([x, y]) => new THREE.Vector3(x, y, depth));
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices), new THREE.LineBasicMaterial({ color }));
}

function invitationTexture({ names, date }) {
  return canvasTexture(1200, 740, (context, width, height) => {
    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#fffbee');
    background.addColorStop(1, '#f0dfbd');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = '#a98648';
    for (const inset of [25, 38]) {
      context.lineWidth = inset === 25 ? 3 : 1;
      context.strokeRect(inset, inset, width - 2 * inset, height - 2 * inset);
    }
    context.textAlign = 'center';
    context.fillStyle = '#8b6738';
    context.font = '32px Georgia';
    context.fillText('◆', width / 2, 116);
    context.font = '24px Georgia';
    context.fillText('WEDDING INVITATION', width / 2, 182);
    context.fillStyle = '#234632';
    context.font = '105px "Great Vibes", Georgia';
    context.fillText(names, width / 2, 335, 1020);
    context.font = '29px Georgia';
    context.fillText(date, width / 2, 430);
  });
}

function makeSeal(monogramText) {
  const seal = new THREE.Group();
  const wax = new THREE.MeshStandardMaterial({ color: 0xc18d4d, metalness: .4, roughness: .39 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xe8bb6f, metalness: .48, roughness: .35 });
  const puck = new THREE.Mesh(new THREE.CylinderGeometry(.407, .424, .10, 72), wax);
  puck.rotation.x = Math.PI / 2;
  seal.add(puck);
  for (const [radius, thickness] of [[.344, .023], [.3, .009]]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 10, 72), brass);
    rim.position.z = .063;
    seal.add(rim);
  }
  const stamp = canvasTexture(270, 270, (context) => {
    context.textAlign = 'center';
    context.fillStyle = '#52351c';
    context.font = 'italic 87px Georgia';
    context.fillText(monogramText, 135, 166);
  });
  const monogram = new THREE.Mesh(new THREE.PlaneGeometry(.64, .64), new THREE.MeshBasicMaterial({
    map: stamp, transparent: true, depthWrite: false,
  }));
  monogram.position.z = .064;
  seal.add(monogram);
  return seal;
}

const clamp = value => Math.max(0, Math.min(1, value));
function ease(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

export function createEnvelope(stage, wording) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  camera.position.set(0, .39, 12);
  camera.lookAt(0, .39, 0);
  scene.add(new THREE.HemisphereLight(0xffefce, 0x3b5248, 2.2));
  const key = new THREE.DirectionalLight(0xffdc9f, 2.4);
  key.position.set(-4, 5, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb8e8d6, .9);
  fill.position.set(5, 1, 4);
  scene.add(fill);

  const envelope = new THREE.Group();
  scene.add(envelope);
  const grain = createGrain();
  const back = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, .13), paperMaterial(0x204633, grain));
  envelope.add(back);

  const cardFace = new THREE.MeshBasicMaterial({ map: invitationTexture(wording), toneMapped: false });
  const cardEdge = new THREE.MeshBasicMaterial({ color: 0xc9ae78 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(5.06, 2.84, .04),
    [cardEdge, cardEdge, cardEdge, cardEdge, cardFace, cardEdge]);
  envelope.add(card);
  let disposed = false;
  document.fonts.load('105px "Great Vibes"').then(() => {
    if (disposed) return;
    cardFace.map.dispose();
    cardFace.map = invitationTexture(wording);
    render();
  }).catch(() => {});

  envelope.add(
    panel([[LEFT, TOP], [0, -.30], [LEFT, BOTTOM]], paperMaterial(0x385b43, grain), .27),
    panel([[RIGHT, TOP], [0, -.30], [RIGHT, BOTTOM]], paperMaterial(0x2c503a, grain), .26),
    panel([[LEFT, BOTTOM], [0, .15], [RIGHT, BOTTOM]], paperMaterial(0x486b4e, grain), .30),
    edges([[LEFT, BOTTOM], [0, .15], [RIGHT, BOTTOM]], .306, 0xa18452),
  );
  const flap = new THREE.Group();
  const flapOutline = [[LEFT, 0], [RIGHT, 0], [.12, -1.77], [-.12, -1.77]];
  flap.add(
    panel(flapOutline, paperMaterial(0x52785a, grain), 0),
    edges([...flapOutline, flapOutline[0]], .012, 0xc6a96a),
  );
  envelope.add(flap);
  const seal = makeSeal(wording.monogram);
  envelope.add(seal);

  let closedScale = 1;
  let poseTime = 0;

  function render() { renderer.render(scene, camera); }
  function resize() {
    const { clientWidth: width, clientHeight: height } = stage;
    if (!width || !height) return;
    const unitsPerPixel = Math.max(6.65 / width, 5.92 / height);
    camera.left = -width * unitsPerPixel / 2;
    camera.right = -camera.left;
    camera.bottom = -height * unitsPerPixel / 2;
    camera.top = -camera.bottom;
    camera.near = .1;
    camera.far = 25;
    camera.updateProjectionMatrix();
    closedScale = Math.min(1.43, (width * unitsPerPixel) / 5.85);
    pose(poseTime);
    renderer.setSize(width, height, false);
    render();
  }

  function pose(seconds) {
    poseTime = seconds;
    const release = ease((seconds - .05) / .59);
    const liftFlap = ease((seconds - .47) / 1.19);
    const liftCard = ease((seconds - 1.47) / 1.48);
    const straighten = ease(seconds / 2.95);
    const widen = ease((seconds - .47) / .9);
    // Start closer, then make room for the flap and card as they rise.
    envelope.scale.setScalar(THREE.MathUtils.lerp(closedScale, 1.04, widen));
    envelope.position.y = .18 - .24 * liftFlap - .67 * liftCard;
    envelope.rotation.set(-.08 * (1 - straighten), -.18 * (1 - straighten), -.075 * (1 - straighten));
    flap.position.set(0, TOP, .34 - .28 * ease((liftFlap - .5) / .45));
    flap.rotation.x = -Math.PI * liftFlap;
    seal.visible = release < .99;
    seal.position.set(.38 * release, -.11 - .28 * release, .46 + .85 * release);
    seal.rotation.set(.58 * release, -.4 * release, .4 * release);
    seal.scale.setScalar(1 - release * .94);
    card.position.set(0, 2.45 * liftCard, .14);
  }

  let frame = 0;
  function play() {
    const start = performance.now();
    function tick(now) {
      const progress = clamp((now - start) / OPEN_MILLISECONDS);
      pose(progress * OPEN_DURATION);
      render();
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
    }
    frame = requestAnimationFrame(tick);
  }

  resize();
  stage.append(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  return { play, dispose, canvas: renderer.domElement };
}
