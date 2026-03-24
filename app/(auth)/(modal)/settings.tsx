import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { DOMAINS, PROXY_BASE_URL, USE_PROXY, DIRECT_HOST } from '@/constants/config';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

const Page = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>COOPER API</Text>
      <Text style={styles.value}>
        {USE_PROXY ? PROXY_BASE_URL : DIRECT_HOST}
      </Text>

      <Text style={[styles.label, { marginTop: 24 }]}>Domains</Text>
      {DOMAINS.map((d) => (
        <View key={d.name} style={styles.domainRow}>
          <View style={[styles.dot, { backgroundColor: d.color }]} />
          <Text style={styles.domainLabel}>{d.label}</Text>
          <Text style={styles.domainPort}>:{d.port}</Text>
        </View>
      ))}

      <View style={{ marginTop: 32 }}>
        <Button title="Sign Out" onPress={() => signOut()} color={Colors.grey} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    color: Colors.grey,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  domainLabel: {
    fontSize: 15,
    flex: 1,
  },
  domainPort: {
    fontSize: 13,
    color: Colors.greyLight,
  },
});
export default Page;
