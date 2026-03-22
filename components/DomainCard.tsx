import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

interface Props {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  status?: "online" | "offline" | "unknown";
  onPress: () => void;
}

export function DomainCard({ label, icon, color, status = "unknown", onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                status === "online" ? Colors.success : status === "offline" ? Colors.error : Colors.border,
            },
          ]}
        />
        <Text style={styles.statusText}>
          {status === "online" ? "Online" : status === "offline" ? "Offline" : "..."}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "47%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
