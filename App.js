import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Constants, MapView, Location, Permissions} from 'expo';


class CounterButton extends React.Component {
  state = {
    counter: 0,
  }
  render() {

    return (

        <TouchableOpacity
        style={{ backgroundColor: 'white'}}
        onPress = {() => this.setState({ counter: this.state.counter +1})}>
        <Text style={styles.paragraph}>
          {this.state.counter}
        </Text>
        </TouchableOpacity>
    );
  }
}

export default class App extends React.Component {
  state = {
    counter: 0,
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null
  };

  componentDidMount() {
   this._getLocationAsync();
 };

  _handleMapRegionChange = mapRegion => {
  this.setState({ mapRegion });

};

_getLocationAsync = async () => {
 let { status } = await Permissions.askAsync(Permissions.LOCATION);
 if (status !== 'granted') {
   this.setState({
     locationResult: 'Permission to access location was denied',
   });
 }

 let location = await Location.getCurrentPositionAsync({});
 this.setState({ locationResult: JSON.stringify(location) },
);
  console.log(mapRegion)
 console.log(location.coords.altitude);
};



  render() {
    return (
      <View style={styles.container}>

      <MapView
         style={{ alignSelf: 'stretch', height: 300 }}
         region={this.state.mapRegion}
         onRegionChange={this._handleMapRegionChange}
       />
        <View style={{ flexDirection: 'row'}}>
          <CounterButton/>
          <CounterButton/>
          <CounterButton/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
