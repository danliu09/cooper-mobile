import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DOMAINS } from "../constants/config";
import { Colors } from "../constants/theme";
import { checkHealth, HealthResponse } from "../services/api";

interface DomainHealth {
  name: string;
  label: string;
  color: string;
  status: "online" | "offline" | "checking";
  details?: HealthResponse;
  error?: string;
}

export default function StatusScreen() {
  const [healthData, setHealthData] = useState<DomainHealth[]>(
    DOMAINS.map((d) => ({ name: d.name, label: d.label, color: d.color, status: "checking" }))
  );
  const [refreshing, setRefreshing] = useState(false);

  const checkAll = useCallback(async () => {
    setRefreshing(true);
    // Reset all to "checking"
    setHealthData((prev) => prev.map((d) => ({ ...d, status: "checking" as const })));

    const results = await Promise.allSettled(
      DOMAINS.map(async (domain) => {
        const health = await checkHealth(domain.name);
        return { name: domain.name, health };
      })
    );

    setHealthData((prev) =>
      prev.map((d) => {
        const result = results.find(
          (r) => r.status === "fulfilled" && r.value.name === d.name
        );
        if (result && result.status === "fulfilled") {
          return { ...d, status: "online" as const, details: result.value.health };
        }
        const rejected = results.find(
          (r) => r.status === "rejected"
        );
        return { ...d, status: "offline" as const, error: "Connection failed" };
      })
    );
    setRefreshing(false);
  }, []);

  useEffect(() => {
    checkAll();
  }, [checkAll]);

  const onlineCount = healthData.filter((d) => d.status === "online").length;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {onlineCount}/{DOMAINS.length} servers online
        </Text>
        <TouchableOpacity onPress={checkAll} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="refresh" size={22} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={healthData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item.status === "online"
                      ? Colors.success
                      : item.status === "offline"
                      ? Colors.error
                      : Colors.warning,
                },
              ]}
            />
            <View style={styles.rowContent}>
              <Text style={styles.domainName}>{item.label}</Text>
              <Text style={styles.domainDetail}>
                {item.status === "online"
                  ? item.details?.display_name || "Connected"
                  : item.status === "checking"
                  ? "Checking..."
                  : item.error || "Unreachable"}
              </Text>
            </View>
            <Text style={styles.port}>:{4000 + DOMAINS.findIndex((d) => d.name === item.name) + 1}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  domainName: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
  },
  domainDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  port: {
    fontSize: 13,
    fontFamily: "monospace",
    color: Colors.textSecondary,
  },
});
