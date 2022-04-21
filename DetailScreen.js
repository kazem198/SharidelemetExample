import {
  StyleSheet,
  Text,
  ScrollView,
  PanResponder,
  Animated,
  Button,
  TouchableOpacity,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context } from "./myContext";
import { getItemBasket } from "./AsyncStorage";

const DetailsScreen = ({ route, navigation }) => {
  const [basket, setBasket] = useState([]);
  const context = useContext(Context);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (evt, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      // if (gestureState.dx > 150 || gestureState.dx < -100) {
      //   context.setToggleShow(false);
      //   navigation.navigate("List");
      // }
    },

    onPanResponderRelease: (evt, gestureState) => {
      console.log(gestureState);
      // context.setToggleShow(false);
      if (gestureState.dx > 80) {
        // context.setToggleShow(false);
        navigation.navigate("List");
      } else {
        // pan.setValue({ x: 0, y: 0 });
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          // toValue: 0,
          tension: 1,
          useNativeDriver: false,
        }).start();
      }
      // navigation.navigate("List");
    },
    onPanResponderGrant: () => {
      pan.flattenOffset();
    },
  });

  const { item } = route.params;

  const animatedStyle = {
    transform: pan.getTranslateTransform(),
  };

  const addToCard = async (value) => {
    try {
      let Arr = JSON.parse(await AsyncStorage.getItem("CARD_ITEM")) || [];
      // console.log(typeof Arr);
      // console.log(Arr);
      if (!Arr.some((item) => item.id === value.id)) Arr.push(value);

      const jsonValue = JSON.stringify(Arr);
      await AsyncStorage.setItem("CARD_ITEM", jsonValue);
      // console.log(Arr.length);
      context.countProduct(Arr.length);
      setBasket(Arr);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  const ItemBasket = async () => {
    const AllItem = await getItemBasket();
    setBasket(AllItem);
  };

  useEffect(() => {
    ItemBasket();
  }, []);
  return (
    <>
      <Animated.View
        style={[styles.list, animatedStyle]}
        {...panResponder.panHandlers}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <SharedElement id={`item.${item.id}.image_url`}>
            <Animated.Image
              source={{ uri: item.image_url }}
              resizeMode="cover"
              style={styles.image}
            />
          </SharedElement>

          <SharedElement id={`item.${item.id}.title`} style={styles.tilte}>
            <Text style={styles.titleText}>{item.title}</Text>
          </SharedElement>

          <SharedElement id={`item.${item.id}.desc`} style={styles.desc}>
            <Text style={styles.descText}>{item.description}</Text>
          </SharedElement>

          <Text style={styles.iconName}>{item.iconName}</Text>
        </ScrollView>
      </Animated.View>
      <TouchableOpacity
        onPress={() => {
          addToCard(item);
        }}
      >
        <Text
          style={{
            backgroundColor: "pink",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            padding: 10,
            lineHeight: 15,
          }}
        >
          Add to card
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    margin: 15,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    position: "relative",
  },
  image: {
    width: 400,
    height: 400,
  },
  desc: {
    color: "white",
    marginTop: 10,
  },
  descText: {
    color: "pink",
    fontWeight: "bold",
    fontSize: 23,
    backgroundColor: "rgba(0,0,0,.5)",
    padding: 5,
  },
  tilte: {
    color: "white",
    marginTop: 10,
  },
  titleText: {
    color: "whitesmoke",
    fontWeight: "bold",
    fontSize: 23,
    backgroundColor: "rgba(0,0,0,.8)",
    padding: 5,
    textAlign: "center",
  },
  iconName: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 23,
    backgroundColor: "rgba(0,0,0,.5)",
    padding: 5,
    textAlign: "center",
    margin: 2,
  },
});

DetailsScreen.sharedElements = (route) => {
  const { item } = route.params;
  return [
    {
      id: `item.${item.id}.image_url`,
      animation: "move",
      resize: "clip",
    },
    {
      id: `item.${item.id}.title`,
      animation: "fade",
      resize: "clip",
    },
    {
      id: `item.${item.id}.desc`,
      animation: "fade",
      resize: "auto",
    },
  ];
};

export default DetailsScreen;
