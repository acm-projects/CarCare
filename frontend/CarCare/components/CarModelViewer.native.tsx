import React, { Suspense, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import { Canvas } from "@react-three/fiber/native";
import { OrbitControls, useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

type CarModelViewerProps = {
  /** `require(".../model.glb")` */
  modelAsset?: number;
  backgroundColor?: string;
  autoRotate?: boolean;
};

function useAssetUri(moduleId?: number) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!moduleId) {
      setUri(null);
      return;
    }
    (async () => {
      const asset = Asset.fromModule(moduleId);
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      if (!cancelled) {
        setUri(asset.localUri ?? asset.uri ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  return uri;
}

function NormalizedModel({ uri }: { uri: string }) {
  const gltf = useGLTF(uri);

  const { object, scale, center } = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const centerVec = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centerVec);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = 1.6 / maxDim; // tuned for the 170px-tall hero box

    return {
      object: scene,
      scale: normalizedScale,
      center: centerVec,
    };
  }, [gltf.scene]);

  return (
    <group scale={scale} position={[-center.x * scale, -center.y * scale, -center.z * scale]}>
      <primitive object={object} />
    </group>
  );
}

export function CarModelViewer({
  modelAsset,
  backgroundColor = "transparent",
  autoRotate = true,
}: CarModelViewerProps) {
  const uri = useAssetUri(modelAsset);

  if (!modelAsset) {
    return (
      <View style={[styles.fallback, { backgroundColor }]}>
        <Text style={styles.fallbackText}>Add your Civic .glb to</Text>
        <Text style={styles.fallbackTextBold}>assets/models/</Text>
        <Text style={styles.fallbackText}>and wire up the `require(...)`.</Text>
      </View>
    );
  }

  if (!uri) {
    return (
      <View style={[styles.fallback, { backgroundColor }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0.1, 2.6], fov: 40, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <NormalizedModel uri={uri} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </View>
  );
}

useGLTF.preload = () => {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  fallbackText: {
    opacity: 0.65,
    fontSize: 12,
  },
  fallbackTextBold: {
    opacity: 0.8,
    fontSize: 12,
    fontWeight: "700",
  },
});

