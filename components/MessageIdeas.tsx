import Colors from '@/constants/Colors';
import { Text, ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';

const PredefinedMessages = [
  { title: 'Show outage summary', text: 'for the past 7 days' },
  { title: 'What is the current', text: 'SAIDI and SAIFI this year?' },
  { title: 'List top 10 feeders', text: 'by customer minutes interrupted' },
];

type Props = {
  onSelectCard: (message: string) => void;
};

const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}>
        {PredefinedMessages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSelectCard(`${item.title} ${item.text}`)}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.title}</Text>
            <Text style={{ color: Colors.grey, fontSize: 14 }}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
export default MessageIdeas;
