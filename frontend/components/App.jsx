import React from 'react';

import useFetch from 'use-http'
import useSound from "use-sound";
import {useSelection} from "./use_selection";

export default function App(props) {
  const { loading, error, data = [] } = useFetch('https://files.niemo.de/kondome.mp3.json', {}, [])
  const [play, {sound}] = useSound('https://files.niemo.de/kondome.mp3', {
    onload: () => console.info("sound loaded"),
    onend: (a, b, c) => {
      console.info('Sound ended!', a, b, c);
    },
    sprite: {
      'selection': [0, 3000],
    }
  });
  const selection = useSelection();


  if (error) {
    return 'Error!'
  }
  if (loading) {
    return 'Loading...'
  }
  if (data) {
    const tagged_data = data.result.reduce((acc, curr) => {
      let lastIndex = 0;
      if (acc.length > 0) {
        lastIndex = acc[0].endIndex
      }

      return [{startIndex: lastIndex, endIndex: lastIndex + curr.word.length + 1, ...curr}, ...acc]
    }, []).reverse()

    let button = <></>;
    console.log(selection)
    if (selection !== null) {
      const rect = selection.getBoundingClientRect();
      console.log(rect)
      const words = tagged_data.filter(word => word.startIndex >= selection.startOffset && word.endIndex - 1 <= selection.endOffset);
      const [start, stop] = [Math.min(...words.map(x => x.start)), Math.max(...words.map(x => x.end))]
      button = (
        <button
          style={{
            position: 'absolute',
            top: rect.top,
            right: 0,
          }}
          onClick={() => {
            sound._sprite.selection = [start * 1000, (stop - start) * 1000];
            play({'id': 'selection'})
          }}
        >▶️</button>
      )
    }


    return (
      <>
        <h1>fpl - <b>f</b>ind & <b>pl</b>ay</h1>
        <div
          style={{
            margin: 'auto',
            maxWidth: '1000px',
          }}
        >
          {data.text}
        </div>
        {button}
      </>
    )
  }
}