import { defaultStyles } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

/**
 * Purchase modal gutted — RevenueCat removed.
 * Redirects back immediately.
 */
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, []);

  return (
    <View style={defaultStyles.pageContainer}>
      <Text>Redirecting…</Text>
    </View>
  );
};
export default Page;
