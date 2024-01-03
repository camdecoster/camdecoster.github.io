---
title: "Split YouTube audio into tracks"
description: "It's easy to extract the audio from a YouTube video and split it up"
pubDate: 2024-01-03T18:26:47.342Z
tags: [devblog, youtube, yt-dlp, audio, ffmpeg, javascript]
image: "@assets/split-youtube-audio-tracks/images/header.png"
---

![splitting youtube logo (with lines cut out)](@assets/split-youtube-audio-tracks/images/header.png "Split up that YouTube audio!")

## DISCLAIMER

Only extract audio from videos where you have permission to do so. Usually, creators will list the license on the video page and this will dictate what can be done with the video. For example, [Big Buck Bunny](https://www.youtube.com/watch?v=aqz-KE-bpKQ) was released under a Creative Commons license which allows for reuse with attribution.

## Get the audio

There's a piece of software called `yt-dlp` that handles this. It allows one to download a YouTube video (or audio in this case) from the command line. You can find it [here](https://github.com/yt-dlp/yt-dlp/releases) and download it for your operating system. With that installed, enter the following command in your terminal with the proper video id.

```sh
yt-dlp -x --audio-format mp3 "https://www.youtube.com/watch?v=VIDEO_ID_HERE"
```
Per the man page, here's what the options do:
- `-x`: Convert video files to audio-only files (requires ffmpeg and ff‐probe)
- `--audio-format`: Format to convert the audio to when `-x` is used.  (currently supported: best (default), aac, alac, flac, m4a, mp3, opus, vorbis, wav).

So, this command will download the video at the given URL and extract the audio as mp3. If you run the command, you should see some output similar to the following:

```sh
[youtube] Extracting URL: https://www.youtube.com/watch?v=aqz-KE-bpKQ
[youtube] aqz-KE-bpKQ: Downloading webpage
[youtube] aqz-KE-bpKQ: Downloading ios player API JSON
[youtube] aqz-KE-bpKQ: Downloading android player API JSON
[youtube] aqz-KE-bpKQ: Downloading m3u8 information
[info] aqz-KE-bpKQ: Downloading 1 format(s): 258
[download] Destination: Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film [aqz-KE-bpKQ].m4a
[download] 100% of   29.34MiB in 00:00:03 at 9.09MiB/s
[FixupM4a] Correcting container of "Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film [aqz-KE-bpKQ].m4a"
[ExtractAudio] Destination: Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film [aqz-KE-bpKQ].mp3
Deleting original file Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film [aqz-KE-bpKQ].m4a (pass -k to keep)
```

## Split the audio

This solution relies on the program [`ffmpeg`](https://ffmpeg.org/), truly a Swiss Army Knife of audio/video manipulation. You should already have this installed since `yt-dlp` depends on it. The commands required to get `ffmpeg` to extract the proper audio are simple, but repetative. Thankfully, I found a Node script on [StackExchange](https://unix.stackexchange.com/a/706544) that will create them by reading track info from a text file. I modified it a bit to include the track number and also to handle some more characters in the track names.

```js
const readline = require("readline");
const fs = require("fs");
const args = process.argv.slice(2);

const timeStampRegex = /(\d{2}:\d{2}:\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Za-z\d \-\(\)\."]+)/;

const readInterface = readline.createInterface({
	input: fs.createReadStream(args[1])
});

let count = 1;

readInterface.on("line", line => {
	const match = timeStampRegex.exec(line);

	process.stdout.write(`${count === 1 ? "" : " &&\n"}ffmpeg -i "${args[0]}" -ss ${match[1]} -to ${match[2]} "${(count < 10 ? "0" : "") + count++} - ${match[3]}.mp3"`);
});
```

The script takes two arguments:
- The full audio file name
- A text file with timestamps and track names

The timestamp info should be saved using the following format:
```plaintext
00:00:00 00:01:00 First track name
00:01:00 00:02:00 Second track name
```

With the full audio file and the timestamps, the script can now be called from the terminal with the following command:

```sh
node splitAudio.js fullAudio.mp3 timestamps.txt
```

After running the script, you'll have a list of `ffmpeg` commands to run which will create all of the track files.

```plaintext
ffmpeg -i "fullAudio.mp3" -ss 00:00:00 -to 00:01:00 "01 - First track name.mp3" &&
ffmpeg -i "fullAudio.mp3" -ss 00:01:00 -to 00:02:00 "02 - Second track name.mp3"
```

Copy the list of commands, paste it into the terminal, and hit Enter. The tracks should start showing up in the working directory.

## Add metadata (optional)

That takes care of the original goal, but you could add one more step to include metadata in the mp3 files. I use a program called [EasyTAG](https://wiki.gnome.org/Apps/EasyTAG) to add the metadata, including the artist/song info and album cover art. This is a Linux/Windows app, but there are other similar apps that can do the same thing.

## Conclusion

At this point, you can upload these files to your favorite music hosting service and listen at your leisure. If you have any thoughts on how this could be made easier, please reach and let me know.
