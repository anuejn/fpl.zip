import React, {useEffect, useState} from "react";
import useFetch from 'use-http'
import useSound from "use-sound";


const audioCtx = new AudioContext();

export default function App(props) {
  const { loading, error, data = [] } = useFetch('http://localhost:3000/kondome.flv.json', {}, [])

  const [timeRange, setTimeRange] = useState([0, 3000]);
  useEffect(() => {
    document.onselectionchange = () => {
      const selection = document.getSelection();
      const range = selection.getRangeAt(0);


      if (data) {
        const tagged_data = data.result.reduce((acc, curr) => {
          let lastIndex = 0;
          if (acc.length > 0) {
            lastIndex = acc[0].endIndex
          }

          return [{startIndex: lastIndex, endIndex: lastIndex + curr.word.length + 1, ...curr}, ...acc]
        }, []).reverse()

        const words = tagged_data.filter(word => word.startIndex >= range.startOffset && word.endIndex - 1 <= range.endOffset);
        console.log(words.map(x => x.word))
        const [start, end] = [Math.min(...words.map(x => x.start)), Math.max(...words.map(x => x.end))]
        setTimeRange([start * 1000, (end - start) * 1000])
      }
    }
  })

  const [play, {sound}] = useSound('http://localhost:3000/kondome.mp3', {
    onload: () => console.info("sound loaded"),
    onend: (a, b, c) => {
      console.info('Sound ended!', a, b, c);
    },
    sprite: {
      'selection': timeRange,
    }
  });

  if (error) {
    return 'Error!'
  }
  if (loading) {
    return 'Loading...'
  }

  return (
    <>
      {data.text}
      <button
        onClick={() => {
          sound._sprite.selection = timeRange;
          play({'id': 'selection'})
        }}
      >play</button>
    </>
  )
}