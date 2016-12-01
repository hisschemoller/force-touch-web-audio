# Force Touch Web Audio
Force Touch browser test. One button, the harder you press, the higher the tone.

This is a simple Javascript app to test Apple's Force Touch technology. Since a few weeks I have an iPhone 6S, so I can now test this feature myself.

## Demo
Please find a demo here: [http://www.hisschemoller.com/projects/pressure/](http://www.hisschemoller.com/projects/pressure/)

## Overview
The app just shows one big button at the page's centre. The harder you press the button, the higher frequency tone is produced. The button changes in colour and size as well.

Detecting Force Touch events is handled by Stuart Yamartino's [Pressure.js](https://pressurejs.com/) [library](https://github.com/stuyam/pressure).

Audio is generated with the Web Audio API. The Force Touch event's 'force' property is a float between 0 and 1, and is converted to a frequency between 50 and 10,000 Hz. It's scale is converted from linear to logarithmic to have better control of low frequencies. The frequency value is then used to set a single sine generator that outputs its signal to the AudioContext's destination.

Read more here: [http://www.hisschemoller.com/blog/2016/force-touch-web-audio-iphone/](http://www.hisschemoller.com/blog/2016/force-touch-web-audio-iphone/)
