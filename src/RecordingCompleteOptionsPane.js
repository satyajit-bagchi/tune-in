import React, { Component } from 'react';

class RecordingCompleteOptionsPane extends Component {
    render() {
        if (this.props.visible) {
            return (
                <div>
                    <button onClick={() => this.playback()} disabled={this.props.disabled}>Play it back</button>
                    <button onClick={() => this.reset()} disabled={this.props.disabled}>Reset</button>
                    <button onClick={() => this.share()} disabled={this.props.disabled}>Share</button>
                </div>
            );
        }
        return null
    }

    playback() {
        this.props.onPlayback();
    }

    reset() {
        this.props.onReset();
    }

    share() {
        this.props.onShare();
    }
}

export default RecordingCompleteOptionsPane;