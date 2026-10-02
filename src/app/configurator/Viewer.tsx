"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useStore, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import type { Config, Kit } from "@/lib/configurator/config";
import { partInstances } from "@/lib/configurator/assembly";

const BACKGROUND = "#fafaf8";
const MIN_POLAR = THREE.MathUtils.degToRad(60);
const MAX_POLAR = THREE.MathUtils.degToRad(95);
const MM = 0.001;
const PRESETS = [
  ["front", "Front"],
  ["oblique", "Oblique"],
  ["rear", "Rear"],
] as const;

type OrbitImpl = React.ComponentRef<typeof OrbitControls>;

// Kits ship meshopt-compressed; Draco is off so nothing is fetched from a CDN.
const withMeshopt = (loader: { setMeshoptDecoder: (d: typeof MeshoptDecoder) => void }) =>
  loader.setMeshoptDecoder(MeshoptDecoder);

function Part({ url, matrix, flap }: { url: string; matrix: THREE.Matrix4; flap: boolean }) {
  const { scene: cached } = useGLTF(url, false, false, withMeshopt);
  // The loader caches one scene per URL and an Object3D has one parent, so every instance
  // (extra panels reuse a part's GLB) needs its own clone. Geometry and materials stay shared.
  const scene = useMemo(() => cached.clone(), [cached]);
  const ref = useRef<THREE.Group>(null);
  // Kits carry no normals: plies are flat slabs, so flat shading is the correct look and avoids
  // smoothed edges from computed vertex normals.
  useEffect(() => {
    const outlines: THREE.LineSegments[] = [];
    const lineMaterial = new THREE.LineBasicMaterial({ color: "#55524c", transparent: true, opacity: 0.45, depthWrite: false });
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (flap && mesh.isMesh) {
        const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30), lineMaterial);
        mesh.add(lines);
        outlines.push(lines);
      }
      const m = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (m && "flatShading" in m && !m.flatShading) {
        m.flatShading = true;
        m.needsUpdate = true;
      }
    });
    return () => {
      outlines.forEach((line) => { line.removeFromParent(); line.geometry.dispose(); });
      lineMaterial.dispose();
    };
  }, [scene, flap]);
  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    group.matrixAutoUpdate = false;
    group.matrix.copy(matrix);
    group.updateMatrixWorld(true);
  }, [matrix]);
  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

export type CaptureFn = () => string;

/** Hands the parent a function that renders one fresh frame and returns it as a PNG data URL. */
function Capture({ target: targetRef }: { target: React.MutableRefObject<CaptureFn | null> }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    targetRef.current = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    };
    return () => {
      targetRef.current = null;
    };
  }, [gl, scene, camera, targetRef]);
  return null;
}

/** RoomEnvironment as scene.environment — soft studio light with no network HDR. */
function RoomLight() {
  const store = useStore();
  useEffect(() => {
    const { gl, scene } = store.getState();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.6; // keep the felt colours readable
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
    };
  }, [store]);
  return null;
}

/** Keeps the whole set in frame when its footprint changes (extra panels, another kit). */
function Refit({ controls, target, diagonal }: { controls: React.RefObject<OrbitImpl | null>; target: THREE.Vector3; diagonal: number }) {
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const offset = c.object.position.clone().sub(c.target).setLength(diagonal * 1.36);
    c.target.copy(target);
    c.object.position.copy(target).add(offset);
    c.update();
  }, [controls, target, diagonal]);
  return null;
}

/** Eases the orbit angles toward the kit's named camera when a preset button is pressed. */
function CameraRig({
  controls,
  camera,
}: {
  controls: React.RefObject<OrbitImpl | null>;
  camera?: { azimuth_deg: number; elevation_deg: number };
}) {
  const goal = useRef<{ theta: number; phi: number } | null>(null);
  useEffect(() => {
    if (!camera) return;
    goal.current = {
      theta: THREE.MathUtils.degToRad(camera.azimuth_deg),
      phi: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(90 - camera.elevation_deg), MIN_POLAR, MAX_POLAR),
    };
  }, [camera]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || !goal.current) return;
    const offset = new THREE.Vector3().copy(c.object.position).sub(c.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    const dTheta = Math.atan2(Math.sin(goal.current.theta - spherical.theta), Math.cos(goal.current.theta - spherical.theta));
    const dPhi = goal.current.phi - spherical.phi;
    if (Math.abs(dTheta) < 0.001 && Math.abs(dPhi) < 0.001) {
      goal.current = null;
      return;
    }
    const k = 1 - Math.exp(-dt * 6);
    spherical.theta += dTheta * k;
    spherical.phi += dPhi * k;
    c.object.position.copy(c.target).add(offset.setFromSpherical(spherical));
    c.update();
  });
  return null;
}

export default function Viewer({
  kit,
  config,
  capture,
}: {
  kit: Kit | null;
  config: Config | null;
  capture?: React.MutableRefObject<CaptureFn | null>;
}) {
  // This module is only ever loaded in the browser (dynamic import, ssr: false).
  const [webgl] = useState(() => {
    try {
      const probe = document.createElement("canvas");
      return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const [preset, setPreset] = useState<string>("oblique");
  const controls = useRef<OrbitImpl | null>(null);
  const { active, progress } = useProgress();

  const scene = useMemo(() => {
    if (!kit) return null;
    const min = new THREE.Vector3(...kit.bounds_mm.min).multiplyScalar(MM);
    const max = new THREE.Vector3(...kit.bounds_mm.max).multiplyScalar(MM);
    for (const side of ["left", "right"] as const) {
      // extra panels extend the footprint by one step each (a bound, exact in the straight layout)
      const grow = (kit.chain?.sides[side]?.step_mm ?? 0) * (config?.wings?.[side] ?? 0) * MM;
      if (side === "left") min.x -= grow; else max.x += grow;
    }
    const target = min.clone().add(max).multiplyScalar(0.5);
    const diagonal = max.clone().sub(min).length();
    return { target, diagonal };
  }, [kit, config?.wings]);

  const parts = useMemo(() => {
    if (!kit || !config) return [];
    return partInstances(kit, config).map(({ key, part, matrix }) => ({
      key: `${kit.id}/${key}`, url: `/configurator/kits/${kit.id}/${part.glb}`, matrix, flap: part.kind === "flap",
    }));
  }, [kit, config]);

  // Start every part download at once; without this the Suspense boundary loads them one by one.
  useEffect(() => {
    parts.forEach((p) => useGLTF.preload(p.url, false, false, withMeshopt));
  }, [parts]);

  if (!webgl) {
    return (
      <div className="flex h-full items-center justify-center bg-surface p-8 text-center">
        <p className="max-w-xs text-sm text-muted">
          This browser cannot show the 3D set. The design is still saved, and a quote request will
          include it.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-background">
      {scene && webgl && (
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true }}
          camera={{
            fov: 35,
            near: 0.05,
            far: 100,
            position: [
              scene.target.x + scene.diagonal * 0.6,
              scene.target.y + scene.diagonal * 0.25,
              scene.target.z + scene.diagonal * 1.2,
            ],
          }}
        >
          <color attach="background" args={[BACKGROUND]} />
          <RoomLight />
          <directionalLight position={[2, 5, 3]} intensity={0.7} />
          <group scale={MM}>
            {parts.map((p) => (
              <Suspense key={p.key} fallback={null}>
                <Part url={p.url} matrix={p.matrix} flap={p.flap} />
              </Suspense>
            ))}
          </group>
          <ContactShadows
            position={[scene.target.x, 0, scene.target.z]}
            scale={scene.diagonal * 1.6}
            opacity={0.35}
            blur={2.4}
            far={scene.diagonal}
            resolution={1024}
            color="#1a1a1a"
          />
          <OrbitControls
            ref={controls}
            makeDefault
            target={scene.target}
            enablePan={false}
            minPolarAngle={MIN_POLAR}
            maxPolarAngle={MAX_POLAR}
            minDistance={scene.diagonal * 0.7}
            maxDistance={scene.diagonal * 2.6}
          />
          <CameraRig controls={controls} camera={kit?.cameras?.[preset]} />
          <Refit controls={controls} target={scene.target} diagonal={scene.diagonal} />
          {capture && <Capture target={capture} />}
        </Canvas>
      )}

      {active && (
        <div className="absolute inset-x-0 top-0 h-px bg-line">
          <div className="h-px bg-accent transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-px border border-line bg-background">
        {PRESETS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="ghost border-0"
            data-selected={preset === id}
            onClick={() => setPreset(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
