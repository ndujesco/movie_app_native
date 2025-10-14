// global.d.ts or types.d.ts

// 1. Declare the module for all common image file extensions
declare module '*.png' {
  // 2. Specify the type of the imported variable
  // In React Native/Expo, image imports resolve to a number (the asset ID).
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}