// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

function MovieList({ navigation, route }) {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    fetch(" http://www.omdbapi.com/?&apikey=28f4dae9&s=superman")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.Search);
        setMasterDataSource(responseJson.Search);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank

    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.Title
          ? item.Title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log(newData);
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource

      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {"Poster: \n" + item.Poster}
        {"\n"}
        {"Title: " + item.Title.toUpperCase()}
        {"\n"}
        {"Year: " + item.Year}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  const getItem = (item) => {
    navigation.navigate("Details", { id: item.imdbID });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction("")}
          placeholder="Type Here..."
          value={search}
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
}

function MovieDetail({ navigation, route }) {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  console.log(route.params?.id);

  useEffect(() => {
    fetch(" http://www.omdbapi.com/?&apikey=28f4dae9&s=superman")
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.Search);

        for (let i = 0; i < responseJson.Search.length; i++) {
          if (responseJson.Search[i].imdbID == route.params?.id) {
            console.log(responseJson.Search[i]);
            setFilteredDataSource([responseJson.Search[i]]);
            console.log();
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const ItemView = ({ item }) => {
    console.log(item);
    return (
      // Flat List Item
      <Text style={styles.itemStyle}>
        {"Poster: \n" + item.Poster}
        {"\n"}
        {"Title: " + item.Title.toUpperCase()}
        {"\n"}
        {"Year: " + item.Year}
        {"\n"}
        {"Genre: " + item.Genre}
        {"\n"}
        {"IMDB: " + item.imdbID}
        {"\n"}
        {"plot " + item.plot}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={filteredDataSource}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  itemStyle: {
    padding: 10,
  },
});

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        <Stack.Screen name="Movie List" component={MovieList} />
        <Stack.Screen name="Details" component={MovieDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
