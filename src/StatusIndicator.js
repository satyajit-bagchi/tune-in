import React, { Component } from 'react';
import { timingSafeEqual } from 'crypto';

class StatusIndicator extends React.Component {
    render() {

        var text = ""
        if (!this.props.isReady)
        {
            text = "Loading data..."
        }
        else if (!this.props.isActiveLocation) {
            if (!this.props.isPlaying) {
                text = "Waiting on sister-site to make an addition. You can listen to the composition's latest state in the meantime."
            }
            else {
                text = "Playing. Please enjoy!"
            }
        }
        else {
            if (this.props.isPlaying) {
                text = "Playing... prepare to record your contribution in " + Math.floor(this.props.playTimeRemaining) + " seconds"
            }
            else if (this.props.isRecording) {
                text = "Recording... you have " + Math.floor(this.props.recordTimeRemaining) + " seconds remaining"
            }
            else if (this.props.recordingComplete) {
                text = "Recording complete. You can play it back to see how you like it. If you're happy with it, press share to transmit it to our sister site. Otherwise you can hit reset to start over."
            }
            else {
                text = "Ready for your submission. Press play to listen to the current composition and add your inputs to the end."
            }
        }

        return (
            <p>{text}</p>
        );
    }
}

export default StatusIndicator;