import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const SplashScreen = ({ navigation, route }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    console.log('SplashScreen mounted, fromLogout:', route?.params?.fromLogout);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Navigate to Welcome screen after 3 seconds
    const timer = setTimeout(() => {
      // If coming from logout, navigate to Welcome screen
      if (route?.params?.fromLogout) {
        console.log('Navigating to Welcome screen after logout');
        navigation.replace('Welcome');
      } else {
        // Otherwise, check auth state and navigate accordingly
        console.log('Checking auth state...');
        navigation.replace('Welcome');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>ہم دم</Text>
        <Text style={styles.subtitle}>آپ کے جذبات کا ہم سفر</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default SplashScreen; 