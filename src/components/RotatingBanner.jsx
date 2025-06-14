import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView, Text } from 'react-native'; 

const banners = [
  { id: '1', imagem: require('../../assets/bannersnacks001.png') },
  { id: '2', imagem: require('../../assets/banner19.png') },
  { id: '3', imagem: require('../../assets/bannervinhos001.png') },
 
];

const { width } = Dimensions.get('window');

export default function RotatingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null); 
  const userInteracting = useRef(false); 

  const startInterval = () => {
    clearInterval(intervalRef.current); 

    if (!userInteracting.current) {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000); 
    }
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []); 

  useEffect(() => {

    if (!userInteracting.current && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: currentIndex * width, animated: true });
    }
  }, [currentIndex]); 
  const handleMomentumScrollEnd = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    userInteracting.current = false; 
    if (index !== currentIndex) {
        setCurrentIndex(index); 
    }
    startInterval(); 
  };
  
  const handleScrollBeginDrag = () => {
      userInteracting.current = true; 
      clearInterval(intervalRef.current);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag} 
        onMomentumScrollEnd={handleMomentumScrollEnd} 
        style={styles.scrollViewStyle}
      >
        {banners.map((banner) => (
          <View key={banner.id} style={styles.bannerWrapper}>
            {banner.imagem ? (
                <Image
                    source={banner.imagem}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.bannerImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>Banner</Text>
                </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.indicatorActive : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  scrollViewStyle: {
    
  },
  bannerWrapper: {
    width: width, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15, 
  },
  bannerImage: {
    width: '105%', 
    height: 150,
    borderRadius: 16,
  },
  placeholderImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 10, 
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: 'white', 
  },
});

