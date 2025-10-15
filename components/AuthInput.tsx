import React from "react";
import { Text, TextInput, View } from "react-native";

interface AuthInputProps {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export default function AuthInput({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}: AuthInputProps) {
  return (
    <View className="w-full mb-4">
      <Text className="text-textPrimary text-base mb-2">{label}</Text>
      <TextInput
        className="bg-light-100/30 border border-light-300 rounded-xl px-4 py-3 text-textPrimary"
        placeholder={placeholder}
        placeholderTextColor="#9CA4AB"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
