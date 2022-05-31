---
title: "How to Rip the Audio from a Video DVD on Linux"
description: "Learn how to convert the audio track from a DVD video to something more portable"
date: 2022-05-22T13:14:01-06:00
tags: ["devblog", "linux", "dvd"]
image: "/posts/how-to-rip-audio-from-dvd/images/header.png"
type: post
---

![image alt text](/posts/how-to-rip-audio-from-dvd/images/header.png "Image title text")

I recently purchased a copy of the DVD, "[The Raconteurs: Live At Montreux 2008](https://youtu.be/a-SeNaClWmo)". The recording is high quality and the set list is great. However, my intention was not to watch this video but to rip the audio from it. I listen to a lot of concerts as I work and I wanted to add this to my collection. I did this once a couple of years ago using a cross-platform program called [DVD Audio Extractor](https://www.dvdae.com/) and it made the process very easy. I was able to use a free trial that first time, but that trial expired so I had to find a new solution. I seriously considered just buying a license for DVDAE, but I couldn't justify the cost for something that I would use so seldomly. As I use Debian Linux as my operating system, I was sure that I could find a combination of utilities to do the same thing that DVDAE does. And I did! But before I tell you how, keep in mind that you should only decrypt DVD's that you own and you should only use the resulting files yourself. Alright, here's how I managed it.

### Accessing the DVD

Before you can access the DVD, you need to install the libraries necessary to decrypt DVD's on your OS. You can read about how to do that on Debian [here](https://wiki.debian.org/CDDVD). You'll also need a DVD drive. It's easier if your DVD drive and the DVD use the same region code, but it should still work even if they don't match.

### Get Title and Chapter Info

There are a number of ways to do this, but I chose to use [**MPlayer**](https://mplayerhq.hu/design7/news.html). MPlayer is a swiss-army-knife media player that's incredibly powerful. You only need it to get the title and chapter info from the DVD. After installing it, enter the following command into your console:

```bash
mplayer dvd://3 -identify -frames 0
```

This command tells MPlayer to provide information about title 3 in the DVD drive and suppress video output. The 3 in this case is the title number for the DVD where the recording is. You'll have to play around with that to find the correct title. Part of the result from this command will be a list of the chapter breaks down to the millisecond. You'll also notice that audio stream 0 has the stereo mix. Save this information for later. Your output should look similar to the following:

```
MPlayer 1.4 (Debian), built with gcc-10 (C) 2000-2019 MPlayer Team
do_connect: could not connect to socket
connect: No such file or directory
Failed to open LIRC support. You will not be able to use your remote control.

Playing dvd://3.
ID_DVD_TITLES=5
ID_DVD_TITLE_1_CHAPTERS=1
ID_DVD_TITLE_1_ANGLES=1
ID_DVD_TITLE_2_CHAPTERS=1
ID_DVD_TITLE_2_ANGLES=1
ID_DVD_TITLE_3_CHAPTERS=17
ID_DVD_TITLE_3_ANGLES=1
ID_DVD_TITLE_4_CHAPTERS=1
ID_DVD_TITLE_4_ANGLES=1
ID_DVD_TITLE_5_CHAPTERS=1
ID_DVD_TITLE_5_ANGLES=1
ID_DVD_TITLE_1_LENGTH=20.033
ID_DVD_TITLE_2_LENGTH=0.400
ID_DVD_TITLE_3_LENGTH=5365.266
ID_DVD_TITLE_4_LENGTH=26.000
ID_DVD_TITLE_5_LENGTH=0.400
ID_DVD_DISC_ID=F5BEE0D2BA7F4D56A78EC56AA63A33D9
ID_DVD_VOLUME_ID=EE392449
There are 5 titles on this DVD.

ID_DVD_CURRENT_TITLE=3
There are 1 angles in this DVD title.
libdvdread: Attempting to retrieve all CSS keys
libdvdread: This can take a _long_ time, please be patient
libdvdread: Get key for /VIDEO_TS/VIDEO_TS.VOB at 0x0000012b
libdvdread: Elapsed time 0
libdvdread: Get key for /VIDEO_TS/VTS_01_0.VOB at 0x00022a2d
libdvdread: Elapsed time 0
libdvdread: Get key for /VIDEO_TS/VTS_01_1.VOB at 0x00022a31
libdvdread: Elapsed time 0
libdvdread: Get key for /VIDEO_TS/VTS_02_0.VOB at 0x00024766
libdvdread: Elapsed time 0
libdvdread: Get key for /VIDEO_TS/VTS_02_1.VOB at 0x000428ef
libdvdread: Elapsed time 0
libdvdread: Found 2 VTS's
libdvdread: Elapsed time 0
audio stream: 0 format: ac3 (stereo) language: en aid: 128.

ID_AUDIO_ID=128
ID_AID_128_LANG=en
audio stream: 1 format: ac3 (5.1) language: en aid: 129.

ID_AUDIO_ID=129
ID_AID_129_LANG=en
audio stream: 2 format: dts (5.1) language: en aid: 138.

ID_AUDIO_ID=138
ID_AID_138_LANG=en
number of audio channels on disk: 3.
number of subtitles on disk: 0

CHAPTERS: 00:00:00.000,00:04:33.800,00:08:18.567,00:13:34.800,00:19:09.767,00:23:16.701,00:26:50.401,00:30:35.201,00:34:49.068,00:40:14.535,00:46:05.202,00:57:18.535,01:07:38.068,01:12:38.568,01:17:30.235,01:20:41.235,01:29:24.735,
ID_VIDEO_ID=0
MPEG-PS file format detected.
ID_AUDIO_ID=128
VIDEO:  MPEG2  720x480  (aspect 3)  29.970 fps  9800.0 kbps (1225.0 kbyte/s)
libva info: VA-API version 1.10.0
libva info: Trying to open /usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so
libva info: Found init function __vaDriverInit_1_10
libva info: va_openDriver() returns 0
==========================================================================
Opening video decoder: [ffmpeg] FFmpeg's libavcodec codec family
libavcodec version 58.91.100 (external)
Selected video codec: [ffmpeg2] vfm: ffmpeg (FFmpeg MPEG-2)
==========================================================================
ID_VIDEO_CODEC=ffmpeg2
ID_FILENAME=dvd://3
ID_DEMUXER=mpegps
ID_VIDEO_FORMAT=0x10000002
ID_VIDEO_BITRATE=9800000
ID_VIDEO_WIDTH=720
ID_VIDEO_HEIGHT=480
ID_VIDEO_FPS=29.970
ID_VIDEO_ASPECT=0.0000
ID_AUDIO_FORMAT=8192
ID_AUDIO_BITRATE=0
ID_AUDIO_RATE=0
ID_AUDIO_NCH=0
ID_START_TIME=0.28
ID_LENGTH=5365.27
ID_SEEKABLE=1
ID_CHAPTERS=17
==========================================================================
Opening audio decoder: [ffmpeg] FFmpeg/libavcodec audio decoders
AUDIO: 48000 Hz, 2 ch, floatle, 448.0 kbit/14.58% (ratio: 56000->384000)
ID_AUDIO_BITRATE=448000
ID_AUDIO_RATE=48000
ID_AUDIO_NCH=2
Selected audio codec: [ffac3] afm: ffmpeg (FFmpeg AC-3)
==========================================================================
AO: [pulse] 48000Hz 2ch floatle (4 bytes per sample)
ID_AUDIO_CODEC=ffac3
Starting playback...


Exiting... (End of file)
ID_EXIT=EOF
corrupted size vs. prev_size in fastbins


MPlayer interrupted by signal 6 in module: exit_player
ID_SIGNAL=6
```

### Convert Audio to WAV

Most DVD's have a stereo version of the [audio track](https://en.wikipedia.org/wiki/DVD-Video#Audio_data) included on the disc. That's what you should convert as that's going to sound best on headphones. A simple way to do this is to use the [convert function](https://wiki.videolan.org/Transcode/) from VLC. With VLC open, choose *Convert/Save* from the File menu.

![vlc file menu](/posts/how-to-rip-audio-from-dvd/images/vlc_menu.png "VLC File Menu")

This will bring up the *Open Media* dialog. Choose the Disc tab at the top and select the correct title in the *Starting Position* section. VLC will default to an audio track of -1, which will select the first audio track. In our case that matches stream 0, so we'll leave that setting as is. If it didn't, you'd need to select the proper audio track. Without changing any other settings, this will convert the entire video to a single WAV file.

![vlc open media dialog](/posts/how-to-rip-audio-from-dvd/images/vlc_open_media.png "VLC Open Media Dialog")

Click the *Convert/Save* button to open the *Convert* dialog. Select the proper profile and choose a destination file. A good option is *Audio - CD*. I created a tweaked version of this called *Audio - DVD Video* with a Bitrate of 448kb/s and a sample rate of 48000Hz. I used this to get a slightly higher audio quality. Click the *Start* button to start the conversion.

![vlc open convert dialog](/posts/how-to-rip-audio-from-dvd/images/vlc_convert.png "VLC Open convert Dialog")

Once the conversion has completed, you'll have one large WAV file of the entire video. Now it's time to break the large file into the smaller chapter files (or song tracks in this case). Select *Convert/Save* from the File menu again, but this time choose the File tab and open the WAV file that you just created. Now refer to the chapter breaks you found using MPlayer. Enter the second chapter break into *Stop Time* input (the first one after 00:00:00.000), then click the *Convert/Save* button.

![vlc open media dialog file tab](/posts/how-to-rip-audio-from-dvd/images/vlc_open_media_file.png "VLC Open Media Dialog File Tab")

Choose the same profile, enter a file name for the chapter, and click the *Start* button. After this has completed, go through the process again but move the previous *Stop Time* to *Start Time*, and enter the next chapter break as the new *Stop Time*. Continue doing this until you've broken up the entire WAV file.

### Convert WAV to MP3

Now that the individual tracks have been converted to WAV files, it's time to convert them to something more portable. Choose whichever format you want, but I used MP3 due to broad support of the format. The GNOME project includes a program called [Sound Converter](https://soundconverter.org/) that makes this simple (including drag and drop). It uses [GStreamer](https://gstreamer.freedesktop.org/) to do the conversion and is straightforward to configure. Here are my preferences:

![sound converter preferences](/posts/how-to-rip-audio-from-dvd/images/sound_converter_pref.png "Sound Converter Preferences")

Here's the main window after I've added my files to convert:

![sound converter main window](/posts/how-to-rip-audio-from-dvd/images/sound_converter.png "Sound Converter Main Window")

Just click **Convert** and Sound Converter will handle the rest.

### Update File Tags

The conversion is done at this point, but the files will be easier to use if they have some metadata in the form of ID3 tags. I used [puddletag](https://docs.puddletag.net/) to manage this. Open the program and drag your files into the main window.

![puddletag main window](/posts/how-to-rip-audio-from-dvd/images/puddletag.png "puddletag Main Window")

Start entering all of the proper tag information. At a minimum, this should include artist, title, album, track, and artwork. After entering a value in one column, you can copy that cell and paste it into all of the cells in the column below. To add artwork, select all of the files and right click the cover art graphic, then select *Add Cover*. Once you're done with all of that, save everything with Ctrl-S or *File > Save*. Congratulations, you've finished the conversion.

### Conclusion

This is not the only way to do this and is likely not the best/easiest way to do this. But this way worked for me do it will probably work for you too. It's a bit cumbersome, so there's room for improvement (and automation). If you have any suggestions, please get it touch with me. Enjoy listening to those DVD's!
