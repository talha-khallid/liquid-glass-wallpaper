import { useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { shaderMaterial, useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "../store";

function VideoBackground({ videoNumber }) {
  const { viewport, camera } = useThree();

  const materialRef = useRef();
  const meshRef = useRef();

  const CustomVideoMaterial = useMemo(
    () =>
      shaderMaterial(
        {
          time: 0,
          map: null,
          viewportResolution: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
          ),
          videoResolution: new THREE.Vector2(20, 10),
        },
        // vertex shader
        /*glsl*/ `
          varying vec2 vUv;
          varying vec2 vScreenPos;
          void main() {
            vUv = uv;
            vScreenPos = position.xy;
            // gl_Position = vec4(position, 1.0); // for 2d
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        // fragment shader
        /*glsl*/ `
          uniform float time;
          uniform sampler2D map;
          uniform vec2 viewportResolution;
          uniform vec2 videoResolution;
          varying vec2 vUv;
          varying vec2 vScreenPos;
      
          void main() {
            // Calculate aspect ratios
            float viewportAspect = viewportResolution.x / viewportResolution.y;
            float videoAspect = videoResolution.x / videoResolution.y;
            
            // Convert screen position to normalized UV coordinates [0, 1]
            vec2 screenUV = (vScreenPos + 1.0) * 0.5;
            
            // Calculate scale factor to cover the screen
            float scale;
            vec2 offset = vec2(0.0);
            
            if (videoAspect > viewportAspect) {
              // Video is wider than viewport
              scale = viewportAspect / videoAspect;
              offset.x = (1.0 - scale) * 0.5;
              screenUV.x = screenUV.x * scale + offset.x;
            } else {
              // Video is taller than viewport
              scale = videoAspect / viewportAspect;
              offset.y = (1.0 - scale) * 0.25;
              screenUV.y = screenUV.y * scale + offset.y;
            }
            
            // Clamp to ensure we don't go outside texture bounds
            screenUV = clamp(screenUV, 0.0, 1.0);
            
            vec4 texColor = texture2D(map, screenUV);
            vec3 finalColor = mix(texColor.rgb, vec3(0.0, 0.0, 0.0), 0.3);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      ),
    []
  );

  extend({ CustomVideoMaterial });

  const videoTexture = useVideoTexture(`/video_demo${videoNumber}.mp4`, {
    start: true,
    muted: true,
    loop: true,
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = videoTexture;
    }
  }, [videoTexture]);

  const updateDimensions = () => {
    if (materialRef.current) {
      materialRef.current.viewportResolution.set(
        viewport.width,
        viewport.height
      );
    }
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width / 1.5, viewport.height / 1.5, 1);
    }
  };

  useLayoutEffect(() => {
    updateDimensions();
    if (materialRef.current && videoTexture) {
      materialRef.current.map = videoTexture;
    }
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [viewport]);

  useEffect(() => {
    updateDimensions();
  }, [camera.fov, camera.aspect]);

  useEffect(() => {
    if (materialRef.current && videoTexture) {
      materialRef.current.map = videoTexture;
    }
  }, []);

  return (
    <mesh
      position={[0, 0, -1.5]}
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[2.5, 2.5]} />
      <customVideoMaterial ref={materialRef} depthWrite={false} />
    </mesh>
  );
}

function ImageBackground({ imageName }) {
  const { viewport, camera } = useThree();

  const materialRef = useRef();
  const meshRef = useRef();

  const CustomImageMaterial = useMemo(
    () =>
      shaderMaterial(
        {
          time: 0,
          map: null,
          viewportResolution: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
          ),
          videoResolution: new THREE.Vector2(20, 10),
        },
        // vertex shader
        /*glsl*/ `
          varying vec2 vUv;
          varying vec2 vScreenPos;
          void main() {
            vUv = uv;
            vScreenPos = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        // fragment shader
        /*glsl*/ `
          uniform float time;
          uniform sampler2D map;
          uniform vec2 viewportResolution;
          uniform vec2 videoResolution;
          varying vec2 vUv;
          varying vec2 vScreenPos;
      
          void main() {
            // Calculate aspect ratios
            float viewportAspect = viewportResolution.x / viewportResolution.y;
            float videoAspect = videoResolution.x / videoResolution.y;
            
            // Convert screen position to normalized UV coordinates [0, 1]
            vec2 screenUV = (vScreenPos + 1.0) * 0.5;
            
            // Calculate scale factor to cover the screen
            float scale;
            vec2 offset = vec2(0.0);
            
            if (videoAspect > viewportAspect) {
              // Video is wider than viewport
              scale = viewportAspect / videoAspect;
              offset.x = (1.0 - scale) * 0.5;
              screenUV.x = screenUV.x * scale + offset.x;
            } else {
              // Video is taller than viewport
              scale = videoAspect / viewportAspect;
              offset.y = (1.0 - scale) * 0.25;
              screenUV.y = screenUV.y * scale + offset.y;
            }
            
            // Clamp to ensure we don't go outside texture bounds
            screenUV = clamp(screenUV, 0.0, 1.0);
            
            vec4 texColor = texture2D(map, screenUV);
            vec3 finalColor = mix(texColor.rgb, vec3(0.0, 0.0, 0.0), 0.2);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      ),
    []
  );

  extend({ CustomImageMaterial });

  const imageTexture = useTexture(`/${imageName}.jpg`);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = imageTexture;
    }
  }, [imageTexture]);

  const updateDimensions = () => {
    if (materialRef.current) {
      materialRef.current.viewportResolution.set(
        viewport.width,
        viewport.height
      );
    }
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width / 1.3, viewport.height / 1.3, 1);
    }
  };

  useLayoutEffect(() => {
    updateDimensions();
    if (materialRef.current && imageTexture) {
      materialRef.current.map = imageTexture;
    }
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [viewport]);

  useEffect(() => {
    updateDimensions();
  }, [camera.fov, camera.aspect]);

  useEffect(() => {
    if (materialRef.current && imageTexture) {
      materialRef.current.map = imageTexture;
    }
  }, []);

  // Smooth and subtle parallax on cursor movement
  useFrame((state, delta) => {
    if (meshRef.current) {
      easing.damp(
        meshRef.current.position,
        "x",
        -state.pointer.x * 0.08,
        0.5,
        delta
      );
      easing.damp(
        meshRef.current.position,
        "y",
        -state.pointer.y * 0.05,
        0.5,
        delta
      );
    }
  });

  return (
    <mesh
      position={[0, 0, -1.5]}
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[2.8, 2.8]} />
      <customImageMaterial ref={materialRef} depthWrite={false} />
    </mesh>
  );
}

export default function BackgroundImageCover() {
  const { background } = useSnapshot(state);

  const isVideo = ["video1", "video2", "video3"].includes(background);
  const videoNumber = isVideo ? background.slice(-1) : null;

  return isVideo ? (
    <VideoBackground videoNumber={videoNumber} />
  ) : (
    <ImageBackground imageName={background || "bg1"} />
  );
}
