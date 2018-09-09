import React, { Component } from 'react';
import Tone from 'tone'

class PlayButton extends React.Component {
    constructor(props) {
        super(props);

        this.synth = new Tone.PolySynth(8).toMaster();
    }

    //     componentDidUpdate() {
    //         this.setState(
    //             disabled: 
    //         )
    //     }

    render() {
        return (
            <button onClick={() => this.playmidi()} disabled={this.props.disabled}>Play</button>
        );
    }

    playmidi() {
        var obj = this
        this.props.onPlay(true);

        var lastIndex = this.props.midi.length - 1
        if (lastIndex > -1) {
            var finalNote = this.props.midi[lastIndex]
            var finishTime = finalNote.time + finalNote.duration
        }

        new Tone.Part(function (time, note) {
            obj.synth.triggerAttackRelease(note.name, note.duration, time, 1)

        }, this.props.midi).start();

        new Tone.Event(function (time, note) {
            obj.props.onPlay(false)
        }).start(finishTime);

        // start the transport to hear the events
        Tone.Transport.start();
    }
}

export default PlayButton;