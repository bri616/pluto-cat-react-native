import React, { Component } from 'react';
import { AppRegistry, Image, Picker, StyleSheet, Text, View } from 'react-native';

var SampleApp = React.createClass({
  componentWillMount: function() {
    this.setState({ showLoading: true});
    
    fetch('https://spreadsheets.google.com/feeds/list/14e4-F9rcLuyZ71so6S4E-QrcXHTjO8907BVZiR3mH2k/od6/public/basic?alt=json')
      .then((response) => response.json())
      .then((responseJson) => {
        const googleSheetEntry = responseJson.feed.entry
        const wetFoods = []
        for (var i = 0; i < googleSheetEntry.length; i++) {
          wetFoods[i] = {
            title: googleSheetEntry[i].title.$t,
            kCal: parseFloat(
              googleSheetEntry[i].content.$t.split(" ")[1]
            )
          }
        }
        this.setState({
          showLoading: false,
          wetFoods: wetFoods
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, 
  render: function() {
    const pic = {
      uri: 'http://bri616.github.io/fat-cat/gentlemancat.png'
    };
    if(this.state.showLoading === true) {
      return (
        <Text>Loading...</Text>
      );
    } else { 
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 2}}>
            <Text style={{flex: 3, fontSize: 50, fontFamily: 'abrilfatface', textAlign: 'center', color: 'black' }}>Plutocat</Text>
            <Image source={pic} style={{flex: 10}} resizeMode={Image.resizeMode.contain}/>
          </View>
          <View style={{flex: 2}}>
            <Picker
              selectedValue={this.state.selectedFood}
              onValueChange={
                (food) => (this.setState({selectedFood: food}))
              }
            >
                {this.state.wetFoods.map((food, i) => {
                  return <Picker.Item
                            value={food.kCal}
                            label={food.title}
                            key={i}
                         /> 
                })}
            </Picker>
          </View>
        </View>
      );
    }
  }
});

AppRegistry.registerComponent('AwesomeProject', () => SampleApp);
