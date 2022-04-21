import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import DetailsScreen from "./DetailScreen";
import ListScreen from "./ListScreen";
import "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { AsyncStorageCount } from "./AsyncStorage";
import { useEffect, useState, useRef } from "react";
import { Context } from "./myContext";
import * as Animatable from "react-native-animatable";
import BasketScreen from "./BasketScreen";

const Stack = createSharedElementStackNavigator();
const options = {
  headerBackTitleVisible: false,
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
};

const App = () => {
  const Ref = useRef();
  const [count, setCount] = useState(0);
  const [ToggleShow, setToggleShow] = useState(false);

  const CountBasket = async () => {
    const count = await AsyncStorageCount();
    setCount(count);
  };

  useEffect(() => {
    CountBasket();
  }, []);

  const countProduct = (count) => {
    setCount(count);
    Ref.current?.shake(500);
  };
  const ToggleShowBasket = (state) => {
    // console.log(state);
    // if(ToggleShow)
    setToggleShow(!ToggleShow);

    // if (!state) setToggleShow(state);
  };
  const headerRight = (navigation, route) => {
    return (
      <Animatable.View ref={Ref}>
        <TouchableOpacity
          onPress={() => {
            if (route.name == "Basket") navigation.goBack();
            else navigation.navigate("Basket");
          }}
          style={{
            margin: 5,
            // borderColor: "black",
            // borderWidth: 2,
            borderRadius: 50,
            padding: 5,
          }}
        >
          <Text
            style={{
              position: "absolute",
              right: 1,
              bottom: 18,
              color: "red",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {count}
          </Text>
          <Fontisto name="shopping-basket-add" size={20} color="blue" />
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <Context.Provider
      value={{ countProduct, isShowBasket: ToggleShow, setToggleShow }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="List"
          screenOptions={({ route, navigation }) => ({
            headerRight: () => headerRight(navigation, route),
            headerLeft: () => null,
          })}
        >
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen
            name="Detail"
            component={DetailsScreen}
            options={() => options}
          />
          <Stack.Screen name="Basket" component={BasketScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};
export default App;
