import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const WhiteButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={[styles.button, styles.white]} onPress={onPress}>
    <Text style={[styles.text, styles.whiteText]}>{title}</Text>
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
  white: {
    backgroundColor: "white",
    borderColor: "white",
  },
  whiteText: {
    color: "#CDE26D",
  },
});

export default WhiteButton;
