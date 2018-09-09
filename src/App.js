import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlayButton from './PlayButton'
import firebase from 'firebase'
import Tone from 'tone'

class App extends Component {
  constructor(props) {
    super(props);

    this.location_id = 1;

    this.state = {
      is_active_location: false,
      is_recording: false,
      is_playing: false,
      server_midi: {},
      local_midi: {}
    };

    this.handleOnPlay = this.handleOnPlay.bind(this);
  }

  componentDidMount() {
    var config = {
      apiKey: "AIzaSyD0cf2mNyPChLU8FAVUhgw2rwVsLjKYty8",
      authDomain: "tune-in-b3959.firebaseapp.com",
      databaseURL: "https://tune-in-b3959.firebaseio.com",
      projectId: "tune-in-b3959",
      storageBucket: "tune-in-b3959.appspot.com",
      messagingSenderId: "219762201728"
    };

    firebase.initializeApp(config);

    console.log(config)

    var dbRef = firebase.database().ref().child('midislim')

    dbRef.on('value', snapshot => {


      var activeLocation = snapshot.val().activelocation
      var serverMidi = snapshot.val().notes

      var newState = {
        is_active_location: this.location_id === activeLocation,
        is_recording: false,
        is_playing: false,
        server_midi: serverMidi,
        local_midi: serverMidi
      }

      console.log(newState)

      this.setState(newState)
    });
  }

  handleOnPlay(isPlaying) {
    
    var newState = this.state    
    var shouldTransitionToRecord = this.state.is_playing === true && isPlaying === false && this.state.is_active_location === true
    console.log(shouldTransitionToRecord)
    if (shouldTransitionToRecord)
    {
      newState.is_recording = true
    }
    else
    {
      Tone.Transport.stop()
    }
    
    newState.is_playing = isPlaying
    this.setState(newState)
    console.log(newState)
  }

  render() {
    return (
      <div className="App">
        <PlayButton 
          disabled={this.state.is_playing || this.state.is_recording || this.state.server_midi[0] === undefined}
          midi={this.state.server_midi}
          onPlay={this.handleOnPlay} />
      </div>
    );
  }
}

export default App;