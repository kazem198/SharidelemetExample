import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  createRef,
  useState,
} from "react";

import {
  Text,
  View,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Context } from "./myContext";
import { getItemBasket } from "./AsyncStorage";
import * as Animatable from "react-native-animatable";
import { Fontisto } from "@expo/vector-icons";

const BasketScreen = () => {
  const conText = useContext(Context);

  const [item, setItem] = useState([]);
  // const myRefs = useRef([]);

  // myRefs.current = item.map((element, i) => myRefs.current[i] ?? createRef());

  const heightScreen = Dimensions.get("window").height;
  const widthScreen = Dimensions.get("window").width;

  const handelDeleteItem = async (data) => {
    // console.log(e);
    // console.log(index.current);
    // setTimeout(async () => {
    try {
      const items = await AsyncStorage.getItem("CARD_ITEM");
      let AllItems = JSON.parse(items);
      const filterItem = AllItems.filter((i) => i.id !== data.id);
      await AsyncStorage.setItem("CARD_ITEM", JSON.stringify(filterItem));
      setItem(filterItem);
      conText.countProduct(filterItem.length);
    } catch (error) {
      console.log(error);
    }
    // }, 500);
  };

  const Price = useCallback(() => {
    return item.reduce(
      (prev, curr) => prev + curr.price,

      0
    );
  }, [item]);

  ////pan Rishponder////
  const animatedValue = useRef(
    new Animated.ValueXY({ x: 0, y: heightScreen - 200 })
  ).current;

  const Pan = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > -50) {
        animatedValue.setValue({ x: 0, y: gestureState.dy });
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < 0) {
        // console.log("kdk");
        Animated.spring(animatedValue.y, {
          toValue: 0,

          tension: 1,
          useNativeDriver: false,
        }).start();
      } else if (gestureState.dy > 0) {
        if (gestureState.moveY > heightScreen - 200) {
          Animated.spring(animatedValue.y, {
            toValue: 0,

            tension: 1,
            useNativeDriver: false,
          }).start();
        }
      }
    },
    onPanResponderGrant: () => {
      animatedValue.extractOffset();
    },
  });
  const animatedStyle = {
    transform: animatedValue.getTranslateTransform(),
  };

  const getData = async () => {
    try {
      const value = await getItemBasket();
      // const value = JSON.parse(await AsyncStorage.getItem("CARD_ITEM"));
      // console.log(value);
      if (value !== null) {
        // value previously stored
        setItem(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
    // setItem(basket);
  }, []);

  const TopText = animatedValue.y.interpolate({
    inputRange: [0, heightScreen - 200],
    outputRange: [heightScreen / 3, 0],
    extrapolate: "clamp",
  });
  const animatedImageMarginLeft = animatedValue.y.interpolate({
    inputRange: [0, heightScreen - 200],
    outputRange: [10, widthScreen / 2 - 100],
    extrapolate: "clamp",
  });
  const animatedImageMarginRight = animatedValue.y.interpolate({
    inputRange: [0, heightScreen - 200],
    outputRange: [10, widthScreen / 2 - 100],
    extrapolate: "clamp",
  });
  const animatedImageMarginTopText = animatedValue.y.interpolate({
    inputRange: [0, heightScreen - 200],
    outputRange: [10, -30],
    extrapolate: "clamp",
  });

  if (item.length === 0) {
    return (
      <Animated.View
        {...Pan.panHandlers}
        style={[
          animatedStyle,
          {
            fontSize: 48,
            color: "black",

            position: "absolute",
            left: 0,
            right: 0,
            backgroundColor: "black",
            flex: 1,
            height: heightScreen,

            justifyContent: "flex-start",
            alignItems: "center",
            zIndex: 100,
          },
        ]}
      >
        <Animated.View
          style={{
            // alignItems: "center",
            // margin: 5,
            top: TopText,
            marginRight: animatedImageMarginRight,
            // marginTop: animatedImageMarginTop,
            // marginTop: 50,
            // position: "absolute",
          }}
        >
          <Fontisto name="shopping-basket" size={48} color="white" />
        </Animated.View>
        <Animated.Text
          style={{
            color: "white",
            // textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            // padding: 5,
            // position: "absolute",
            top: TopText,
            marginLeft: animatedImageMarginLeft,
            marginTop: animatedImageMarginTopText,
          }}
        >
          not items
        </Animated.Text>
      </Animated.View>
    );
  } else
    return (
      <View style={{ marginTop: 20 }}>
        {item.map((obj, index) => {
          return (
            <Animatable.View
              key={index}
              style={styles.cardContiner}
              // ref={myRefs.current[index]}

              // ref={index}
            >
              <TouchableOpacity
                onPress={() => {
                  // myRefs.current[index].current?.lightSpeedOut(200);

                  handelDeleteItem(obj);
                }}
              >
                <Feather name="trash-2" size={24} color="black" />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text style={styles.cardItem}>{obj.title}</Text>

                  <Text>{obj.description}</Text>
                </View>
                <Image source={{ uri: obj.image_url }} style={styles.image} />
              </View>
            </Animatable.View>
          );
        })}
        <Animated.View
          style={[styles.container, animatedStyle, { height: heightScreen }]}
          {...Pan.panHandlers}
        >
          <Animated.View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: "whitesmoke", borderRadius: 10 }}
              >
                <Text
                  style={{
                    color: "violet",
                    padding: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  buy
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "gray", marginRight: 5 }}>price:</Text>
                <Text style={{ color: "gray" }}>{Price()}</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 10,
  },
  cardContiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "skyblue",
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  cardItem: {
    color: "white",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 5,
  },
});
export default BasketScreen;
