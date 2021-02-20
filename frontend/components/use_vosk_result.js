import React, {useState, useEffect} from "react";

export const ctx = new AudioContext();

export function useVoskResult(json_url) {
  const [result, setResult] = useState(null)

  const jsonUrlBase = json_url.substring(0,json_url.lastIndexOf("/")+1);

  useEffect(async () => {
    const json = await fetch(json_url).then(result => result.json())
    let audioFilePath = "";
    console.log("json", json)
    if (json.mediaUrl.startsWith("./")) {
      audioFilePath = jsonUrlBase + json.mediaUrl.substr(2);
    } else if (json.mediaUrl.startsWith("http")) {
      audioFilePath = json.mediaUrl;
    } else {
      audioFilePath = jsonUrlBase + json.mediaUrl;
    }
    console.log(audioFilePath)
    const audioFileContents = await fetch(audioFilePath).then(result => result.arrayBuffer())
    const audio = await ctx.decodeAudioData(audioFileContents)
    setResult({audio, ...json})
  }, [json_url])
  return result;
}
