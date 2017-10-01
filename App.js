import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, CameraRoll } from "react-native";
import { Constants, MapView, Location, Permissions, Camera } from "expo";
import ExpoTHREE from "expo-three";

const THREE = require("three");

// `THREEView` wraps a `GLView` and creates a THREE renderer that uses
// that `GLView`. The class needs to be constructed with a factory so that
// the `THREE` module can be injected without expo-sdk depending on the
// `'three'` npm package.

class CounterButton extends React.Component {
  state = {
    counter: 0
  };
  render() {
    return (
      <TouchableOpacity
        style={{ backgroundColor: "white" }}
        onPress={() => this.setState({ counter: this.state.counter + 1 })}
      >
        <Text style={styles.paragraph}>{this.state.counter}</Text>
      </TouchableOpacity>
    );
  }
}

export default class App extends React.Component {
  state = {
    counter: 0,
    mapRegion: {
      latitude: 51.52215262,
      longitude: -0.224044,
      latitudeDelta: 0.4695249,
      longitudeDelta: 1.0413547
    },
    locationResult: null,
    imageUri: 'https://images.plurk.com/2A3ca9h910J2q0IRdd8bQE.jpg',
    topText: '',
    bottomText: '',
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  componentDidMount() {
    this._getLocationAsync();
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
    console.log("mapregion");
    console.log(mapRegion);
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });

    console.log(location.coords.altitude);
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <ScrollView>
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                height: 500,
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>

        <View style={styles.container}>

          <TextInput
            style={styles.inputText}
            onChangeText = {(text) => this.setState({topText: text})}
            value={this.state.text}
          />

          <View
            style={{ margin: 5}}
            ref={(ref) => this.memeView = ref}
          >
            <Image
              source={{
                uri: this.state.imageUri
              }}
              style={{ width: 400, height: 400 }}
            />
            <Text
              style={[styles.text, {top:5}]}>
              {this.state.topText}
            </Text>
            <Text
              style={[styles.text, {bottom:5}]}>
              {this.state.bottomText}
            </Text>
          </View>

          <TextInput
            style={styles.inputText}
            onChangeText = {(text) => this.setState({bottomText: text})}
            value={this.state.bottomText}
          />


          <TouchableOpacity
            style={styles.button}
            onPress={this._onPick}>
            <Text>hello, world</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={this._onTake}>
            <Text>take a pic!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={this._onSave}>
            <Text>Save</Text>
          </TouchableOpacity>

          <MapView
            style={{ alignSelf: "stretch", height: 300 }}
            region={this.state.mapRegion}
            onRegionChange={this._handleMapRegionChange}
          />

          <View style={{ flexDirection: "row" }}>
            <CounterButton />
            <CounterButton />
            <CounterButton />
          </View>




        </View>
        </ScrollView>
      );
  }}

  _onPick = async () => {
    const {
      cancelled,
      uri,
    } = await Expo.ImagePicker.launchImageLibraryAsync();
    if (!cancelled){
      this.setState({imageUri: uri})
    }
    console.log('uri', uri)
  }

  _onSave = async () => {
    // CameraRoll.saveToCameraRoll('/private/var/mobile/Containers/Data/Application/421EC44E-4C8C-4248-8B37-0059B581B734/tmp/ReactABI21_0_0Native/CDF0AA2B-0674-432D-BB98-8CD0C1F449FA.png')
    const uri = await Expo.takeSnapshotAsync(this.memeView);
    console.log('uri2: ', uri);
    // await CameraRoll.saveToCameraRoll(uri);
    // await CameraRoll.saveToCameraRoll('/private/var/mobile/Containers/Data/Application/421EC44E-4C8C-4248-8B37-0059B581B734/tmp/ReactABI21_0_0Native/CDF0AA2B-0674-432D-BB98-8CD0C1F449FA.png');
    // CameraRoll.saveToCameraRoll((await Expo.ImagePicker.launchCameraAsync({})).uri);
  }

  _onTake = async () => {
    const {
      cancelled,
      uri,
    } = await Expo.ImagePicker.launchCameraAsync();
    if (!cancelled) {
      this.setState({ imageUri: uri });
    }
    console.log('uri: ', uri);
  }
}

const styles = StyleSheet.create({
  inputText: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'stretch',
    margin: 10,
    padding: 5,
    color: 'gray'
  },
  text: {
    position: 'absolute',
    left:50,
    right:50,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 50,
    fontWeight: '900',
    textAlign: 'center'
  },
  button: {
    padding: 5,
    backgroundColor: "#ddd",
    margin: 5
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  }
});
