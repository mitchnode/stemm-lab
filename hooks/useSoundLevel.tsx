import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSoundLevelReturn {
  db: number | undefined;
  realdb: number;
  maxdb: number;
  percent: number;
  isSoundRecording: boolean;
  hasAudioPermission: boolean | null;
  start: () => Promise<void>;
  stop: () => Promise<string | null | undefined>;
  reset: () => Promise<void>;
}

function dbToPercent(dbread: number | null): number {
  if (dbread === null || dbread < -40) return 0;
  // Map -60 dBFS → 0% and 0 dBFS → 100%
  return Math.round(((dbread + 40) / 40) * 100);
}

function dbToRealdb(dbread: number | null): number {
  if (dbread === null || dbread < -40) return 0;
  // Map -60 dBFS → 0% and 0 dBFS → 100%
  return Math.round(((dbread + 40) / 40) * 160);
}

export function useSoundLevel(): UseSoundLevelReturn {
  // Create the Recorder object and attach a Recorder State
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const [db, setDb] = useState<number>(0);
  const [maxdb, setMaxdb] = useState<number>(0);
  const [isSoundRecording, setIsSoundRecording] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(
    null,
  );
  const recorderState = useAudioRecorderState(recorder, 100);
  const isReleasedRef = useRef(false);

  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync().then((status) => {
      setHasAudioPermission(status.granted);
    });
  }, []);

  const start = useCallback(async () => {
    if (isSoundRecording || isReleasedRef.current) return;
    await recorder.prepareToRecordAsync({
      ...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    });
    recorder.record();
    setIsSoundRecording(true);
  }, [recorder, isSoundRecording]);

  const stop = useCallback(async () => {
    if (isReleasedRef.current) return;
    await recorder.stop();
    setIsSoundRecording(false);
    return recorder.uri;
  }, [recorder]);

  const reset = useCallback(async () => {
    setMaxdb(0);
  }, []);

  useEffect(() => {
    if (!isSoundRecording) return;

    if (recorderState.metering) {
      setDb(dbToRealdb(recorderState.metering!));
      if (db > maxdb) setMaxdb(db);
    }
  }, [isSoundRecording, recorderState, db, maxdb]);

  return {
    db: recorderState.metering,
    realdb: dbToRealdb(recorderState.metering!),
    maxdb,
    percent: dbToPercent(recorderState.metering!),
    isSoundRecording,
    hasAudioPermission,
    start,
    stop,
    reset,
  };
}
