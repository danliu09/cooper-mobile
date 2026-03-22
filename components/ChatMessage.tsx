import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";
import { ChartData } from "../services/api";
import { SmecoChart } from "./SmecoChart";

interface Props {
  role: "user" | "assistant";
  text: string;
  chart?: ChartData | null;
  sql?: string | null;
  elapsedMs?: number;
}

export function ChatMessage({ role, text, chart, sql, elapsedMs }: Props) {
  const isUser = role === "user";

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {text}
        </Text>

        {chart && (
          <View style={styles.chartContainer}>
            <SmecoChart data={chart} />
          </View>
        )}

        {sql && !isUser && (
          <View style={styles.sqlContainer}>
            <Text style={styles.sqlLabel}>SQL</Text>
            <Text style={styles.sqlText}>{sql}</Text>
          </View>
        )}

        {elapsedMs !== undefined && !isUser && (
          <Text style={styles.elapsed}>{elapsedMs}ms</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: "#ffffff",
  },
  assistantText: {
    color: Colors.text,
  },
  chartContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  sqlContainer: {
    marginTop: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 8,
  },
  sqlLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  sqlText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: Colors.text,
  },
  elapsed: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "right",
  },
});
