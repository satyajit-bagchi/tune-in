import React, { Component } from 'react';
import './App.css';
import PlayButton from './PlayButton'
import firebase from 'firebase'
import Tone from 'tone'
import StatusIndicator from './StatusIndicator';
import RecordingCompleteOptionsPane from './RecordingCompleteOptionsPane';
import Keyboard from './Keyboard';

class App extends Component {
  constructor(props) {
    super(props);

    this.location_id = 1;
    this.recording_interval = 10;

    this.state = {
      is_ready: false,
      is_active_location: false,
      is_recording: false,
      is_playing: false,
      is_playing_back: false,
      recording_complete: false,
      server_midi: {},
      local_midi: {},
      playTimeRemaining: 0,
      recordTimeRemaining: this.recording_interval
    };

    this.synth = new Tone.PolySynth(8).toMaster();

    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnPlayback = this.handleOnPlayback.bind(this);
    this.handleOnReset = this.handleOnReset.bind(this);
    this.handleOnShare = this.handleOnShare.bind(this);
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

      var finishTime = 0

      var lastIndex = this.state.server_midi.length - 1
      if (lastIndex > -1) {
        var finalNote = this.state.server_midi[lastIndex]
        finishTime = finalNote.time + finalNote.duration
      }

      var newState = {
        is_ready: true,
        is_active_location: this.location_id === activeLocation,
        is_recording: false,
        is_playing: false,
        recording_complete: false,
        server_midi: serverMidi,
        local_midi: serverMidi,
        playTimeRemaining: finishTime
      }

      this.setState(newState)
    });
  }

  handleOnPlay() {
    var finishTime = 0

    var lastIndex = this.state.server_midi.length - 1
    if (lastIndex > -1) {
      var finalNote = this.state.server_midi[lastIndex]
      finishTime = finalNote.time + finalNote.duration
    }

    var newState = this.state
    newState.is_playing = true
    newState.playTimeRemaining = finishTime
    this.setState(newState);

    var obj = this

    new Tone.Part(function (time, note) {
      obj.synth.triggerAttackRelease(note.name, note.duration, time, 1)

    }, this.state.server_midi).start();

    var timer = new Tone.Loop(function (time) {
      obj.state.playTimeRemaining = obj.state.playTimeRemaining - 0.1
      obj.setState(obj.state)
      if (obj.state.playTimeRemaining < 1) {
        timer.stop()
      }
      console.log('player tick')
    }, 0.1).start();

    new Tone.Event(function (time, note) {
      var newState = obj.state
      newState.is_playing = false
      obj.setState(newState)
      if (obj.state.is_active_location) {
        obj.startRecording()
      }
      else {
        Tone.Transport.stop()
      }
    }).start(finishTime);

    Tone.Transport.start();
  }

  handleOnPlayback() {
    var newState = this.state
    newState.is_playing_back = true
    this.setState(newState)

    var finishTime;

    var lastIndex = this.state.local_midi.length - 1
    if (lastIndex > -1) {
      var finalNote = this.state.local_midi[lastIndex]
      finishTime = finalNote.time + finalNote.duration
    }

    var obj = this

    new Tone.Part(function (time, note) {
      obj.synth.triggerAttackRelease(note.name, note.duration, time, 1)

    }, this.state.local_midi).start();

    new Tone.Event(function (time, note) {
      var newState = obj.state
      newState.is_playing = false
      obj.setState(newState)
      Tone.Transport.stop()
    }).start(finishTime);

    Tone.Transport.start();
  }

  handleOnReset() {
    var newState = this.state
    newState.recording_complete = false
    newState.local_midi = this.state.server_midi
    this.setState(newState)
  }

  handleOnShare() {
    // TODO: Submit local_midi to firebase and toggle the active location
  }

  startRecording() {
    var newState = this.state
    newState.is_recording = true
    this.setState(newState);

    var obj = this
    new Tone.Loop(function (time) {
      obj.state.recordTimeRemaining -= 1
      obj.setState(obj.state)
      if (obj.state.recordTimeRemaining <= 0) {
        Tone.Transport.stop();
        var newState = obj.state
        newState.is_recording = false
        newState.recording_complete = true
        obj.setState(newState)
      }
      console.log('recording tick')
    }, 1).start();
  }

  render() {
    return (
      <div className="App">
        <StatusIndicator
          isReady={this.state.is_ready}
          isRecording={this.state.is_recording}
          isPlaying={this.state.is_playing}
          isActiveLocation={this.state.is_active_location}
          playTimeRemaining={this.state.playTimeRemaining}
          recordTimeRemaining={this.state.recordTimeRemaining}
          recordingComplete={this.state.recording_complete} />
        <Keyboard />
        <PlayButton
          disabled={this.state.is_playing || this.state.is_recording || this.state.server_midi[0] === undefined}
          visible={!this.state.recording_complete}
          onPlay={this.handleOnPlay} />
        <RecordingCompleteOptionsPane
          visible={this.state.recording_complete}
          disabled={this.state.is_playing_back}
          onPlayback={this.handleOnPlayback}
          onReset={this.handleOnReset}
          onShare={this.handleOnShare} />
      </div>
    );
  }
}

export default App;