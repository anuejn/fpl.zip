import React from 'react';

import {useSelection} from "./use_selection";
import {BsPlayFill, BsDownload} from "react-icons/bs";
import {ctx, useVoskResult} from "./use_vosk_result";
import lamejs from 'lamejs';
import { saveAs } from 'file-saver';

export default function App(props) {
  const voskResult = useVoskResult('https://files.niemo.de/kondome.mp3.json');
  const selection = useSelection();

  if (voskResult) {
    const tagged_data = voskResult.result.reduce((acc, curr) => {
      let lastIndex = 0;
      if (acc.length > 0) {
        lastIndex = acc[0].endIndex
      }

      return [{startIndex: lastIndex, endIndex: lastIndex + curr.word.length + 1, ...curr}, ...acc]
    }, []).reverse()

    let toolbar = <></>;
    if (selection) {
      const rect = selection.getBoundingClientRect();
      console.log(rect)
      const words = tagged_data.filter(word => word.startIndex >= selection.startOffset && word.endIndex - 1 <= selection.endOffset);
      const [start, stop] = [Math.min(...words.map(x => x.start)), Math.max(...words.map(x => x.end))]
      toolbar = (
        <div
          style={{
            position: 'absolute',
            top: rect.top,
            right: 0,
          }}
        >
          <button
            onClick={() => {
              let source = ctx.createBufferSource();
              source.buffer = voskResult.audio;
              source.connect(ctx.destination);
              source.start(0, start, (stop - start));

            }}
          >
            <BsPlayFill />
          </button>
          <button
            onClick={() => {
              const mp3Data = [];

              const mp3encoder = new lamejs.Mp3Encoder(1, voskResult.audio.sampleRate, 128);
              const samples = new Int16Array(voskResult.audio.getChannelData(0)
                .slice(Math.round(start * voskResult.audio.sampleRate), Math.round(stop * voskResult.audio.sampleRate))
                .map(x => x * 65535 / 2)
              );
              const mp3Buffer = mp3encoder.encodeBuffer(samples);
              mp3Data.push(mp3Buffer);
              const mp3End = mp3encoder.flush();
              mp3Data.push(mp3End);

              console.debug(mp3Data);
              saveAs(new Blob(mp3Data), words.map(x => x.word).join("_") + ".mp3")
            }}
          >
            <BsDownload />
          </button>
        </div>
      )
    }


    return (
      <>
        <h1>fpl - <b>f</b>ind & <b>pl</b>ay</h1>
        <div
          style={{
            margin: 'auto',
            maxWidth: '1000px',
            lineHeight: 1.5,
          }}
        >
          {voskResult.text}
        </div>
        {toolbar}
      </>
    )
  } else {
    return "loading..."
  }
}