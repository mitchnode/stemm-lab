import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { useRouter } from 'expo-router';
import { Accelerometer } from "expo-sensors";

import {
    useTheme as useRETheme
} from "re-native-ui";
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
    SensorType,
    useAnimatedSensor,
    useReducedMotion
} from "react-native-reanimated";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';




interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  colors: any;
  
 
}


  const NumericStepper : React.FC<NumericStepperProps> = ({ value, onChange, disabled, colors})=> {
  const increment = () => onChange(Math.min(600, value + 5)); // Max 10 minutes
  const decrement = () => onChange(Math.max(5, value - 5));   // Min 5 seconds

 return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity 
        style={[styles.stepperButton, { backgroundColor: colors.surface },disabled && { opacity: 0.5 }]} 
        onPress={decrement} 
        disabled={disabled}
      >
        <Text style={{color: colors.text}}>-</Text>
      </TouchableOpacity>
      
      <Text style={[styles.large_font, { color: colors.text, marginHorizontal: 20 }]}>
        {value}s
      </Text>
      
      <TouchableOpacity 
        style={[styles.stepperButton,{ backgroundColor: colors.surface }, disabled && { opacity: 0.3 }]}
        onPress={increment} 
        disabled={disabled}
      >
      <Text style={{ color: colors.text, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
  interface DataPoint {
  timestamp: number;
  magnitude: number;
}




export default function Sensors() {


      const ACTIVITY_ID = "2";

    const viewModel = React.useMemo(() => new ResultViewModel(), []);
  const [loading, setLoading] = useState(false);
 const router = useRouter(); 
   
    const { colors, setScheme, isDark } = useTheme();

const changeTheme = () => {
      isDark ? setScheme("light") : setScheme("dark");
   
    };
    const [targetSeconds, setTargetSeconds] = useState(10);
  

    
     const theme = useRETheme();
      theme.colors.background = colors.background;
      theme.colors.primary = colors.primary;
      theme.colors.text = colors.text;
      theme.colors.border = colors.border;
    
      
      const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  const acceleromter = useAnimatedSensor(SensorType.ACCELEROMETER);


  const reduceMotion = useReducedMotion();
const [acc, setAccData] = useState({ x: 0, y: 0, z: 0 });
  

  const multiplier = reduceMotion ? 10 : 50;

   const appState = useRef(AppState.currentState);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create configuration for the withSpring animation
  const config = {
    stiffness: 100,
    damping: 10,
    mass: 4,
  };





  

    const accLiveRef = useRef({ x: 0, y: 0, z: 0 });



  



  


  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setAccData(accelerometerData);
        accLiveRef.current = accelerometerData;
    });

    return () => {
      subscription.remove();
    };
  }, []); 
  




useEffect(() => {
  if (isActive) {
    setDataPoints([]);
    setSeconds(0);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        const nextSecond = prev + 1;

        // Auto-stop logic
        if (nextSecond >= targetSeconds) {
          setIsActive(false);
        }

        // Capture data
        const currentAcc = accLiveRef.current;
        const magnitudeG = Math.sqrt(currentAcc.x ** 2 + currentAcc.y ** 2 + currentAcc.z ** 2);
        const magnitude = parseFloat((magnitudeG * 9806.65).toFixed(2));

        if (isFinite(magnitude)) {
          setDataPoints((prevPoints) => [...prevPoints, { timestamp: Date.now(), magnitude }]);
        }

        return nextSecond;
      });
    }, 1000);
  } else {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [isActive, targetSeconds]);

  const cancelRecording = () => {
  setIsActive(false);
  setSeconds(0);
  setDataPoints([]);
};

const chartData = {
  // Use slice(-10) to match the data displayed in the chart
  labels: dataPoints.map((_, i) => `${i+1}`), 
  datasets: [
    {
      // Fallback to [0] if dataPoints is empty to prevent chart errors
  data: dataPoints.length > 0 ? dataPoints.map(p => p.magnitude) : [0]
    }
  ]
};

const onUpload = async () => {
   setLoading(true);
    await viewModel.handleUpload(); // shows alert and navigates home on completion
      setLoading(false);
  };


const onRecord = async (data: DataPoint[]) => {

  const stringifiedData = JSON.stringify(data);
  viewModel.setTeamID("team-123");
  viewModel.setActivityID(ACTIVITY_ID);
  viewModel.setResultDateTime(new Date().toLocaleString());
  viewModel.setResultType("time");
  viewModel.setResultValue(`${dataPoints[dataPoints.length - 1].magnitude.toFixed(0)} mm/s²`);
   viewModel.setResultData(stringifiedData);
  const resultID = await viewModel.handleRecord();
};

useEffect(() => {
  const saveResult = async () => {
       if (!isActive && dataPoints.length > 0) {
    // Only run this if recording just finished
  try {

        await onRecord(dataPoints);
         await onUpload();

     console.log("Success: Record saved and uploaded.");
       
       
        } catch (error) {
          
          console.error("Failed to compile or parse recorded metrics", error);
        }
      }
    };
  saveResult();
}, [isActive]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
     <ScrollView style={{ backgroundColor: colors.background}} 
          contentContainerStyle={{ flexGrow: 1 ,  paddingBottom: 60}}
          keyboardShouldPersistTaps="handled">
<View style={{ width: '100%' }}> 
           <TouchableOpacity onPress={changeTheme} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={{ alignSelf: 'flex-end' }}>
             <MaterialIcons 
               name={isDark ? "wb-sunny" : "nights-stay"} 
               size={28} 
               color={isDark ? "#FFD700" : "#000"} 
             />
           </TouchableOpacity>
         </View>
       
<NumericStepper 
  value={targetSeconds} 
  onChange={setTargetSeconds} 
  disabled={isActive}
  colors ={colors} 
/>
     <View style={[styles.screen, {backgroundColor: colors.background}]}>
          <Text style={[styles.timerText, {color: colors.text}]}>Recording: {seconds}s</Text>
      
      {/* Visual toggle control to change isActive status */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: isActive ? '#ff0000' : '#4cd964' }]} 
        onPress={() => setIsActive(!isActive)}
      >
        <Text style={[styles.buttonText, {color: colors.text}]}>{isActive ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
{isActive && (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: '#ff9500' }]} 
      onPress={cancelRecording}
    >
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  )}
      {acc ? (
        <View style={[styles.dataContainer, {backgroundColor: colors.background, borderColor: colors.border}]}>
          <Text style={[styles.header, {color: colors.text}]}>Accelerometer Live Metrics</Text>
      
<Text style={{ color: colors.text }}>X: {(acc.x * 9806.65).toFixed(0)} mm/s²</Text>
<Text style={{ color: colors.text }}>Y: {(acc.y * 9806.65).toFixed(0)} mm/s²</Text>
<Text style={{ color: colors.text }}>Z: {(acc.z * 9806.65).toFixed(0)} mm/s²</Text>
        </View>
      ) : null}

   

     <Text style={[styles.graphHeader, { color: colors.text }]}>Total Magnitude (g) over Time</Text>
    {dataPoints.length > 0 && (
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
         backgroundColor: colors.background,
          backgroundGradientFrom: colors.background,
          backgroundGradientTo: colors.surface || colors.background,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 1) => colors.text,
        }}
        style={styles.chart}
      />
      )}
    </View>

     <View>
      <Button title= "upload to firebase" onPress = {onUpload}/>
    </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },

  headerTitle: { fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
  
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  graphHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "black",
    margin: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  // second box added as i will need to add different parameters for the acvities box
   box2: {
    justifyContent: "center",
    alignItems: "stretch",
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
 
    minWidth: 400,
  },
  heading: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    gap: 40,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  large_font: {
    fontSize: 20,
  },
  bold_text: {
    fontWeight: "bold",
    fontSize: 20,
  },
  members: {
    gap: 5,
  },
  members_text: {
    textAlign: "right",
  },
  stepperContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 20,
},
stepperButton: {

  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
},
});

