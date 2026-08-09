import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let landmarkerInstance: FaceLandmarker | null = null;
let loadPromise: Promise<FaceLandmarker> | null = null;

export async function loadFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerInstance) return landmarkerInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

    const tryCreate = (delegate: 'GPU' | 'CPU') =>
      FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate,
        },
        runningMode: 'VIDEO',
        numFaces: 2,
        outputFacialTransformationMatrixes: true,
      });

    try {
      landmarkerInstance = await tryCreate('GPU');
    } catch {
      landmarkerInstance = await tryCreate('CPU');
    }

    return landmarkerInstance;
  })();

  return loadPromise;
}

export function closeFaceLandmarker() {
  if (landmarkerInstance) {
    landmarkerInstance.close();
    landmarkerInstance = null;
  }
  loadPromise = null;
}
