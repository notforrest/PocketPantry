import { View, Text, StyleSheet } from "react-native";

type StepProps = {
  index: number;
  currentStep: number;
};

type StepperProps = {
  steps: number;
  currentStep: number;
};

const ScannerSteps = ["Parse", "Confirm"];

const Step = ({ index, currentStep }: StepProps) => {
  return (
    <View style={styles.stepContainer}>
      <View
        style={[styles.step, index + 1 === currentStep && styles.currentStep]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ color: "black" }}>{ScannerSteps[index]}</Text>
    </View>
  );
};

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {[...Array(steps)].map((_, index) => (
          <>
            <Step key={index} index={index} currentStep={currentStep} />
            {index < steps - 1 && (
              <View
                style={{
                  backgroundColor: "lightgray",
                  height: 2,
                  width: 40,
                  left: 3,
                  bottom: 10,
                }}
              />
            )}
          </>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepContainer: {
    alignItems: "center",
    gap: 8,
  },
  step: {
    alignItems: "center",
    backgroundColor: "lightgray",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginHorizontal: 4,
    width: 32,
  },
  currentStep: {
    backgroundColor: "lightgreen",
  },
});

export default Stepper;
