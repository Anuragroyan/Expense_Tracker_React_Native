import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../constants/color";

function CustomButton({ children, onPress, mode, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: GlobalColors.colors.primary500,
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: GlobalColors.colors.accent500,
    textAlign: "center",
  },
  flatText: {
    color: GlobalColors.colors.primary200,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: GlobalColors.colors.primary100,
    borderRadius: 4,
  },
});
