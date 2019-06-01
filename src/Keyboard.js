import React from 'react';
import styles from './Keyboard.css';
//https://stackoverflow.com/questions/14308029/playing-a-chord-with-oscillatornodes-using-the-web-audio-api
//http://blog.chrislowis.co.uk/2013/06/10/playing-multiple-notes-web-audio-api.html
const notes = {
  'c4': 261.63,
  'd4': 293.66,
  'e4': 329.63,
  'f4': 349.23,
  'f#4': 369.99,
  'g4': 392,
  'a4': 440,
  'b4': 493.88,
  'c5': 523.25,
};

const keys = {
  '1': 'c4',
  '2': 'd4',
  '3': 'e4',
  '4': 'f4',
  '5': 'g4',
  '6': 'a4',
  '7': 'b4',
  '8': 'c5',
};

export default class Keyboard extends React.Component {
  state = {
    osc: {},
    playing: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.playNote, false);
    document.addEventListener('keyup', this.stopNote, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.playNote);
    document.removeEventListener('keyup', this.stopNote);
  }

  playNote = (e) => {
    console.log('hi', e)
    const note = e.target.dataset.note || keys[e.key];
    if (!note) {
      return;
    }
    let { osc, context, playing } = this.state;
    if (playing) {
      return;
    }
    if (!context) {
      context = new AudioContext();
    }
    if (!osc[note]) {
      osc[note] = context.createOscillator();
    }
    osc[note].frequency.setTargetAtTime(notes[note] || 'c4', context.currentTime, 0);
    osc[note].connect(context.destination);
    osc[note].start(0);
    this.setState({ playing: true, osc: { [note]: osc[note] }, context });
  }

  stopNote = (e) => {
    console.log('yo', e);
    const note = e.target.dataset.note || keys[e.key];
    if (!note) {
      return;
    }
    const { osc, playing } = this.state;
    if (playing && osc[note]) {
      osc[note].stop();
      this.setState({ playing: false, osc: { [note]: null } });
    }
  }

  render() {
    return (
      <div>
        {['c4', 'd4', 'e4', 'f4'].map(note => (
          <button
            className="keyboard"
            onMouseDown={this.playNote}
            onMouseUp={this.stopNote}
            type="button"
            data-note={note}
          >
          {note}
          </button>
        ))}
      </div>
    )
  }
}
