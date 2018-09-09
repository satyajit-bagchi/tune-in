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
    this.recording_interval = 3;
    this.notes = [
      "523.251", "554.365", "587.33", "622.254", "659.255", "698.456", "739.989", "783.991", "830.609", "880", "932.328", "987.767", "1046.5", "1108.73", "1174.659", "1244.508", "1318.51", "1396.913", "1479.978", "1567.982", "1661.219", "1760", "1864.655", "1975.533"
    ]

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

    //this.synth = new Tone.PolySynth(8).toMaster();
    this.synth = new Tone.Synth().toMaster();
    this.recorded_notes = []

    this.note_pitch = ""
    this.note_time = 0.0
    this.note_duration = 0.0 
    this.note_relative = 0.0

    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnPlayback = this.handleOnPlayback.bind(this);
    this.handleOnReset = this.handleOnReset.bind(this);
    this.handleOnShare = this.handleOnShare.bind(this);
    this.handleOnPushSound = this.handleOnPushSound.bind(this);
    this.handleOnStopSound = this.handleOnStopSound.bind(this);
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
      this.activeLocation = snapshot.val().activelocation
      var serverMidi = snapshot.val().notes

      var finishTime = 0

      var lastIndex = this.state.server_midi.length - 1
      if (lastIndex > -1) {
        var finalNote = this.state.server_midi[lastIndex]
        finishTime = finalNote.time + finalNote.duration
      }

      var localmidi = Object.values(serverMidi);
      console.log(localmidi)

      var newState = {
        is_ready: true,
        is_active_location: this.location_id === this.activeLocation,
        is_recording: false,
        is_playing: false,
        recording_complete: false,
        server_midi: serverMidi,
        local_midi: localmidi,
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
    }, 0.1).start();

    var ender = new Tone.Event(function (time, note) {
      var newState = obj.state
      newState.is_playing = false
      obj.setState(newState)
      if (obj.state.is_active_location && !obj.state.is_playing_back) {
        obj.playFinishTime = finishTime
        console.log('play end', obj.playFinishTime)
        obj.startRecording()
      }
      else {
        Tone.Transport.stop()
        Tone.Transport.clear(ender)
      }
    }).start(finishTime);

    Tone.Transport.start();
  }

  handleOnPushSound(keyNumber) {
    this.synth.triggerAttack(this.notes[keyNumber])
    if (this.state.is_recording) {

      var timeNow = Tone.now()
      console.log('key down at', timeNow)
      // var note = {
      //   name: this.notes[keyNumber],
      //   time: timeNow - this.record_start_time + this.playFinishTime,
      //   relativeTime: timeNow
      // }

      // this.recorded_notes.push(note);

      this.note_pitch = this.notes[keyNumber]
      this.note_time = timeNow - this.record_start_time + this.playFinishTime
      this.note_relative = Tone.now()

      console.log(this.recorded_notes);
    }
  }

  handleOnStopSound(keyNumber) {
    this.synth.triggerRelease()//this.notes[keyNumber])

    if (this.state.is_recording) {
      var time = Tone.now()
      console.log('keyup at ', time)

      var obj = this

      this.note_duration = Tone.now() - this.note_relative

      var note = {
        duration: this.note_duration,
        name: this.note_pitch,
        time: this.note_time
      }

      this.state.local_midi.push(note)

      // var indexOfMatchingPitch = this.recorded_notes.findIndex(function (element) {
      //   if (obj.notes != undefined) {
      //     return element.name === obj.notes[keyNumber]
      //   }
      //   else {
      //     return false
      //   }
      // });
      // var note = this.recorded_notes[indexOfMatchingPitch]
      // if (note != undefined) {
      //   note.duration = time - note.relativeTime
      //   this.state.local_midi.push(note)
      //   this.recorded_notes.splice(indexOfMatchingPitch, 1);
      // }

    }
  }

  handleOnPlayback() {
    Tone.context.dispose()
    Tone.context = new AudioContext()
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
    console.log('playback', finishTime, this.state.local_midi)
    new Tone.Part(function (time, note) {
      obj.synth.triggerAttackRelease(note.name, note.duration, time, 1)

    }, this.state.local_midi).start();

    var ender = new Tone.Event(function (time, note) {
      var newState = obj.state
      newState.is_playing_back = false
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
    var nextLocation = 1

    if (this.activeLocation === 1)
    {
      nextLocation = 2
    }

    var postdata = {
      activelocation: nextLocation,
      notes: this.state.local_midi
    }
    firebase.database().ref().child('midislim').update(postdata)

    var newstate = this.state
    newstate.recording_complete = false
    newstate.activeLocation = nextLocation
    newstate.is_active_location = this.location_id === nextLocation
    this.setState(newstate)
  }

  startRecording() {
    this.record_start_time = Tone.now();
    console.log('record start', this.record_start_time)

    var newState = this.state
    newState.is_recording = true
    this.setState(newState);

    this.recorded_notes = []

    var obj = this
    new Tone.Loop(function (time) {
      obj.state.recordTimeRemaining -= 1
      obj.setState(obj.state)
      if (obj.state.recordTimeRemaining <= 0) {
        Tone.Transport.stop();
        Tone.Transport.clear()
        var newState = obj.state
        newState.is_recording = false
        newState.recording_complete = true
        obj.setState(newState)
      }
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
        <Keyboard onPushSound={this.handleOnPushSound} onStopSound={this.handleOnStopSound} />
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