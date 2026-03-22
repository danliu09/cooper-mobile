import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../constants/theme";
import { API_HOST } from "../constants/config";

export default function SettingsScreen() {
  const [serverUrl, setServerUrl] = useState(API_HOST);

  const testConnection = async () => {
    try {
      const res = await fetch(`${serverUrl}:4001/api/health`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        Alert.alert("Connected", "Successfully reached the COOPER server.");
      } else {
        Alert.alert("Error", `Server returned HTTP ${res.status}`);
      }
    } catch (e: any) {
      Alert.alert("Connection Failed", e.message || "Could not reach server");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server Connection</Text>
        <Text style={styles.label}>API Server URL</Text>
        <TextInput
          style={styles.input}
          value={serverUrl}
          onChangeText={setServerUrl}
          placeholder="http://hostname-or-ip"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Text style={styles.hint}>
          The REST API gateway address. Each domain uses its own port (4001-4010).
        </Text>
        <TouchableOpacity style={styles.button} onPress={testConnection}>
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>SMECO COOPER Mobile</Text>
        <Text style={styles.aboutDetail}>
          AI-powered data warehouse access for Southern Maryland Electric Cooperative.
        </Text>
        <Text style={styles.aboutDetail}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.surface,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  aboutDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
