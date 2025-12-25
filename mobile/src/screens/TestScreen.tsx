import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>App funcionando!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#00D9BC',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
