import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import firebase from"firebase"
SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      light_theme:true,
      name:""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
async fetchUser (){
  let theme,name,image
  await firebase.database().ref("/users/"+firebase.auth().currentUser.uid)
  .on("value",function(snapshot){
    theme=snapshot.val().current_theme
    name=`${snapshot.val().first_name}${snapshot.val().last_name}`
  })
  this.setState({
    light_theme:theme==="light"?true:false,
    isEnabled:theme==="light"?false:true
  })
}
toggleSwitch(){
  const previous_state=this.state.isEnabled
  const theme=!this.state.isEnabled?"dark":"light"
 var updates ={}
 updates["/users/"+firebase.auth().currentUser.uid+"/current_theme"]=theme
 firebase.database().ref().update(updates)
 this.setState({isEnabled:!previous_state,light_theme:previous_state})
}
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={styles.container}>
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image source={require("../assets/logo.png")}
              style={styles.iconImage}>

              </Image>
            </View>
            <Text style={styles.appTitleText}>
              StorytellingApp
            </Text>
          </View>
           <View style={styles.profileImage}>
            <Image sources={require("../assets/profile_img.png")}
            style={styles.profileImg}></Image>
            <Text style={styles.nameText}>{this.state.name}</Text>
           </View>
           <View style={styles.themeContainer}>
            <Text style={styles.themeText}>dark Theme</Text>
            <Switch style={{transform:[{scaleX:1.3},{scaleY:1.3}]}}
            trackColor={{false:"#767577",true:"white"}}
            thumbColor={this.state.isEnabled?"#ee8249":"#F4f3f4"}
            Ios_backgroundColor="#3e3e3e"
            onValueChange={()=>this.toggleSwitch()}
            value={this.state.isEnabled}></Switch>
           </View>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  appTitle:{
    flex:0.07,
    flexDirection:"row"
  },
  profileImage:{
    flex:0.5,
    justifyContent:"center",
    alignItems:"center"
  },
  profileImg:{
    width:140,
    height:140,
    borderRadius:70
  },
  nameText:{
    color:"white",
    fontSize:40,
    marginTop:10
  },
  themeContainer:{
    flex:0.2,
    flexDirection:"row",
    justifyContent:"center",
    marginTop:20
  },
  themeText:{
    color:"white",
    fontSize:30,
    marginRight:15
  }
});
