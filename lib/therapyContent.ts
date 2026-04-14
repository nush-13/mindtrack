export type CategoryConfig = {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  symptoms: string[];
  quiz: {
    question: string;
    options: { text: string; score: number }[];
  }[];
  videoId: string; // YouTube Video ID
  videoTitle: string;
  exerciseId: "box-breathing" | "grounding" | "thought-labeling" | "gratitude" | "safe-space" | "task-activation" | "emotion-regulation";
  exerciseTitle: string;
};

export const THERAPY_CONTENT: Record<string, CategoryConfig> = {
  anxiety: {
    id: "anxiety",
    title: "Anxiety Disorders",
    icon: "😰",
    color: "purple",
    description: "Anxiety is more than just feeling stressed. It's a persistent, often overwhelming worry that can trigger physical symptoms like a racing heart, shortness of breath, and restlessness.",
    symptoms: [
      "Feeling restless, wound-up, or on edge",
      "Having a sense of impending danger or panic",
      "Having an increased heart rate",
      "Breathing rapidly (hyperventilation)",
      "Difficulty concentrating on anything other than the present worry"
    ],
    quiz: [
      { question: "How often do you feel nervous, anxious, or on edge?", options: [{text:"Rarely", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you struggle to control your worrying?", options: [{text:"Not at all", score:0}, {text:"Occasionally", score:1}, {text:"Most days", score:2}, {text:"Every day", score:3}] },
      { question: "Do you experience sudden feelings of panic for no apparent reason?", options: [{text:"No", score:0}, {text:"Once or twice", score:1}, {text:"Sometimes", score:2}, {text:"Frequently", score:3}] },
      { question: "Does anxiety interfere with your daily life or relationships?", options: [{text:"Never", score:0}, {text:"Slightly", score:1}, {text:"Significantly", score:2}, {text:"Severely", score:3}] },
      { question: "Do you have physical symptoms like racing heart, sweating, or trembling?", options: [{text:"No", score:0}, {text:"Rarely", score:1}, {text:"Sometimes", score:2}, {text:"Often", score:3}] }
    ],
    videoId: "IzFObkVRSV0", // TED-Ed: What causes panic attacks?
    videoTitle: "Understanding Anxiety & Panic Attacks",
    exerciseId: "box-breathing",
    exerciseTitle: "Box Breathing Technique"
  },
  mood: {
    id: "mood",
    title: "Mood Disorders (Depression & Bipolar)",
    icon: "🌧️",
    color: "blue",
    description: "Mood disorders encompass conditions where your emotional state is severely distorted or inconsistent with your circumstances, ranging from extreme sadness (depression) to extreme highs (mania).",
    symptoms: [
      "Persistent sad, anxious, or 'empty' mood",
      "Loss of interest or pleasure in hobbies and activities",
      "Decreased energy or fatigue",
      "Difficulty sleeping, early-morning awakening, or oversleeping",
      "Appetite and/or weight changes"
    ],
    quiz: [
      { question: "How often do you feel little interest or pleasure in doing things?", options: [{text:"Rarely", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you feel down, depressed, or hopeless?", options: [{text:"Rarely", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you struggle with low energy or feeling unusually tired?", options: [{text:"No", score:0}, {text:"Occasionally", score:1}, {text:"Most days", score:2}, {text:"Every day", score:3}] },
      { question: "How is your sleep?", options: [{text:"Normal", score:0}, {text:"Slightly disrupted", score:1}, {text:"Very difficult", score:2}, {text:"Can't sleep/Oversleeping", score:3}] },
      { question: "Do you feel bad about yourself, or that you are a failure?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] }
    ],
    videoId: "ZwMlHkWKDwM", // Crash Course: Depressive and Bipolar Disorders
    videoTitle: "Depressive and Bipolar Disorders",
    exerciseId: "task-activation",
    exerciseTitle: "Small Task Activation"
  },
  trauma: {
    id: "trauma",
    title: "Trauma (PTSD)",
    icon: "⚡",
    color: "red",
    description: "Post-Traumatic Stress Disorder (PTSD) is a condition triggered by experiencing or witnessing a terrifying event. Symptoms may include flashbacks, nightmares, and severe anxiety.",
    symptoms: [
      "Intrusive distressing memories of the traumatic event",
      "Reliving the event as if it were happening again (flashbacks)",
      "Upsetting dreams or nightmares",
      "Severe emotional distress or physical reactions to something that reminds you of the event",
      "Avoiding places, activities, or people that remind you of the event"
    ],
    quiz: [
      { question: "Do you have repeated, disturbing memories, thoughts, or images of a stressful experience?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you feel very upset when something reminds you of a stressful experience?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you avoid activities or situations because they remind you of a stressful experience?", options: [{text:"No", score:0}, {text:"Rarely", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you feel constantly on guard, watchful, or easily startled?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you feel numb or detached from people, activities, or your surroundings?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] }
    ],
    videoId: "b_n9qegR7C4", // TED-Ed: The biology of PTSD
    videoTitle: "The biology of PTSD",
    exerciseId: "safe-space",
    exerciseTitle: "Safe Space Visualization"
  },
  ocd: {
    id: "ocd",
    title: "Obsessive-Compulsive Disorder",
    icon: "🔁",
    color: "emerald",
    description: "OCD features a pattern of unwanted thoughts and fears (obsessions) that lead you to do repetitive behaviors (compulsions). These interfere with daily activities and cause significant distress.",
    symptoms: [
      "Fear of being contaminated by touching objects others have touched",
      "Doubts that you've locked the door or turned off the stove",
      "Intense stress when objects aren't orderly or facing a certain way",
      "Unwanted thoughts, including aggression, or sexual/religious subjects",
      "Compulsive checking, counting, or washing"
    ],
    quiz: [
      { question: "Do you experience unwanted, intrusive thoughts or images that cause you distress?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you feel driven to perform certain repetitive behaviors or mental acts to reduce your anxiety?", options: [{text:"No", score:0}, {text:"Occasionally", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "How much time do these thoughts or behaviors take up each day?", options: [{text:"None", score:0}, {text:"< 1 Hour", score:1}, {text:"1-3 Hours", score:2}, {text:"> 3 Hours", score:3}] },
      { question: "Do you try to ignore or suppress these thoughts, but find it difficult?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Does performing the repetitive behavior provide relief, but only temporarily?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] }
    ],
    videoId: "DhlRgwdDc-E", // TED-Ed: Debunking the myths of OCD
    videoTitle: "Debunking the myths of OCD",
    exerciseId: "thought-labeling",
    exerciseTitle: "Thought Labeling & ERP Basics"
  },
  eating: {
    id: "eating",
    title: "Eating Disorders",
    icon: "🍽️",
    color: "orange",
    description: "Eating disorders are serious conditions related to persistent eating behaviors that negatively impact your health, your emotions, and your ability to function.",
    symptoms: [
      "Preoccupation with weight, food, calories, carbohydrates, fat grams, and dieting",
      "Refusal to eat certain foods, progressing to restrictions against whole categories of food",
      "Skipping meals or taking small portions of food at regular meals",
      "Extreme concern with body size and shape",
      "Frequent checking in the mirror for perceived flaws in appearance"
    ],
    quiz: [
      { question: "Do you constantly worry about your weight or body shape?", options: [{text:"No", score:0}, {text:"Rarely", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you strictly limit the amount or types of food you eat?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you ever eat a large amount of food in a short period and feel a loss of control?", options: [{text:"Never", score:0}, {text:"Rarely", score:1}, {text:"Sometimes", score:2}, {text:"Often", score:3}] },
      { question: "Do you exercise excessively or use other methods to prevent weight gain after eating?", options: [{text:"No", score:0}, {text:"Rarely", score:1}, {text:"Sometimes", score:2}, {text:"Often", score:3}] },
      { question: "Does how you feel about yourself depend largely on your weight or body shape?", options: [{text:"No", score:0}, {text:"Slightly", score:1}, {text:"Moderately", score:2}, {text:"Extremely", score:3}] }
    ],
    videoId: "wCmnqE_VL78", // SciShow Psych: Why Eating Disorders Are Way More Common Than You Think
    videoTitle: "Understanding Eating Disorders",
    exerciseId: "gratitude",
    exerciseTitle: "Body Gratitude & Acceptance"
  },
  adhd: {
    id: "adhd",
    title: "ADHD / Neurodevelopment",
    icon: "🧩",
    color: "amber",
    description: "ADHD is a neurodevelopmental disorder affecting executive function, characterized by a persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.",
    symptoms: [
      "Failing to give close attention to details or making careless mistakes",
      "Trouble holding attention on tasks or play activities",
      "Not listening when spoken to directly",
      "Fidgeting with or tapping hands or feet, or squirming in seat",
      "Difficulty waiting your turn or interrupting others"
    ],
    quiz: [
      { question: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Very Often", score:3}] },
      { question: "How often do you have difficulty getting things in order when you have to do a task that requires organization?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Very Often", score:3}] },
      { question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Very Often", score:3}] },
      { question: "How often do you interrupt others when they are busy?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Very Often", score:3}] },
      { question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Very Often", score:3}] }
    ],
    videoId: "uU6o2_UFSEY", // TED-Ed: What is ADHD?
    videoTitle: "ADHD Explained: Symptoms and Strategies",
    exerciseId: "grounding",
    exerciseTitle: "Focus & Grounding techniques"
  },
  personality: {
    id: "personality",
    title: "Personality Disorders",
    icon: "🎭",
    color: "pink",
    description: "Personality disorders involve long-term patterns of thoughts and behaviors that are unhealthy and inflexible. The behaviors cause serious problems with relationships and work.",
    symptoms: [
      "Intense fear of abandonment",
      "Pattern of unstable intense relationships",
      "Rapid changes in self-identity and self-image",
      "Periods of stress-related paranoia",
      "Impulsive and risky behavior"
    ],
    quiz: [
      { question: "Do you experience intense fears of abandonment and go to extreme lengths to avoid it?", options: [{text:"Never", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do your relationships alternate between extremes of idealization and devaluation?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you frequently experience sudden and intense shifts in your mood?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Constantly", score:3}] },
      { question: "Do you often feel a chronic sense of emptiness?", options: [{text:"No", score:0}, {text:"Sometimes", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] },
      { question: "Do you have difficulty controlling your anger?", options: [{text:"No", score:0}, {text:"Rarely", score:1}, {text:"Often", score:2}, {text:"Always", score:3}] }
    ],
    videoId: "4E1JiDFxFGk", // Crash Course: Personality Disorders
    videoTitle: "Understanding Personality Disorders",
    exerciseId: "emotion-regulation",
    exerciseTitle: "Emotion Regulation (STOP skill)"
  }
};
