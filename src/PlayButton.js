import React, { Component } from 'react';
import Tone from 'tone'

class PlayButton extends React.Component {
    render() {
        if (this.props.visible){
            return (
                <button onClick={() => this.playmidi()} disabled={this.props.disabled}>Play</button>
            );
        }
        return null        
    }

    playmidi() {
        this.props.onPlay();
    }
}

export default PlayButton;