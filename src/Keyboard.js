import React, { Component } from 'react';
import './Keyboard.css'

class Keyboard extends Component {
    render() {
        return (
            <div id='container1'>
                <div id='container2'>
                    <div className='white_key key' onMouseDown={() => this.pushSound(0)} onMouseUp={() => this.stopSound(0)}></div>
                    <div onMouseDown={() => this.pushSound(0)} onMouseUp={() => this.stopSound(0)}></div>
                    <div onMouseDown={() => this.pushSound(1)} onMouseUp={() => this.stopSound(1)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(1)} onMouseUp={() => this.stopSound(1)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(2)} onMouseUp={() => this.stopSound(2)}></div>
                    <div onMouseDown={() => this.pushSound(2)} onMouseUp={() => this.stopSound(2)}></div>
                    <div onMouseDown={() => this.pushSound(3)} onMouseUp={() => this.stopSound(3)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(3)} onMouseUp={() => this.stopSound(3)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(4)} onMouseUp={() => this.stopSound(4)}></div>
                    <div onMouseDown={() => this.pushSound(4)} onMouseUp={() => this.stopSound(4)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(5)} onMouseUp={() => this.stopSound(5)}></div>
                    <div onMouseDown={() => this.pushSound(5)} onMouseUp={() => this.stopSound(5)}></div>
                    <div onMouseDown={() => this.pushSound(6)} onMouseUp={() => this.stopSound(6)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(6)} onMouseUp={() => this.stopSound(6)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(7)} onMouseUp={() => this.stopSound(7)}></div>
                    <div onMouseDown={() => this.pushSound(7)} onMouseUp={() => this.stopSound(7)}></div>
                    <div onMouseDown={() => this.pushSound(8)} onMouseUp={() => this.stopSound(8)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(8)} onMouseUp={() => this.stopSound(8)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(9)} onMouseUp={() => this.stopSound(9)}></div>
                    <div onMouseDown={() => this.pushSound(9)} onMouseUp={() => this.stopSound(9)}></div>
                    <div onMouseDown={() => this.pushSound(10)} onMouseUp={() => this.stopSound(10)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(10)} onMouseUp={() => this.stopSound(10)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(11)} onMouseUp={() => this.stopSound(11)}></div>
                    <div onMouseDown={() => this.pushSound(11)} onMouseUp={() => this.stopSound(11)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(12)} onMouseUp={() => this.stopSound(12)}></div>
                    <div onMouseDown={() => this.pushSound(12)} onMouseUp={() => this.stopSound(12)}></div>
                    <div onMouseDown={() => this.pushSound(13)} onMouseUp={() => this.stopSound(13)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(13)} onMouseUp={() => this.stopSound(13)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(14)} onMouseUp={() => this.stopSound(14)}></div>
                    <div onMouseDown={() => this.pushSound(14)} onMouseUp={() => this.stopSound(14)}></div>
                    <div onMouseDown={() => this.pushSound(15)} onMouseUp={() => this.stopSound(15)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(15)} onMouseUp={() => this.stopSound(15)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(16)} onMouseUp={() => this.stopSound(16)}></div>
                    <div onMouseDown={() => this.pushSound(16)} onMouseUp={() => this.stopSound(16)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(17)} onMouseUp={() => this.stopSound(17)}></div>
                    <div onMouseDown={() => this.pushSound(17)} onMouseUp={() => this.stopSound(17)}></div>
                    <div onMouseDown={() => this.pushSound(18)} onMouseUp={() => this.stopSound(18)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(18)} onMouseUp={() => this.stopSound(18)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(19)} onMouseUp={() => this.stopSound(19)}></div>
                    <div onMouseDown={() => this.pushSound(19)} onMouseUp={() => this.stopSound(19)}></div>
                    <div onMouseDown={() => this.pushSound(20)} onMouseUp={() => this.stopSound(20)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(20)} onMouseUp={() => this.stopSound(20)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(21)} onMouseUp={() => this.stopSound(21)}></div>
                    <div onMouseDown={() => this.pushSound(21)} onMouseUp={() => this.stopSound(21)}></div>
                    <div onMouseDown={() => this.pushSound(22)} onMouseUp={() => this.stopSound(22)}></div>
                    <div className='black_key key' onMouseDown={() => this.pushSound(22)} onMouseUp={() => this.stopSound(22)}></div>
                    <div className='white_key key' onMouseDown={() => this.pushSound(23)} onMouseUp={() => this.stopSound(23)}></div>
                    <div onMouseDown={() => this.pushSound(23)} onMouseUp={() => this.stopSound(23)}></div>

                </div>
            </div>
        );
    }

    pushSound(keyNumber) {
        this.props.onPushSound(keyNumber);
    }

    stopSound(keyNumber) {
        this.props.onStopSound(keyNumber);
    }
}

export default Keyboard;