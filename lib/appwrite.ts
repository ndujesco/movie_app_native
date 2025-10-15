// lib/appwrite.ts
import { Client, Databases, TablesDB } from "react-native-appwrite";




// env vars (Expo should expose these with EXPO_PUBLIC_* prefix)
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_PLATFORM!; // e.g. com.yourcompany.app
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!

// init client + TablesDB
const client = new Client()
  .setEndpoint(ENDPOINT) // include /v1 in endpoint if not already present in env
  .setProject(PROJECT_ID)
  .setPlatform(PLATFORM);

export const tablesDB = new TablesDB(client);
export const databases = new Databases(client);

