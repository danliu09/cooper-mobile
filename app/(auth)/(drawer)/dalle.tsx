import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { DOMAINS } from '@/constants/config';
import { checkHealth } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

type DomainStatus = 'checking' | 'online' | 'offline';

const Page = () => {
  const [statuses, setStatuses] = useState<Record<string, DomainStatus>>({});
  const router = useRouter();

  useEffect(() => {
    // Initialize all as checking
    const initial: Record<string, DomainStatus> = {};
    DOMAINS.forEach((d) => (initial[d.name] = 'checking'));
    setStatuses(initial);

    // Check health in parallel
    DOMAINS.forEach((d) => {
      checkHealth(d.name)
        .then(() => setStatuses((prev) => ({ ...prev, [d.name]: 'online' })))
        .catch(() => setStatuses((prev) => ({ ...prev, [d.name]: 'offline' })));
    });
  }, []);

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen options={{ headerTitle: 'COOPER Domains' }} />
      <ScrollView contentContainerStyle={styles.list}>
        {DOMAINS.map((d) => {
          const status = statuses[d.name] || 'checking';
          return (
            <TouchableOpacity
              key={d.name}
              style={styles.card}
              onPress={() => {
                // Navigate to new chat with this domain pre-selected
                router.push({
                  pathname: '/(auth)/(drawer)/(chat)/new',
                  params: { domain: d.name },
                });
              }}>
              <View style={[styles.iconCircle, { backgroundColor: d.color }]}>
                <Ionicons name={d.icon} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{d.label}</Text>
                <Text style={styles.cardSub}>{d.name}</Text>
              </View>
              {status === 'checking' && <ActivityIndicator size="small" />}
              {status === 'online' && (
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              )}
              {status === 'offline' && (
                <View style={[styles.statusDot, { backgroundColor: '#e74c3c' }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSub: {
    fontSize: 13,
    color: Colors.grey,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
export default Page;
