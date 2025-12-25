import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class SimpleClassLogin extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Class Component Login</Text>
      </View>
    );
  }
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

export default SimpleClassLogin;
