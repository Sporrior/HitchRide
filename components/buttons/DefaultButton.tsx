import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const DefaultButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={[styles.button, styles.default]} onPress={onPress}>
    <Text style={[styles.text, styles.defaultText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  default: {
    backgroundColor: "#CDE26D",
  },
  defaultText: {
    color: "white",
  },
});

export default DefaultButton;
