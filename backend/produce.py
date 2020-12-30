#!/usr/bin/env python3

from vosk import Model, KaldiRecognizer, SetLogLevel
import sys
import os
import wave
import subprocess
import json
import pathlib

SetLogLevel(0)

if not os.path.exists("model"):
    print ("Please download the model from https://alphacephei.com/vosk/models and unpack as 'model' in the current folder.")
    exit (1)

infile = sys.argv[2]
outfile = "{}.json".format(infile)
model_path = pathlib.Path(__file__).parent / sys.argv[1]

sample_rate=16000
model = Model(str(model_path))
rec = KaldiRecognizer(model, sample_rate)

process = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i',
                            infile,
                            '-ar', str(sample_rate) , '-ac', '1', '-f', 's16le', '-'],
                            stdout=subprocess.PIPE)

while True:
    data = process.stdout.read(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        pass

with open(outfile, "w") as f:
    result = json.loads(rec.FinalResult())
    result["mediaUrl"] = infile
    f.write(json.dumps(result, indent=4))
