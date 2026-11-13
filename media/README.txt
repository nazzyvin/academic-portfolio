MEDIA FOLDER
============

This folder holds the audio (and later video) files for the portfolio.

Included now:
  welcome-intro.wav  - a short generated test chime so the audio player works
                       straight away. Replace it with your own welcome recording.

To use your own recording:
  1. Record a short (15-30 second) welcome message.
  2. Save it here, e.g. as welcome-intro.mp3.
  3. In index.html find the <audio> element and change its src, for example:
       src="media/welcome-intro.mp3"
  4. Keep the file size small (aim for under 2 MB) so the page stays fast.

Tip: MP3 is the safest format for browsers. OGG and WAV also work in most
modern browsers. You can delete the placeholder WAV once your own file is in.
