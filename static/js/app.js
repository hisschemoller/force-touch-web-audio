'use strict';

document.addEventListener('DOMContentLoaded', function(e) {
    
    var rootEl,
        btnEl,
        freqEl,
        aCtx,
        osc,
        gain,
        minFreqLog = Math.log(50),
        maxFreqLog = Math.log(10000),
        forceToFreqScale = maxFreqLog - minFreqLog,
        
        init = function() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            aCtx = new AudioContext();
            
            // show click overlay on iOS devices
            if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                var el = document.getElementById('overlay--startup');
                el.addEventListener('touchend', function() {
                    unlockIOSAudio(this);
                });
                el.style.display = 'block';
            } else {
                setup();
            }
        },
        
        /**
         * On iOS devices the audio stream can only be activated by a user generated event.
         * So for iOS an overlay is shown for the user to click.
         * @see https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
         */
        unlockIOSAudio = function(overlay) {
            // event listener did its job
            overlay.removeEventListener('touchend', unlockIOSAudio);

            // create an empty buffer
            var buffer = aCtx.createBuffer(1, 1, 22050);
            var source = aCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(aCtx.destination);

            // play the empty buffer
            if (typeof source.start === 'undefined') {
                source.noteOn(0);
            } else {
                source.start(0);
            }

            // setup a timeout to check that we are unlocked on the next event loop
            var interval = setInterval(function() {
                if (aCtx.currentTime > 0) {
                    clearInterval(interval);
                    overlay.parentNode.removeChild(overlay);
                    setup();
                }
            }, 100);
        },
        
        /**
         * AudioContext runs, set up the app.
         */
        setup = function() {
            rootEl = document.getElementsByClassName('controls')[0];
            btnEl = rootEl.getElementsByClassName('controls__btn')[0];
            freqEl = rootEl.getElementsByClassName('controls__freq-amount')[0];

            Pressure.set(btnEl, {
                change: onPressureChange,
                start: onPressureStart,
                end: onPressureEnd
            });
            
            gain = aCtx.createGain();
            gain.gain.value = 0;
            gain.connect(aCtx.destination);
            
            osc = aCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 440;
            osc.connect(gain);
            osc.start();
        },
        
        /**
         * Pressure change handler.
         * @param {Number} force Pressure between 0 and 1.
         * @param {Object} e Touch event.
         */
        onPressureChange = function(force, e) {
            // convert linear pressure to logarithmic frequency scale
            // http://stackoverflow.com/questions/846221/logarithmic-slider
            var freq = Math.exp(minFreqLog + (forceToFreqScale * force));
            osc.frequency.value = freq;
            freqEl.innerHTML = freq.toFixed(1);

            // warm yellow to red
            btnEl.style.backgroundColor = '#' + Math.floor(0xffcc00 - ((force * 0xcc) << 8)).toString(16);

            var size = 160 + (force * 100);
            btnEl.style.height = btnEl.style.width = size + 'px';
            btnEl.style.borderRadius = size / 2 + 'px';
        },

        onPressureStart = function(e) {
            gain.gain.value = 1;
        },

        onPressureEnd = function(e) {
            gain.gain.value = 0;
        };
        
    init();
    
});
