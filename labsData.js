export const ALL_LABS = {
    'Activity 1: Parachute Drop Challenge': {

    id: "Activity 1",
    title: "Activity 1: Parachute Drop Challenge",
    
    description: {
      summary: "Students design, build, and test a parachute for a small toy to reduce its landing speed and impact force. Teams iterate their designs under time and material constraints, aiming to achieve the slowest and safest landing within a target area.",

      equipment: [ "Mobile phone with STEMM Lab app",
      "Small toy (e.g. army toy soldier)",
      "Table or elevated surface",
      "Paper or plastic",
      "String",
      "Scissors",
      "Tape"
    ],

      instructions: 
      `1.Drop the toy without a parachute and record the fall (baseline test).
2.Build a parachute using provided materials. 
3.Drop the toy from the same height and record the fall.
4.Review speed and landing accuracy results in the app. 
5.Redesign and test up to three prototypes within 20 minutes.
6.Upload videos, results, and team reflections.`

  


},
 writeUp: {
      questions: [
        "Predict which parachute design was the best.",
        "Sketch each of the designs.",
        "Record the times of the design.",
        "Were you correct in timings?",
        "What design was the easiest to make?"
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "How long will it take to hit the ground?",
        "Time (time to first hit the ground)",
        "Were you right?",
        "Time (time from first hitting the ground and stop moving) – need slow motion."
      ],
      tableRows: [
        { label: "Action 1\n(e.g. No parachute as the baseline)" },
        { label: "Action 2\n(e.g. use plastic with four corners tied to the toy)" },
        { label: "Action 3" }
      ],
      discussionTitle: "Discussion: Parachutes and Forces (Plain Language)",
      discussionText: "Gravity pulls objects downward, causing them to speed up as they fall. A parachute increases air resistance (also called drag). Drag acts upward, opposing the motion and slowing the fall. A slower fall reduces the force when the toy hits the ground, making the landing safer. Engineers improve parachute designs through repeated testing and redesign."
    }
  },
  'Activity 2: Sound Pollution Hunter': {

    id: "Activity 2",
    title: "Activity 2: Sound Pollution Hunter",
    
    description: {
      summary: "Students measure and compare sound levels in different classroom activities.",

      equipment: [ "Mobile phone with STEMM Lab app"
    ],

      instructions: 
        `1.Measure noise from different actions (dropping objects (pens, books) talking, walking, stamping your feet).
        2.Record sound levels and locations.
        3.Map loud and quiet zones.`
     

  



},
 writeUp: {
      questions: [
       "Predict which action created the loudest sound",
"Record the results",
"Were you right?",
"Any surprises?",
"Should we wear ear muffs in your classroom?"
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Prediction (louder or softer than)",
        "Outcome (dB)",
        "Were you right?",
      ],
      tableRows: [
        { label: "Action 1\n(e.g. dropping a book on the table)" },
        { label: "Action 2" },
        { label: "Action 3" }
      ],
      discussionTitle: "Discussion: Sound intensity",
      discussionText: "Sound intensity varies depending on energy and surfaces. Prolonged loud noise can impact health and concentration."
    }
  },
    "Activity 3: Hand Fan Challenge": {

    id: "Activity 3: Hand Fan Challenge",
    title: "Activity 3: Hand Fan Challenge",
    
    description: {
      summary: "Students test how air movement affects flexible materials.",

      equipment: [ "Paper and cardboard",
"Scissors",
"Mobile phone",
"Sticky Tape",
"STEMM Mobile App"

    ],

      instructions: 
        `1.Stand paper upright on a table. 
2.Fan air from 30 cm away. 
3.Observe and record movement. 
4.Repeat with different fan designs and fan distance (15cm, 30, 45cm). 
5.Repeat with a cardboard instead of a paper vertical.`

     

  



},
 writeUp: {
      questions: [
      "Predict which fan design makes the paper move the most.",
"Record the results",
"Were you right?",
"Any surprises?",
"How does material stiffness affect the bend angle?",
"How does fan design influence air velocity and resulting paper movement?",
"How does distance from the fan affect bending?"

      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Bend (in degrees) ",
        "Outcome (in degrees)",
        "Observation Notes: Were you right?",
      ],
      tableRows: [
        { label: "Design 1\n(e.g. 1cm back and forward folds)" },
        { label: "Design 2\n(e.g. no folds)" },
        { label: "Design 3" }
      ],
      discussionTitle: "Discussion: Hand Fan Challenge",
      discussionText: "Moving air applies force to objects. Paper bends due to flexibility (plasticity), and repeated bending can weaken it."
    }
  },
  "Activity 4: Earthquake-Resistant Structure": {

    id: "Activity 4",
    title: "Activity 4: Hand Fan Challenge",
    
    description: {
      summary: "Students design structures that withstand vibration, simulating earthquakes",

      equipment: [ "Cardboard, paper, scissors, sticky tape, plastic/paper cups.",
"Mobile phone with vibration sensor",
"STEMM Mobile App"

    ],

      instructions: 
       `1.Build an anti-vibration layer, by folding paper/cardboard.
2.Place a flat cardboard platform on top.
3.Place the phone in the centre and activate vibration mode on the STEMM App.
4.Modify the structure to reduce movement (e.g. more pillars, more folds, etc)`


     

  



},
 writeUp: {
      questions: [
     "Predict which fold design makes the phone move the least.",
"Record the results.",
"Were you right?.",
"Any surprises?."
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Phone moves ",
        "Outcome (in degrees)",
        "Observation Notes: Were you right?",
      ],
      tableRows: [
        { label: "Design 1\n(e.g. 4 folds + 4 pillars)" },
        { label: "Design 2\n(e.g. 10 folds + 4 pillars)" },
        { label: "Design 3\n(e.g. 3 folds and 6 pillars)" }
      ],
      discussionTitle: "Discussion: Earthquake Resistant structure",
      discussionText: "Earthquakes cause ground vibrations that can collapse poorly designed structures. Engineers design buildings to absorb and distribute energy safely"
    }
  },
  "Activity 5: Human Performance Lab – Stretch Speed & Gracefulness": {

    id: "Activity 5",
    title: "Activity 5: Human Performance Lab",
    
    description: {
      summary: "Students investigate how the human body moves by measuring speed, smoothness, and coordination during controlled stretching activities.",

      equipment: [ "Mobile phone with STEMM Lab app",
"Open space to move safely",


    ],

      instructions: 
       `1.Hold the phone firmly in one hand. Activate the App vibration sensor.
2.Perform guided movement slowly as shown in the app. Record the vibration.
3.Repeat the activity with vibration feedback enabled.
4.Review speed, smoothness, and range-of-motion data.
5.Upload results and reflect as a group.`


     

  



},
 writeUp: {
      questions: [
     "Which movement was the hardest to keep the vibration low?",
"Record the results",
"Were you right?.",
"Any surprises?."
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Predict Phone Vibration Sensor (absolute)",
        "Outcome (time + movement)",
        "Observation Notes: Were you right?",
      ],
      tableRows: [
        { label: "Attempt 1" },
        { label: "Attempt 2" },
        { label: "Attempt 3" }
      ],
      discussionTitle: "Discussion: Human Performance Lab",
      discussionText: "Muscles and joints work together to create movement. Faster movements often reduce control, while smoother movements show better coordination. Sensors in the phone measure how quickly and smoothly the body moves, helping students understand biomechanics and fatigue."
    }
  },
  
  "Activity 6: Reaction Board Challenge" :{

    id: "Activity 6",
    title: "Activity 6:Reaction Board Challenge",
    
    description: {
      summary: "Students measure reaction time, coordination, and improvement through repeated digital and physical challenges.",

      equipment: [ "Mobile phone with STEMM Lab app",
"Clear working space",


    ],

      instructions: 
     `Phase 1 Tap Reaction
Tap the screen as soon as the hidden button appears.
Record reaction time.
Rotate through each team member

Phase 2 Swap Hands
3. Repeat using the non-dominant hand.
4. Compare results.
Rotate through each team member

Phase 3 Tracing Challenge
5. Trace a moving shape on the screen.
6. Review accuracy and delay.
Rotate through each team member`


},
 writeUp: {
      questions: [
     "Predict your reaction time.?",
"Record the results",
"Were you right?.",
"Any surprises?."
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Reaction Time Prediction",
        "Outcome (time + movement)",
        "Observation Notes: Were you right?",
      ],
      tableRows: [
        { label: "Attempt 1" },
        { label: "Attempt 2" },
        { label: "Attempt 3" }
      ],
      discussionTitle: "Discussion: Reaction Board Challenge",
      discussionText: "Reaction time measures how quickly the brain processes information and sends signals to muscles. Practice can improve speed and coordination. Comparing hands shows how dominance affects performance."
    }
  }, 

    "Activity  7: Breathing Pace Trainer" :{

    id: "Activity 7",
    title: "Activity 7:Breathing Pace Trainer",
    
    description: {
      summary: "Students analyse breathing patterns at rest and after exercise.",

      equipment: [ "Mobile phone with STEMM Lab app",
"Flat surface or mat",


    ],

      instructions: 
     `1.Place the phone gently on the chest.
2.Record breathing at rest.
3.Perform light exercise.
  1.Jog one minute on the spot
  2.100 star jump
4.Record breathing again and compare results.
        Rotate for each team member`



},
 writeUp: {
      questions: [
     "Predict which fold design makes the phone move the least.",
"Record the results",
"Were you right?.",
"Any surprises?."
      ],
      tableHeaders: [
        "", // Top-left blank spacer cell over rows
        "Predict Breathe per minute",
        "Outcome (time + movement)",
        "Observation Notes: Were you right?",
      ],
      tableRows: [
        { label: "Breathing at Rest" },
        { label: "After Exercise 1" },
        { label: "After Exercise 2" }
      ],
      discussionTitle: "Discussion: Breathing Pace Trainer",
      discussionText: "Breathing rate increases during exercise to supply more oxygen to muscles. Sensors detect chest movement, helping students visualise breathing patterns."
    }
  }, 
  
  
};