import Colors from '@/constants/Colors';
import { DOMAINS } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          headerBackground: () => (
            <BlurView
              intensity={60}
              tint={'light'}
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(256,256,256,0.5)' }]}
            />
          ),
          headerTransparent: true,
        }}
      />
      <ScrollView contentContainerStyle={{ paddingTop: headerHeight + 10, padding: 16 }}>
        <Text style={styles.title}>COOPER Domains</Text>
        <Text style={styles.subtitle}>
          Ask questions across SMECO data domains. Each domain has specialized tools and data access.
        </Text>

        {DOMAINS.map((domain) => (
          <TouchableOpacity
            key={domain.name}
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/(auth)/(drawer)/(chat)/new',
                params: { domain: domain.name },
              });
            }}>
            <View style={[styles.iconCircle, { backgroundColor: domain.color }]}>
              <Ionicons name={domain.icon} size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{domain.label}</Text>
              <Text style={styles.cardDesc}>{domain.name} · port {domain.port}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.greyLight} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    backgroundColor: Colors.input,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
export default Page;
