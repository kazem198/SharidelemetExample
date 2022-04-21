import AsyncStorage from "@react-native-async-storage/async-storage";

export const AsyncStorageCount = async () => {
  try {
    let Arr = JSON.parse(await AsyncStorage.getItem("CARD_ITEM"));
    return Arr.length;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getItemBasket = async () => {
  try {
    let Arr = JSON.parse(await AsyncStorage.getItem("CARD_ITEM")) || [];

    return Arr;
  } catch (e) {
    // saving error
    console.log(e);
  }
};
