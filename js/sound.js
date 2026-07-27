/* Tiny synthesized UI click sounds — no audio asset needed. */
(function () {
    var STORAGE_KEY = 'soundMuted';
    var ctx = null;

    function isMuted() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    function setMuted(muted) {
        localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
        document.querySelectorAll('[data-mute-toggle]').forEach(function (btn) {
            btn.textContent = muted ? 'volume_off' : 'volume_up';
            btn.setAttribute('aria-pressed', String(muted));
        });
    }

    function getContext() {
        if (!ctx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            ctx = new AudioContextClass();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function tick(frequency, duration, gainPeak) {
        if (isMuted()) return;
        var audioCtx = getContext();
        if (!audioCtx) return;

        var oscillator = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        var now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gainPeak, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    var Sound = {
        playMove: function () {
            tick(720, 0.05, 0.05);
        },
        playConfirm: function () {
            tick(480, 0.09, 0.07);
        },
        isMuted: isMuted,
        toggleMute: function () {
            setMuted(!isMuted());
        },
        initMuteButton: function (btn) {
            if (!btn) return;
            btn.textContent = isMuted() ? 'volume_off' : 'volume_up';
            btn.setAttribute('aria-pressed', String(isMuted()));
            btn.addEventListener('click', function (event) {
                event.stopPropagation();
                Sound.toggleMute();
            });
        }
    };

    window.Sound = Sound;
})();
