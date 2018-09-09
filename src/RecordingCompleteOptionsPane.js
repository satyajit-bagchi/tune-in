import React, { Component } from 'react';

class RecordingCompleteOptionsPane extends Component {
    render() {
        if (this.props.visible) {
            return (
                <div>
                    <button class="btn btn-info" onClick={() => this.playback()} disabled={this.props.disabled}>Play it back</button>
                    <button class="btn btn-danger" onClick={() => this.reset()} disabled={this.props.disabled}>Reset</button>
                    <button class="btn btn-primary" onClick={() => this.share()} disabled={this.props.disabled}>Share</button>
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