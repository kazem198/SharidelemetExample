import { useCallback, useContext, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  FlatList,
  Text,
  Animated,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
// import { getItemBasket } from "./AsyncStorage";
// import { Context } from "./myContext";

const ListScreen = ({ navigation }) => {
  const data = [
    {
      id: 1,
      title: "Manarola, Italy",
      description: "The Cliffs of Cinque Terre",
      image_url:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80",
      iconName: "location-pin",
      price: 240,
    },
    {
      id: 2,
      title: "Venezia, Italy",
      description: "Rialto Bridge, Venezia, Italy",
      image_url:
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=630&q=80",
      iconName: "location-pin1",
      price: 120,
    },
    {
      id: 3,
      title: "Prague, Czechia",
      description: "Tram in Prague",
      image_url:
        "https://images.unsplash.com/photo-1513805959324-96eb66ca8713?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      iconName: "location-pin2",
      price: 400,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(key) => key.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.push("Detail", { item })}
              key={item.id}
            >
              <View style={styles.list}>
                <SharedElement id={`item.${item.id}.image_url`}>
                  <Image
                    source={{ uri: item.image_url }}
                    resizeMode="cover"
                    style={styles.image}
                  />
                </SharedElement>

                <SharedElement
                  id={`item.${item.id}.title`}
                  style={styles.tilte}
                >
                  <Text style={styles.titleText}>{item.title}</Text>
                </SharedElement>

                <SharedElement id={`item.${item.id}.desc`} style={styles.desc}>
                  <Text style={styles.descText}>{item.description}</Text>
                </SharedElement>
              </View>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    // backgroundColor: "black",
    flex: 1,
    position: "relative",
  },
  list: {
    margin: 15,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    position: "relative",
  },
  image: {
    width: 400,
    height: 200,
  },
  desc: {
    position: "absolute",
    color: "white",
    bottom: 0,
  },
  descText: {
    color: "pink",
    fontWeight: "bold",
    fontSize: 23,
    backgroundColor: "rgba(0,0,0,.5)",
    padding: 5,
  },
  tilte: {
    position: "absolute",
    color: "white",
    // top: -200,
  },
  titleText: {
    color: "whitesmoke",
    fontWeight: "bold",
    fontSize: 23,
    backgroundColor: "rgba(0,0,0,.8)",
    padding: 5,
  },
});

export default ListScreen;
