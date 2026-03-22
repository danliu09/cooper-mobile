import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { DOMAINS } from "../constants/config";
import { Colors } from "../constants/theme";
import { DomainCard } from "../components/DomainCard";
import { checkHealth } from "../services/api";

type DomainStatus = Record<string, "online" | "offline" | "unknown">;

export default function DomainsScreen() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<DomainStatus>({});

  useEffect(() => {
    // Check health of all domains on mount
    DOMAINS.forEach(async (domain) => {
      try {
        await checkHealth(domain.name);
        setStatuses((prev) => ({ ...prev, [domain.name]: "online" }));
      } catch {
        setStatuses((prev) => ({ ...prev, [domain.name]: "offline" }));
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Select a domain to start asking questions</Text>
      <View style={styles.grid}>
        {DOMAINS.map((domain) => (
          <DomainCard
            key={domain.name}
            label={domain.label}
            icon={domain.icon}
            color={domain.color}
            status={statuses[domain.name] || "unknown"}
            onPress={() => router.push(`/domain/${domain.name}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
