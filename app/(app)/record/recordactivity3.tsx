import Slider from "@react-native-community/slider"; // Possibly change to Slider from expo/ui - need to upgrade expo SDK version
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

import { AngleOverlay } from "@/components/AngleOverlay";
import { useAuth } from "@/context/authContext";
import { usePaperAngle } from "@/hooks/usePaperAngle";
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { useWindowDimensions } from "react-native";

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function RecordActivity3() {
  const { user } = useAuth();
  const ACTIVITY_ID = "3";
  const { colors } = useTheme();
  const [data, setData] = useState("");
  const cameraRef = useRef<CameraView>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [snappedImage, setCapturedImage] = useState<string>("");
  const [permission, requestPermission] = useCameraPermissions();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [announcedAngle, setAnnouncedAngle] = useState(0);

  const [facing] = useState<CameraType>("back");

  const { currentAngleDeg, baselineAngleDeg, reset, setCurrentAngleDeg } =
    usePaperAngle();

  const HUD_HEIGHT = 360;
  const cameraHeight = screenHeight - HUD_HEIGHT - insets.top;

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    if (!team.teamID) {
      loadTeam();
    }
  }, []);

  const captureImage = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) setCapturedImage(photo.uri);
  };

  useEffect(() => {
    if (snappedImage) setIsCaptured(true);
  }, [snappedImage]);

  const handleReset = () => {
    setCapturedImage("");
    setIsCaptured(false);
    reset();
  };

  useEffect(() => {
    if (data) {
      // Get any processed result here before passing to the results page
      const dateTime = new Date().toISOString();
      const resultType = "Bend Angle Degrees(°)";
      const resultValue = currentAngleDeg.toString();
      result.setTeamID(team.teamID);
      result.setActivityID(ACTIVITY_ID);
      result.setResultDateTime(dateTime);
      result.setResultType(resultType);
      result.setResultValue(resultValue);
      result.setResultData(data);
      const recordResult = async () => {
        const resultID = await result.handleRecord();
        router.push({
          pathname: "/results",
          params: { resultID: resultID },
        });
      };

      recordResult();
    }
    return () => {
      setData("");
      handleReset();
    };
  }, [data]);

  const record = async () => {
    if (!viewShotRef.current) return;

    try {
      const uri = await viewShotRef.current.capture!();
      setData(uri);
    } catch (error) {
      console.error("Error capturing the screen:", error);
    }
  };

  if (!permission) {
    return (
      <View
        style={{
          ...styles.permissionContainer,
          backgroundColor: colors.background,
        }}
        accessible={true}
        accessibilityRole="summary"
        accessibilityLiveRegion="assertive"
      >
        <Text style={{ ...styles.text, color: colors.text }}>
          Requesting camera access…
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          ...styles.permissionContainer,
          backgroundColor: colors.background,
        }}
        accessible={true}
        accessibilityRole="alert"
      >
        <Text style={{ ...styles.title, color: colors.primary }}>
          Camera Access Required
        </Text>
        <Text style={{ ...styles.text, color: colors.text }}>
          This app needs the camera to measure the paper bend angle.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Grant app system camera hardware access permissions"
        >
          <Text style={styles.buttonText}>GRANT ACCESS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={
        isCaptured
          ? "Captured static preview image frame showing targeted paper curve trajectory."
          : "Live camera view finder preview feed. Align the paper profile with the graphics overlay layer tools."
      }
      style={{ ...styles.root, backgroundColor: colors.background }}
    >
      <ViewShot
        ref={viewShotRef}
        style={{
          ...styles.cameraContainer,
          height: cameraHeight,
          backgroundColor: colors.background,
        }}
        options={{ format: "jpg" }}
      >
        {snappedImage ? (
          <Image style={StyleSheet.absoluteFill} source={snappedImage} />
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            importantForAccessibility="no"
          />
        )}
        <AngleOverlay
          width={screenWidth}
          height={cameraHeight}
          currentAngleDeg={currentAngleDeg}
          baselineAngleDeg={baselineAngleDeg}
        />
      </ViewShot>
      <View style={styles.resultContainer}>
        <View
          style={styles.angleBlock}
          accessible={true}
          accessibilityRole="none"
          accessibilityLiveRegion="polite"
        >
          <Text style={{ ...styles.angleLabel, color: colors.text }}>
            BEND ANGLE
          </Text>
          <Text style={{ ...styles.angleValue, color: colors.text }}>
            {currentAngleDeg.toFixed(1)}°
          </Text>
        </View>

        <View style={styles.sliderSection}>
          <Text style={{ ...styles.sliderLabel, color: colors.text }}>
            PAPER ANGLE
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={90}
            value={currentAngleDeg}
            onValueChange={setCurrentAngleDeg}
            onSlidingComplete={(value) => {
              setAnnouncedAngle(Math.round(value));
            }}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.text}
            thumbTintColor={colors.primary}
            step={0.5}
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Paper alignment calculation degree track bar"
            accessibilityLabelledBy="sliderLabelId"
            accessibilityValue={{
              min: 0,
              max: 90,
              now: Math.round(currentAngleDeg),
            }}
            accessibilityHint="adjust bend angle degree"
          />
          <View
            style={styles.sliderTicks}
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={{ ...styles.tickLabel, color: colors.text }}>0°</Text>
            <Text style={{ ...styles.tickLabel, color: colors.text }}>90°</Text>
          </View>
        </View>

        <View style={{ ...styles.buttonRow, borderColor: colors.text }}>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
            }}
            onPress={handleReset}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Reset workspace calculations"
            accessibilityHint="Clears the current captured image cache and unfreezes the live camera feed"
          >
            <Text style={{ ...styles.buttonText }}>Reset</Text>
          </TouchableOpacity>
          {isCaptured ? (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors.success,
              }}
              onPress={record}
              accessible={true}
              accessibilityRole="none"
              accessibilityLabel="Confirm and upload recorded video"
              accessibilityHint="Captures viewshot image frame graphics"
            >
              <Text style={{ ...styles.buttonText }}>Record Result</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors.success,
              }}
              onPress={captureImage}
              accessible={true}
              accessibilityRole="none"
              accessibilityLabel="Capture current view frame snapshot"
              accessibilityHint="Snaps picture from active camera lens stream output"
            >
              <Text style={{ ...styles.buttonText }}>Capture</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  cameraContainer: {
    width: "100%",
    overflow: "hidden",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  resultContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 150,
  },
  angleBlock: {
    alignItems: "center",
  },
  angleLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  angleValue: {
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 46,
  },
  sliderSection: {
    paddingInline: 30,
    marginBottom: 6,
  },
  pivotSection: {
    marginBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  sliderLabel: {
    fontSize: 9,
    marginBottom: 0,
  },
  slider: {
    width: "100%",
    height: 36,
  },
  sliderTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -6,
  },
  tickLabel: {
    fontSize: 8,
  },
  buttonRow: {
    alignSelf: "center",
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    gap: 20,
  },
  button: {
    width: 140,
    height: 70,
    borderWidth: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderColor: "transparent",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
