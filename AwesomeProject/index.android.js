import React, { Component } from 'react';
import { AppRegistry, Image, Picker, StyleSheet, Text, TextInput, View } from 'react-native';

var SampleApp = React.createClass({
  getInitialState: function() {
    return {
        kcalPerFeeding: 160,
      kcalPerKgDryFood: 3825,
    };
  },
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
  calculateDryFood: function() {
    const amountOfWetFood = this.state.text;
    const kcalWetFood = this.state.selectedFood*amountOfWetFood;
    // kgDryFood = (kcalPerFeeding - kcalWetFood) / kcalPerKgDryFood; 
    const kgDryFood = (this.state.kcalPerFeeding - kcalWetFood/1000) / this.state.kcalPerKgDryFood;
    if (isNaN(kgDryFood*1000) === true) {
        return 0;
    }
    return Math.round(kgDryFood*1000);
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
          <View style={{flex: 5}}>
            <Text style={styles.title}>PlutoCat</Text>
            <Image source={pic} style={{flex: 10}} resizeMode={Image.resizeMode.contain}/>
          </View>        
          <View style={{flex: 4}}>
            <View style={{flex: 2, flexDirection: 'row'}}>   
                <View style={styles.numberBox}>                      
                <Text style={{flex: 1}}>Wet food in g:</Text>
                <TextInput style={{flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}} onChangeText={(text) => this.setState({text})} keyboardType='numeric'/>
                    </View>
                    <View style={styles.numberBox}>
                        <Text style={{flex: 1}}>Dry food in g:</Text>
                <TextInput style={{flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}} value={this.calculateDryFood().toString()} />
              </View>
            </View>
                        <View style={styles.pickerContainer}>
              <Picker
                    itemStyle={{fontSize: 25}}
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
            <View style={styles.footerContainer}>
                <Text>Image by: xxx from the noun project</Text>
              <Text>Codes by: bri and ian </Text>
            </View>
          </View>
        </View>
      );
    }
  }
});

const styles = StyleSheet.create({
  title: {
    flex: 3,
    fontFamily: 'abrilfatface',
    fontSize: 50,
    textAlign: 'center',
    color: 'black',
  },
  numberBox: {
    flex: 1,
    paddingTop:5,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10, 
    borderRadius:10,
    borderWidth: 3,
    borderColor: 'black',
    margin: 3,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop:5,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10, 
    borderRadius:10,
    borderWidth: 3,
    borderColor: 'black',
    margin: 3,
  },
  footerContainer: {
    flex: 2,
    justifyContent: 'flex-end',
  },
});

AppRegistry.registerComponent('AwesomeProject', () => SampleApp);
