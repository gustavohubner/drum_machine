function generateURL() {
  function encodeSequence(sequence) {
    var t = '',
      n = '',
      i = 'abcdefghijklmnop',
      r = 'qrstuvwxyzabcdef',
      s = {
        hihatfod: 1,
        sidetamlys: 2,
        gulvtam: 3,
        ride: 4,
        crash: 8,
        hihat: 5,
        lilletromme: 6,
        stortromme: 7
      }
    for (var a in sequence) {
      for (var o = sequence[a], l = '', c = '', d = 0, h = 0; h < o.length; h++) {
        var m = parseInt(o[h])
        1 === m
          ? ((l += i[h]), d++)
          : 2 === m && ((c += h < 10 ? r[h] : r[h]), d++)
      }
      '' !== l && (t += s[a] + l), '' !== c && (n += s[a] + c)
    }
    return t + '-' + n
  }
  function encodeMuted(muted) {
    var t = ''
    for (var n in muted) t += n
    return t
  }
  function encodeSound(sound) {
    var t = {
      standard: 'a',
      powerful: 'b',
      monumental: 'c',
      smooth: 'd',
      minimalistic: 'e',
      energetic: 'f'
    }
    return t[sound]
  }
  var i = ''
    ; (i += url_collection.tempo + '-'),
      (i += numSteps + '-'),
      (i += url_collection.swing ? 'y' : 'n'),
      (i += '-' + url_collection.rhythm.replace('/', '')),
      (i += '-' + encodeSound(url_collection.sound)),
      (i += '-' + encodeMuted(url_collection.muted)),
      (i += '-' + encodeSequence(url_collection.sequence))
  var fi = encodeSequence(url_collection.fillSequence || url_collection.sequence)
  window.history.pushState('', '', '?data=' + i + '&data_fill=' + fi)
}
function decodeURL(data, fillData) {
  function decodePart(part, alphabet, value, steps, result, channelMap) {
    var a = part.split(/(?=\d)/) || []
    a.forEach(function (chunk) {
      for (
        var ch = chunk[0], rest = chunk.slice(1), l = Array(steps).fill(0), c = 0;
        c < rest.length;
        c++
      ) {
        var pos = alphabet.indexOf(rest[c])
        pos >= -1 && (l[pos] = value)
      }
      result[channelMap[ch]].forEach(function (val, idx) {
        result[channelMap[ch]][idx] += l[idx]
      })
    })
  }
  function decodeSequence(normalPart, accentPart, steps) {
    var result = {
      hihatfod: Array(steps).fill(0),
      sidetamlys: Array(steps).fill(0),
      gulvtam: Array(steps).fill(0),
      ride: Array(steps).fill(0),
      crash: Array(steps).fill(0),
      hihat: Array(steps).fill(0),
      lilletromme: Array(steps).fill(0),
      stortromme: Array(steps).fill(0)
    },
      channelMap = {
        1: 'hihatfod',
        2: 'sidetamlys',
        3: 'gulvtam',
        4: 'ride',
        8: 'crash',
        5: 'hihat',
        6: 'lilletromme',
        7: 'stortromme'
      },
      normalAlphabet = 'abcdefghijklmnop',
      accentAlphabet = 'qrstuvwxyzabcdef'
    normalPart && decodePart(normalPart, normalAlphabet, 1, steps, result, channelMap), accentPart && decodePart(accentPart, accentAlphabet, 2, steps, result, channelMap)
    for (var channel in result) result[channel] = result[channel].join('')
    return result
  }
  function decodeMuted(mutedStr) {
    for (var muted = {}, n = 0; n < mutedStr.length; n++) muted[mutedStr[n]] = !0
    return muted
  }
  function decodeSound(letter) {
    var t = {
      a: 'standard',
      b: 'powerful',
      c: 'monumental',
      d: 'smooth',
      e: 'minimalistic',
      f: 'energetic'
    }
    return t[letter]
  }
  function getStepsFromRhythm(rhythm) {
    switch (rhythm) {
      case '44':
        return 16
      case '34':
        return 12
      case '54':
        return 10
      case '68':
        return 12
      default:
        return 16
    }
  }
  var parts = data.split('-'),
    result = {}
  if (parts[1] === 'y' || parts[1] === 'n') {
    result.tempo = parseInt(parts[0])
    result.steps = getStepsFromRhythm(parts[2])
    result.swing = 'y' === parts[1]
    result.rhythm = parts[2].split('').join('/')
    result.sound = decodeSound(parts[3])
    result.muted = decodeMuted(parts[4])
      result.sequence = decodeSequence(parts[5], parts[6], getStepsFromRhythm(parts[2]))
      if (fillData) {
        var fp = fillData.split('-')
        result.fillSequence = decodeSequence(fp[0], fp[1], getStepsFromRhythm(parts[2]))
      }
    } else {
      result.tempo = parseInt(parts[0])
      result.steps = parseInt(parts[1], 10) || 16
      result.swing = 'y' === parts[2]
      result.rhythm = parts[3].split('').join('/')
      result.sound = decodeSound(parts[4])
      result.muted = decodeMuted(parts[5])
      result.sequence = decodeSequence(parts[6], parts[7], result.steps)
      if (fillData) {
        var fp = fillData.split('-')
        result.fillSequence = decodeSequence(fp[0], fp[1], result.steps)
      }
    }
    if (!result.fillSequence) {
      result.fillSequence = {}
      for (var ch in result.sequence) result.fillSequence[ch] = result.sequence[ch]
    }
    result.fillActive = !1
    return result
}
function parseURLData() {
  var e = new URL(window.location.href),
    t = e.searchParams.get('data'),
    fd = e.searchParams.get('data_fill')
  if (!t) return null
  var n = decodeURIComponent(t),
    fillData = fd ? decodeURIComponent(fd) : null
  return n.includes('-') && n.includes('"')
    ? decodeOldURL(n)
    : n.includes('"')
      ? null
      : decodeURL(n, fillData)
}
function resetURL() {
  window.history.pushState('', '', window.location.pathname)
}
var AUDIO = new (window.AudioContext || window.webkitAudioContext)(),
  currentPatternForSwing,
  swing_toggler = !1,
  TRANSLATION = DRUM_MACHINE_TRANSLATION,
  BUTTON_NAMES = TRANSLATION.buttonNames,
  SOUND_TYPES = BUTTON_NAMES.sound,
  MODAL_NAMES = BUTTON_NAMES.modal,
  url_collection = {
    sequence: {
      hihatfod: '',
      sidetamlys: '',
      gulvtam: '',
      ride: '',
      hihat: '',
      lilletromme: '',
      stortromme: ''
    },
    fillSequence: {
      hihatfod: '',
      sidetamlys: '',
      gulvtam: '',
      ride: '',
      hihat: '',
      lilletromme: '',
      stortromme: ''
    },
    fillActive: !1,
    muted: {},
    rhythm: '4/4',
    tempo: 90,
    swing: !1,
    sound: 'standard'
  },
  dispatcher = _.extend(
    {
      EventKeys: {},
      register: function (eventKeys) {
        for (var key in eventKeys) {
          if (key in this.EventKeys)
            throw 'Dispatcher error: duplicate event key: ' + key
          this.EventKeys[key] = eventKeys[key]
        }
      }
    },
    Backbone.Events
  ),
  SampleBank = (function (ctx) {
    function init(samples, callback) {
      for (var key in samples) totalCount++
      for (var key in samples) loadSample(key, samples[key])
      defaultCallback = callback
    }
    function defaultCallback() {
      console.warn('Need to pass a callback to load()')
    }
    function onDecode(key, buffer) {
      return buffer
        ? ((sampleBuffers[key] = buffer), void (++loadedCount == totalCount && defaultCallback()))
        : void console.error('Unable to decode audio data', url)
    }
    function loadSample(key, url) {
      var req = new XMLHttpRequest()
        ; (req.responseType = 'arraybuffer'),
          (req.onload = function () {
            ctx.decodeAudioData(
              req.response,
              function (buffer) {
                onDecode(key, buffer)
              },
              function (err) {
                console.error('Unable to decode audio data', err)
              }
            )
          }),
          (req.onerror = function (err) {
            console.error('Error loading sample data', key, url, err)
          }),
          req.open('GET', url, !0),
          req.send()
    }
    function loadNew(samples, callback) {
      ; (sampleBuffers = {}), (loadedCount = 0), (totalCount = 0), init(samples, callback)
    }
    function play(key, when) {
      var source = ctx.createBufferSource()
      source.buffer = sampleBuffers[key]
      var gainNode = gains[key] || masterGain
      source.connect(gainNode)
      source.start(when || 0)
    }
    var masterGain = ctx.createGain()
    var gains = {}
    function initGains(channels) {
      for (var i in channels) {
        var g = ctx.createGain()
        g.connect(masterGain)
        g.gain.value = 1
        gains[channels[i]] = g
      }
    }
    function setGain(channel, value) {
      if (gains[channel]) gains[channel].gain.value = value
    }
    function setMasterGain(value) {
      masterGain.gain.value = value
    }
    function getGain(channel) {
      return gains[channel] ? gains[channel].gain.value : 1
    }
    function getMasterGain() {
      return masterGain.gain.value
    }
    function getMasterNode() { return masterGain }
    var sampleBuffers = {},
      loadedCount = 0,
      totalCount = 0,
      api = { play: play, init: init, loadNew: loadNew, initGains: initGains, setGain: setGain, setMasterGain: setMasterGain, getGain: getGain, getMasterGain: getMasterGain, getMasterNode: getMasterNode }
    return api
  })(AUDIO),
  AudioFX = (function (ctx, sampleBank) {
    var masterNode = sampleBank.getMasterNode()

    // EQ chain (on main path)
    var bassF = ctx.createBiquadFilter()
    bassF.type = 'lowshelf'
    bassF.frequency.value = 200
    bassF.gain.value = 0
    var midF = ctx.createBiquadFilter()
    midF.type = 'peaking'
    midF.frequency.value = 1000
    midF.gain.value = 0
    midF.Q.value = 1
    var trebleF = ctx.createBiquadFilter()
    trebleF.type = 'highshelf'
    trebleF.frequency.value = 5000
    trebleF.gain.value = 0
    var lpF = ctx.createBiquadFilter()
    lpF.type = 'lowpass'
    lpF.frequency.value = 22050
    var hpF = ctx.createBiquadFilter()
    hpF.type = 'highpass'
    hpF.frequency.value = 20

    // Connect main EQ chain
    masterNode.connect(bassF)
    bassF.connect(midF)
    midF.connect(trebleF)

    // Combined LP/HP filter (LP → HP)
    trebleF.connect(lpF)
    lpF.connect(hpF)

    // Main dry signal (always passes through EQ+filter)
    var mainDry = ctx.createGain()
    mainDry.gain.value = 1
    hpF.connect(mainDry)
    mainDry.connect(ctx.destination)

    // Reverb (parallel send from after HP)
    var revG = ctx.createGain()
    revG.gain.value = 0
    var convolver = ctx.createConvolver()
    var revLen = ctx.sampleRate * 2
    var revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate)
    for (var ch = 0; ch < 2; ch++) {
      var data = revBuf.getChannelData(ch)
      for (var i = 0; i < revLen; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 3)
    }
    convolver.buffer = revBuf
    hpF.connect(revG)
    revG.connect(convolver)
    convolver.connect(ctx.destination)

    // Chorus (parallel send from after HP)
    var chG = ctx.createGain()
    chG.gain.value = 0
    var chDelay = ctx.createDelay(0.05)
    chDelay.delayTime.value = 0.005
    var chOsc = ctx.createOscillator()
    chOsc.frequency.value = 1.3
    var chOscG = ctx.createGain()
    chOscG.gain.value = 0.003
    chOsc.connect(chOscG)
    chOscG.connect(chDelay.delayTime)
    chOsc.start()
    hpF.connect(chDelay)
    chDelay.connect(chG)
    chG.connect(ctx.destination)

    // Delay (parallel send)
    var dG = ctx.createGain()
    dG.gain.value = 0
    var dDelay = ctx.createDelay(3)
    dDelay.delayTime.value = 0.35
    var dFb = ctx.createGain()
    dFb.gain.value = 0
    hpF.connect(dDelay)
    dDelay.connect(dFb)
    dFb.connect(dDelay)
    dDelay.connect(dG)
    dG.connect(ctx.destination)

    return {
      getBass: function () { return bassF.gain.value },
      setBass: function (value) { bassF.gain.value = value },
      getMid: function () { return midF.gain.value },
      setMid: function (value) { midF.gain.value = value },
      getTreble: function () { return trebleF.gain.value },
      setTreble: function (value) { trebleF.gain.value = value },
      getFilterSlider: function () {
        var lp = lpF.frequency.value, hp = hpF.frequency.value
        if (hp < 100) {
          var normalized = Math.log(lp / 20) / Math.log(22050 / 20)
          return normalized * 0.5
        } else {
          var normalized = Math.log(hp / 20) / Math.log(22050 / 20)
          return 0.5 + normalized * 0.5
        }
      },
      setFilterSlider: function (value) {
        if (value < 0.5) {
          hpF.frequency.value = 20
          var normalized = value / 0.5
          lpF.frequency.value = Math.max(20, 20 * Math.pow(22050 / 20, normalized))
        } else {
          lpF.frequency.value = 22050
          var normalized = (value - 0.5) / 0.5
          hpF.frequency.value = Math.min(22050, 20 * Math.pow(22050 / 20, normalized))
        }
      },
      getReverbMix: function () { return revG.gain.value },
      setReverbMix: function (value) { revG.gain.value = value },
      getChorus: function () { return chG.gain.value },
      setChorus: function (value) { chG.gain.value = value },
      getDelayTime: function () { return dDelay.delayTime.value },
      setDelayTime: function (value) { dDelay.delayTime.value = value },
      getDelayFeedback: function () { return dFb.gain.value },
      setDelayFeedback: function (value) { dFb.gain.value = value },
      getDelayMix: function () { return dG.gain.value },
      setDelayMix: function (value) { dG.gain.value = value }
    }
  })(AUDIO, SampleBank),
  Sequencer = (function (ctx, sampleBank) {
    function setTempo(bpm) {
      ; (thisBpm = bpm),
        (interval = 60 / thisBpm / 4),
        currentPatternForSwing &&
        (interval =
          '5/4' == currentPatternForSwing.rhythm ||
            '6/8' == currentPatternForSwing.rhythm
            ? 60 / thisBpm / 2.000000000000002
            : 60 / thisBpm / 4)
    }
    function scheduleLoop() {
      if (!isPlaying) return !1
      var elapsed = ctx.currentTime
      if (((elapsed -= startOffset), 0 === ctx.currentTime && (nextEventTime -= startOffset), nextEventTime < elapsed + 0.2)) {
        var scheduleTime = nextEventTime + startOffset
        playStep(scheduleTime), advanceStep()
      }
      timerId = setTimeout(scheduleLoop, 0)
    }
    function advanceStep() {
      var patternLen = currentPattern.hihat.length
      currentStep++
      if (currentStep >= patternLen) {
        currentStep = 0
      }
      nextEventTime += interval
      if (fillOneShotActive) {
        fillOneShotStepsLeft--
        if (fillOneShotStepsLeft <= 0) {
          if (normalPatternBackup) {
            for (var ch in normalPatternBackup) {
              if (currentPattern[ch]) currentPattern[ch] = normalPatternBackup[ch]
            }
          }
          fillOneShotActive = !1
          normalPatternBackup = null
          $('#fill-in-button').removeClass('fill-active')
          $('#sequencer-panel').removeClass('fill-active')
          if (sequencerViewInstance) {
            for (var ch in sequencerViewInstance.channelViews) {
              sequencerViewInstance.channelViews[ch].model = currentPattern[ch]
              sequencerViewInstance.channelViews[ch].render()
            }
          }
        }
      }
    }
    function playNote(channel, time) {
      var noteVal = currentPattern[channel][currentStep]
      '1' === noteVal
        ? (sampleBank.play(channel, time),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, channel))
        : '2' === noteVal && playAccent(channel, time)
    }
    function playAccent(channel, time) {
      var accentMap = {
        hihat: 'aabenhihat',
        sidetamlys: 'sidetamdyb',
        lilletromme: 'kantslag'
      }
      accentMap[channel] &&
        (sampleBank.play(accentMap[channel], time),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, channel))
    }
    function playStep(time) {
      if (fillPending && currentStep === 1) {
        fillPending = !1
        normalPatternBackup = {}
        for (var ch in currentPattern) normalPatternBackup[ch] = currentPattern[ch].slice()
        var fillSrc = url_collection.fillSequence || url_collection.sequence
        for (var ch in fillSrc) {
          if (currentPattern[ch]) currentPattern[ch] = stringToArray(fillSrc[ch])
        }
        fillOneShotActive = !0
        fillOneShotStepsLeft = numSteps
        $('#fill-in-button').addClass('fill-active')
        $('#sequencer-panel').addClass('fill-active')
        if (sequencerViewInstance) {
          for (var ch in sequencerViewInstance.channelViews) {
            sequencerViewInstance.channelViews[ch].model = currentPattern[ch]
            sequencerViewInstance.channelViews[ch].render()
          }
        }
      }
      function applySwing(rhythm) {
        '4/4' === rhythm || '3/4' === rhythm ? swingQuadruple() : ('5/4' !== rhythm && '6/8' !== rhythm) || swingCompound(),
          currentStep >= stepsPerBeat + 1 && (currentStep = 0)
      }
      function swingQuadruple() {
        currentStep % 4 === 3 && (currentStep = 15 === currentStep ? 0 : currentStep + 1),
          '3/4' === rhythmStr && 12 === currentStep && currentStep++
      }
      function swingCompound() {
        currentStep % 2 === 0 && (nextEventTime += interval / 6)
      }
      var rhythmStr = currentPatternForSwing.rhythm,
        stepsPerBeat = currentPattern.hihat.length
      for (var channel in currentPattern)
        activeChannels[channel] && swing_toggler && applySwing(rhythmStr),
          activeChannels[channel] && playNote(channel, time),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, currentStep)
    }
    function play(pattern, times) {
      if (!initialized) throw 'Sequencer not initialized'
      null === currentPattern && initPattern(pattern),
        void 0 === times && (times = 1),
        times === -1 && (times = Number.MAX_INT),
        startScheduling()
    }
    function initPattern(patternData) {
      currentPattern = {}
      if (!patternData.fillSequence) {
        patternData.fillSequence = {}
        for (var ch in patternData.sequence) patternData.fillSequence[ch] = patternData.sequence[ch]
      }
      var src = url_collection.fillActive ? patternData.fillSequence : patternData.sequence
      for (var key in src) {
        var arr = stringToArray(src[key])
        currentPattern[key] = arr
      }
      var stepsEl = $('.transport-steps-display')
      if (stepsEl.length) {
        numSteps = parseInt(stepsEl.val(), 10) || 16
        if (numSteps < 1) numSteps = 1
        if (numSteps > 64) numSteps = 64
      }
      var knownChannels = Object.keys(TRANSLATION.patternName)
      for (var ci in knownChannels) {
        var ch = knownChannels[ci]
        if (!currentPattern[ch]) {
          currentPattern[ch] = []
          for (var j = 0; j < numSteps; j++) currentPattern[ch].push('0')
        }
      }
      for (var ch in currentPattern) {
        var cur = currentPattern[ch].length
        if (cur < numSteps) {
          for (var j = cur; j < numSteps; j++) currentPattern[ch].push('0')
        } else if (cur > numSteps) {
          currentPattern[ch].splice(numSteps)
        }
      }
    }
    function stringToArray(str) {
      return str.split('')
    }
    function startScheduling() {
      ; (isPlaying = !0), (nextEventTime = 0), (startOffset = ctx.currentTime + 0.005), scheduleLoop()
    }
    function stop() {
      fillOneShotActive = !1
      fillOneShotStepsLeft = 0
      fillPending = !1
      normalPatternBackup = null
      ; (isPlaying = !1),
        (currentStep = 0),
        $('#play').removeClass('btn-pause').addClass('btn-play').html('<i class="fas fa-play"></i>'),
        dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, currentStep)
    }
    function triggerOneShotFill() {
      if (!initialized || !isPlaying) return
      if (fillOneShotActive || fillPending) return
      if (currentStep >= numSteps - 4) {
        fillPending = !0
      } else {
        normalPatternBackup = {}
        for (var ch in currentPattern) normalPatternBackup[ch] = currentPattern[ch].slice()
        var fillSrc = url_collection.fillSequence || url_collection.sequence
        for (var ch in fillSrc) {
          if (currentPattern[ch]) currentPattern[ch] = stringToArray(fillSrc[ch])
        }
        fillOneShotActive = !0
        fillOneShotStepsLeft = currentStep > 0 ? numSteps - currentStep + 1 : numSteps
        if (sequencerViewInstance) {
          for (var ch in sequencerViewInstance.channelViews) {
            sequencerViewInstance.channelViews[ch].model = currentPattern[ch]
            sequencerViewInstance.channelViews[ch].render()
          }
        }
        $('#fill-in-button').addClass('fill-active')
        $('#sequencer-panel').addClass('fill-active')
      }
    }
    function init(options) {
      dispatcher.register(eventKeys), new SequencerView(options).render(), setTempo(90), (initialized = !0)
    }
var thisBpm,
  interval,
  nextEventTime,
  startOffset,
  timerId,
  numSteps = 16,
  eventKeys = {
        SEQUENCER_PLAY: 'sequencer:play',
        SEQUENCER_STOP: 'sequencer:stop',
        SEQUENCER_SET_PATTERN: 'sequencer:setpattern',
        SEQUENCER_SET_PATTERN_FROM_TACT: 'sequencer:settPatternFromTact',
        SEQUENCER_SET_TEMPO: 'sequencer:settempo',
        SEQUENCER_PATTERN_CHANGED: 'sequencer:patternchanged',
        SEQUENCER_STEP: 'sequencer:step',
        SEQUENCER_NOTE_PLAY: 'sequencer:noteplay',
        SEQUENCER_SET_STEPS: 'sequencer:setsteps',
        SEQUENCER_SET_FILL: 'sequencer:setfill',
        SEQUENCER_ONE_SHOT_FILL: 'sequencer:oneshotfill'
      },
      initialized = !1,
      currentStep = 0,
      isPlaying = !1,
      currentPattern = null,
      activeChannels = {},
      noteState = {},
      mutedChannels = {},
      fillOneShotActive = !1,
      fillOneShotStepsLeft = 0,
      fillPending = !1,
      normalPatternBackup = null,
      sequencerViewInstance = null,
      SequencerView = Backbone.View.extend({
        channelViews: {},
        initialize: function (options) {
          sequencerViewInstance = this
          this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_PLAY, play),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_STOP,
              this.stop
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN,
              this.setPattern
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN_FROM_TACT,
              this.settPatternFromTact
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_SET_TEMPO,
              setTempo
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_STEP,
              this.setPlayhead
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_NOTE_PLAY,
              this.onNotePlay
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_SET_STEPS,
              this.onSetSteps
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_SET_FILL,
              this.setFill
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.SEQUENCER_ONE_SHOT_FILL,
              triggerOneShotFill
            )
        },
        setFill: function () {
          if (!currentPatternForSwing) return
          for (var ch in url_collection.sequence)
            currentPatternForSwing.sequence[ch] = url_collection.sequence[ch]
          for (var ch in url_collection.fillSequence)
            currentPatternForSwing.fillSequence[ch] = url_collection.fillSequence[ch]
          initPattern(currentPatternForSwing)
          for (var ch in this.channelViews) {
            this.channelViews[ch].model = currentPattern[ch]
            this.channelViews[ch].render()
          }
          $('#fill-in-button').toggleClass('fill-active', url_collection.fillActive)
          $('#sequencer-panel').toggleClass('fill-active', url_collection.fillActive)
          generateURL()
        },
        onSetSteps: function (newSteps) {
          if (newSteps < 1) newSteps = 1
          if (newSteps > 64) newSteps = 64
          numSteps = newSteps
          for (var ch in currentPattern) {
            var cur = currentPattern[ch].length
            if (cur < numSteps) {
              for (var j = cur; j < numSteps; j++) currentPattern[ch].push('0')
            } else if (cur > numSteps) {
              currentPattern[ch].splice(numSteps)
            }
          }
          for (var ch in currentPattern)
            url_collection.sequence[ch] = currentPattern[ch].join('')
          for (var ch in url_collection.fillSequence) {
            var cur = url_collection.fillSequence[ch].length
            if (cur < numSteps) {
              for (var j = cur; j < numSteps; j++) url_collection.fillSequence[ch] += '0'
            } else if (cur > numSteps) {
              url_collection.fillSequence[ch] = url_collection.fillSequence[ch].substring(0, numSteps)
            }
          }
          for (var ch in this.channelViews) {
            this.channelViews[ch].model = currentPattern[ch]
            this.channelViews[ch].render()
          }
          generateURL()
        },
        settPatternFromTact: function (patternData) {
          $('#fill-in-button').removeClass('fill-active')
          $('#sequencer-panel').removeClass('fill-active')
          initPattern(patternData), this.render(), (currentPatternForSwing = patternData), (noteState = {})
          for (var ch in this.channelViews) {
            this.channelViews[ch].undelegateEvents()
            this.channelViews[ch].stopListening()
          }
          this.channelViews = {}
          for (var ch in currentPattern) {
            var el = this.$el.find('.channel[data-inst="' + ch + '"]')
            this.channelViews[ch] = new ChannelView({
              channel: ch,
              model: currentPattern[ch],
              el: el,
              pattern_name: TRANSLATION.patternName[ch],
              muted: patternData.muted[ch],
              rhythm: patternData.rhythm
            })
          }
          this.renderChannels()
        },
        setPattern: function (patternData) {
          url_collection.fillActive = !1
          $('#fill-in-button').removeClass('fill-active')
          $('#sequencer-panel').removeClass('fill-active')
          initPattern(patternData), this.render(), (currentPatternForSwing = patternData)
          var idx = 0
          for (var ch in this.channelViews) {
            this.channelViews[ch].undelegateEvents()
            this.channelViews[ch].stopListening()
          }
          this.channelViews = {}
          for (var ch in currentPattern) {
            var el = this.$el.find('.channel[data-inst="' + ch + '"]')
              ; (this.channelViews[ch] = new ChannelView({
                channel: ch,
                model: currentPattern[ch],
                el: el,
                pattern_name: TRANSLATION.patternName[ch],
                muted: patternData.muted[idx],
                rhythm: patternData.rhythm
              })),
                idx++
          }
          this.renderChannels(), generateURL()
        },
        render: function () {
          return this
        },
        renderChannels: function () {
          this.$channelContainer = this.$el.find('.sequencer-channels')
          for (var ch in this.channelViews) this.channelViews[ch].render()
          this.$steps = $('.channel span')
        },
        setPlayhead: function (step) {
          for (var ch in this.channelViews) this.channelViews[ch].setPlayhead(step)
        },
        stop: function () {
          stop()
          for (var ch in this.channelViews) this.channelViews[ch].clearPlayhead()
        }
      }),
      ChannelView = Backbone.View.extend({
        events: {
          'click .seq-row span': 'onNoteClick',
          'click .pad': 'onPadClick',
          'click .mute': 'onMuteClick'
        },
        channel: null,
        active: !0,
        initialize: function (options) {
          ; (this.channel = options.channel),
            (this.pattern_name = options.pattern_name),
            (this.muted = options.muted),
            (this.rhythm = options.rhythm)
        },
        render: function () {
          var notesHtml = ''
          for (var ni = 0; ni < this.model.length; ni++)
            notesHtml += '<span data-tic="' + ni + '" class=""></span>'
          this.$el.find('.seq-row.inline').html(notesHtml)
          this.$notes = this.$el.find('.seq-row span'),
            (this.$eq_bar = this.$el.find('.meter span')),
            (this.$active = this.$el.find('.mute'))
          var self = this,
            measureNum = 1
          return (
            this.model.forEach(function (note, idx) {
              var noteEl = self.$notes.eq(idx)
              '1' === note
                ? (noteEl.addClass('seq-note'),
                  (noteState[self.el.dataset.count + ':' + idx] =
                    self.el.dataset.count + '.' + idx + '.' + note))
                : ('2' === note && 'hihat' == self.channel) ||
                  ('2' === note && 'sidetamlys' == self.channel) ||
                  ('2' === note && 'lilletromme' == self.channel)
                  ? (noteEl.addClass('seq-note-yellow'),
                    (noteState[self.el.dataset.count + ':' + idx] =
                      self.el.dataset.count + '.' + idx + '.' + note))
                  : '3' === note
                    ? noteEl.addClass('seq-note-empty')
                    : delete noteState[self.el.dataset.count + ':' + idx],
                '4/4' == self.rhythm || '3/4' == self.rhythm
                  ? (idx % 4 === 0 &&
                    noteEl.addClass('seq-step-measure').html(idx / 4 + 1),
                    swing_toggler && idx % 4 === 3 && noteEl.hide())
                  : ('5/4' != self.rhythm && '6/8' != self.rhythm) ||
                  (idx % 2 === 0 && noteEl.addClass('seq-step-measure').html(measureNum++))
            }),
            (url_collection.fillActive ? url_collection.fillSequence : url_collection.sequence)[self.channel] = self.model.join(''),
            this.active
              ? delete mutedChannels[self.el.dataset.count]
              : (mutedChannels[self.el.dataset.count] = self.el.dataset.count),
            this.muted
              ? (this.$active.toggleClass('active', !this.active),
                this.$notes.toggleClass('seq-active', !this.active),
                (activeChannels[this.channel] = !this.active),
                (mutedChannels[self.el.dataset.count] = self.el.dataset.count),
                this.active || delete mutedChannels[self.el.dataset.count])
              : (this.$active.toggleClass('active', this.active),
                this.$notes.toggleClass('seq-active', this.active),
                (activeChannels[this.channel] = this.active)),
            (url_collection.muted = mutedChannels),
            (url_collection.rhythm = self.rhythm),
            (url_collection.swing = swing_toggler),
            this
          )
        },
        clearPlayhead: function () {
          this.$notes.removeClass('seq-playhead')
        },
        setPlayhead: function (step) {
          this.clearPlayhead(),
            this.$notes
              .filter('[data-tic="' + step + '"]')
              .addClass('seq-playhead')
        },
        onNoteClick: function (event) {
          var step = $(event.currentTarget).attr('data-tic'),
            val = currentPattern[this.channel][step],
            accentChannels = ['hihat', 'sidetamlys', 'lilletromme'],
            accentMap = {
              hihat: 'aabenhihat',
              sidetamlys: 'sidetamdyb',
              lilletromme: 'kantslag'
            }
          accentChannels.includes(this.channel)
            ? (currentPattern[this.channel][step] =
              '2' === val ? '0' : (parseInt(val) + 1).toString())
            : (currentPattern[this.channel][step] = '1' === val ? '0' : '1')
          var newVal = currentPattern[this.channel][step]
          isPlaying ||
            '0' === newVal ||
            ('2' === newVal && this.channel in accentMap
              ? sampleBank.play(accentMap[this.channel])
              : sampleBank.play(this.channel)),
            $('.clearBtn').toggleClass(
              'clearBtn-disabled',
              Object.values(currentPattern).every(function (chArr) {
                return chArr.every(function (noteVal) {
                  return '0' === noteVal
                })
              })
            ),
            this.render(),
            generateURL()
        },
        onMuteClick: function (event) {
          ; (this.active = !this.active),
            (activeChannels[this.channel] = this.active),
            this.$active.toggleClass('active', this.active),
            this.$notes.toggleClass('seq-active', this.active),
            this.active || $('.clearBtn').removeClass('clearBtn-disabled'),
            this.render(),
            generateURL()
        },
        spikeEQ: function () {
          var self = this
          this.$eq_bar.removeClass('fade'),
            this.$eq_bar.css('transform', 'scaleX(1)'),
            setTimeout(function () {
              self.$eq_bar.addClass('fade'),
                self.$eq_bar.css('transform', 'scaleX(0)')
            }, 50)
        }
      })
    return { init: init }
  })(AUDIO, SampleBank),
  Transport = (function () {
    function requestPlay() {
      dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY)
    }
    function requestStop() {
      dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP)
    }
    function init(options) {
      dispatcher.register(eventKeys), new TransportView(options).render()
    }
    var eventKeys = {
      TRANSPORT_PLAY: 'transport:play',
      TRANSPORT_STOP: 'transport:stop',
      TRANSPORT_CLEAR: 'transport:clear',
      TRANSPORT_REQUEST_PLAY: 'transport:requestplay',
      TRANSPORT_REQUEST_STOP: 'transport:requeststop',
      TRANSPORT_REQUEST_MUTE: 'transport:requestmute',
      TRANSPORT_TEMPO_CHANGED: 'transport:tempochanged',
      TRANSPORT_CHANGE_TEMPO: 'transport:changetempo'
    },
      emptyPatterns = {
        '3/4': {
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          fillSequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '3/4'
        },
        '4/4': {
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            crash: '0000000000000000',
            hihat: '0000000000000000',
            lilletromme: '0000000000000000',
            stortromme: '0000000000000000'
          },
          fillSequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            crash: '0000000000000000',
            hihat: '0000000000000000',
            lilletromme: '0000000000000000',
            stortromme: '0000000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        '5/4': {
          sequence: {
            hihatfod: '0000000000',
            sidetamlys: '0000000000',
            gulvtam: '0000000000',
            ride: '0000000000',
            crash: '0000000000',
            hihat: '0000000000',
            lilletromme: '0000000000',
            stortromme: '0000000000'
          },
          fillSequence: {
            hihatfod: '0000000000',
            sidetamlys: '0000000000',
            gulvtam: '0000000000',
            ride: '0000000000',
            crash: '0000000000',
            hihat: '0000000000',
            lilletromme: '0000000000',
            stortromme: '0000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '5/4'
        },
        '6/8': {
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          fillSequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '6/8'
        }
      },
      TransportView = Backbone.View.extend({
        events: {
          'click .btn-play, .btn-pause': function (event) {
            var btn = $(event.target).closest('.btn-play, .btn-pause')
            btn.toggleClass('btn-play btn-pause')
            btn.html(btn.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>')
          },
          'click .btn-play': 'onPlayClick',
          'click .btn-pause': 'onStopClick',


          'mouseover .dropdown button': 'showDropdown',
          'mouseleave .dropdown': 'hideDropdown'
        },
        initialize: function (options) {
          var self = this
          this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_PLAY, requestPlay),
            this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_STOP, requestStop),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.TRANSPORT_CLEAR,
              this.onClearBtnClick
            ),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.TRANSPORT_CHANGE_TEMPO,
              this.onIncomingTempoChange
            ),
            (this.spacePressed = !1),
            $(document).on('keydown', this.keydown.bind(this)),
            $(document).on('keyup', this.keyup.bind(this)),
            $(document).on('click', '.modal-button', function () {
              dispatcher.trigger(dispatcher.EventKeys.MODAL_OPEN)
            }),
            $(document).on('click', '.modal-container', function (event) {
              event.target.classList.contains('modal-container') &&
                (dispatcher.trigger(dispatcher.EventKeys.MODAL_CLOSE),
                  $('.dropdown__content').removeClass('active'))
            }),
            $(document).on('click', '.save-preset', this.onSavePreset.bind(this)),
            $(document).on('click', '.load-presets-btn', this.populatePresetSelect.bind(this)),
            $(document).on('change', '#global-preset-select', this.onPresetSelectChange.bind(this)),
            $(document).on('click', '#global-prev-preset', function () {
              var sel = $('#global-preset-select')[0]
              if (!sel) return
              var len = sel.options.length
              if (len <= 1) return
              sel.selectedIndex = (sel.selectedIndex - 1 + len) % len
              $(sel).trigger('change')
            }),
            $(document).on('click', '#global-next-preset', function () {
              var sel = $('#global-preset-select')[0]
              if (!sel) return
              var len = sel.options.length
              if (len <= 1) return
              sel.selectedIndex = (sel.selectedIndex + 1) % len
              $(sel).trigger('change')
            }),
            $(document).on('click', '.clearBtn', function (event) {
              event.preventDefault()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_CLEAR)
            }),
            $(document).on('click', '#fill-in-button', function () {
              if ($('#play').hasClass('btn-pause')) {
                dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_ONE_SHOT_FILL)
              } else {
                url_collection.fillActive = !url_collection.fillActive
                dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_FILL)
              }
            }),
            $(document).on('click', '.steps-minus', function () {
              var cur = parseInt($('.transport-steps-display').val(), 10) || 16
              if (cur > 1) $('.transport-steps-display').val(cur - 1)
              dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_STEPS, parseInt($('.transport-steps-display').val(), 10))
            }),
            $(document).on('click', '.steps-plus', function () {
              var cur = parseInt($('.transport-steps-display').val(), 10) || 16
              if (cur < 64) $('.transport-steps-display').val(cur + 1)
              dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_STEPS, parseInt($('.transport-steps-display').val(), 10))
            }),
            $(document).on('click', '.tempo-minus', function () {
              var cur = parseInt($('.transport-tempo-display').val(), 10) || 90
              if (cur > 30) $('.transport-tempo-display').val(cur - 1)
              var tempo = parseInt($('.transport-tempo-display').val(), 10)
              url_collection.tempo = tempo
              url_collection.rhythm = currentPatternForSwing.rhythm
              url_collection.swing = swing_toggler
              generateURL()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, swing_toggler ? tempo / ('5/4' === currentPatternForSwing.rhythm || '6/8' === currentPatternForSwing.rhythm ? 0.66666666666 : 1.33) : tempo)
            }),
            $(document).on('click', '.tempo-plus', function () {
              var cur = parseInt($('.transport-tempo-display').val(), 10) || 90
              if (cur < 250) $('.transport-tempo-display').val(cur + 1)
              var tempo = parseInt($('.transport-tempo-display').val(), 10)
              url_collection.tempo = tempo
              url_collection.rhythm = currentPatternForSwing.rhythm
              url_collection.swing = swing_toggler
              generateURL()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, swing_toggler ? tempo / ('5/4' === currentPatternForSwing.rhythm || '6/8' === currentPatternForSwing.rhythm ? 0.66666666666 : 1.33) : tempo)
            }),
            $(document).on('change', '.transport-tempo-display', function () {
              var val = parseInt($(this).val(), 10)
              if (isNaN(val) || val < 30) val = 30
              if (val > 250) val = 250
              $(this).val(val)
              url_collection.tempo = val
              url_collection.rhythm = currentPatternForSwing.rhythm
              url_collection.swing = swing_toggler
              generateURL()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, swing_toggler ? val / ('5/4' === currentPatternForSwing.rhythm || '6/8' === currentPatternForSwing.rhythm ? 0.66666666666 : 1.33) : val)
            }),
            $(document).on('change', '.transport-steps-display', function () {
              var val = parseInt($(this).val(), 10)
              if (isNaN(val) || val < 1) val = 1
              if (val > 64) val = 64
              $(this).val(val)
              dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_STEPS, val)
            })
        },
        render: function () {
          return (
            $('body').on('click', this.outsideClickDetect),
            window.addEventListener(
              'popstate',
              this.backButtonFunctionalityURL,
              !1
            ),
            this.populatePresetSelect(),
            this
          )
        },
        outsideClickDetect: function (event) {
          var target = $(event.target)
          if (target.closest('.dropdown').length) return
          $('.dropdown').find('.dropdown-content').removeClass('active')
        },
        backButtonFunctionalityURL: function () {
          window.location.href = document.referrer
        },
        onPlayClick: requestPlay,
        onStopClick: requestStop,
        onIncomingTempoChange: function (tempo) {
          $('.transport-tempo-display').val(Math.round(tempo)),
            dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, tempo)
        },
        keydown: function (event) {
          var curTempo = parseInt($('.transport-tempo-display').val(), 10) || 90,
            playBtn = $('#play')
          switch (event.keyCode) {
            case 32:
              event.preventDefault(),
                this.spacePressed ||
                ((this.spacePressed = !0),
                  playBtn.toggleClass('btn-play btn-pause').html(playBtn.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>'),
                  playBtn.hasClass('btn-pause')
                    ? dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_PLAY, requestPlay)
                    : requestStop())
              break
            case 37:
            case 39:
              if (event.target.tagName === 'INPUT') break
              var newVal = 37 === event.keyCode ? Math.max(30, curTempo - 1) : Math.min(250, curTempo + 1)
              $('.transport-tempo-display').val(newVal)
              ;(37 === event.keyCode ? $('.tempo-minus') : $('.tempo-plus')).trigger('click')
          }
        },
        keyup: function (event) {
          32 === event.keyCode && (this.spacePressed = !1)
        },
        onClearBtnClick: function (event) {
          event && event.preventDefault()
          for (var ch in url_collection.sequence)
            currentPatternForSwing.sequence[ch] = url_collection.sequence[ch]
          for (var ch in url_collection.fillSequence)
            currentPatternForSwing.fillSequence[ch] = url_collection.fillSequence[ch]
          var target = url_collection.fillActive ? currentPatternForSwing.fillSequence : currentPatternForSwing.sequence
          for (var ch in target)
            target[ch] = target[ch].replace(/1/g, '0').replace(/2/g, '0')
          url_collection.fillActive
            ? (url_collection.fillSequence = currentPatternForSwing.fillSequence)
            : (url_collection.sequence = currentPatternForSwing.sequence)
          $('.clearBtn').addClass('clearBtn-disabled')
          resetURL(),
            dispatcher.trigger(
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN_FROM_TACT,
              currentPatternForSwing
            )
        },
        hideDropdown: function (event) {
          $(event.currentTarget).find('.dropdown-content').removeClass('active')
        },
        showDropdown: function (event) {
          $(event.currentTarget)
            .parent()
            .find('.dropdown-content')
            .addClass('active')
        },
        onBeatClick: function (event) {
          $(event.currentTarget)
            .parent()
            .find('.dropdown-content')
            .toggleClass('active')
        },
        populatePresetSelect: function () {
          var sel = $('#global-preset-select')
          sel.empty()
          var saved = JSON.parse(localStorage.getItem('drum_saved_presets') || '{}')
          var keys = Object.keys(saved)
          if (keys.length) {
            sel.append('<option value="">-- Select Preset --</option>')
            for (var i = 0; i < keys.length; i++) {
              sel.append('<option value="' + keys[i] + '">' + keys[i] + '</option>')
            }
          } else {
            sel.append('<option value="">No saved presets</option>')
          }
        },
        onPresetSelectChange: function () {
          var val = $('#global-preset-select').val()
          if (!val) return
          var saved = JSON.parse(localStorage.getItem('drum_saved_presets') || '{}')
          var urlData = saved[val]
          if (!urlData) return
          var parts = urlData.split('||fill||'),
            mainData = parts[0],
            fillData = parts[1] || null
          var decoded = fillData ? decodeURL(mainData, fillData) : decodeURL(mainData)
          if (!decoded) return
          url_collection = decoded
          numSteps = decoded.steps || 16
          $('.transport-steps-display').val(numSteps)
          'standard' !== decoded.sound &&
            $('.sound-types-button').text(SOUND_TYPES[decoded.sound])
          dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, decoded.sound)
          decoded.swing
            ? (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, decoded),
              dispatcher.trigger(dispatcher.EventKeys.SWING_SELECTED))
            : (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, decoded),
              dispatcher.trigger(
                dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
                decoded.tempo
              ))
          window.history.replaceState('', '', '?data=' + encodeURIComponent(mainData) + '&data_fill=' + encodeURIComponent(fillData || ''))
        },
        onSavePreset: function () {
          var name = prompt('Preset name:')
          if (!name) return
          generateURL()
          var urlObj = new URL(window.location.href),
            dataPart = urlObj.searchParams.get('data'),
            fillPart = urlObj.searchParams.get('data_fill') || ''
          if (!dataPart) return
          var saved = JSON.parse(localStorage.getItem('drum_saved_presets') || '{}')
          saved[name] = dataPart + '||fill||' + fillPart
          localStorage.setItem('drum_saved_presets', JSON.stringify(saved))
          this.populatePresetSelect()
        },
      })
    return { init: init }
  })(),
  SoundTypes = (function () {
    function init(options) {
      dispatcher.register(eventKeys), new SoundTypesView(options).render()
    }
    var eventKeys = { SOUND_SELECTED: 'sound:selected' },
      soundMap = {
        standard: 'standard',
        powerful: 'powerful',
        monumental: 'monumental',
        smooth: 'smooth',
        minimalistic: 'minimalistic',
        energetic: 'energetic'
      },
      SoundTypesView = Backbone.View.extend({
        events: { 'click .sound-item': 'onSoundClick' },
        initialize: function () {
          this.listenTo(
            dispatcher,
            dispatcher.EventKeys.SOUND_SELECTED,
            this.onSoundSelected
          )
        },
        render: function () {
          var html = ''
          for (var key in soundMap) {
            var label = SOUND_TYPES[key] || key
            html += '<li data-sound-id="' + key + '" class="sound-item">' + label + '</li>'
          }
          this.$el.html(html)
          this.$items = this.$el.find('.sound-item')
          return this
        },
        onSoundClick: function (event) {
          event.preventDefault()
          var label = $(event.currentTarget).text(),
            id = $(event.currentTarget).attr('data-sound-id')
          this.$items.removeClass('sound_active active'),
            $(event.currentTarget).addClass('sound_active active'),
            $('.dropdown ul').removeClass('active'),
            $('.sound-types-button').text(label),
            dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, soundMap[id]),
            url_collection.sound !== soundMap[id] &&
            ((url_collection.sound = soundMap[id]), generateURL())
        }
      })
    return { init: init }
  })(),
  TimeSignature = (function () {
    function init(options) {
      dispatcher.register(eventKeys), new TimeSignatureView(options).render()
    }
    var eventKeys = { BEAT_SELECTED: 'beat:selected' },
      signatures = ['3/4', '4/4', '5/4', '6/8'],
      emptyPatternData = {
        '3/4': {
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          fillSequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '3/4'
        },
        '4/4': {
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            crash: '0000000000000000',
            hihat: '0000000000000000',
            lilletromme: '0000000000000000',
            stortromme: '0000000000000000'
          },
          fillSequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            crash: '0000000000000000',
            hihat: '0000000000000000',
            lilletromme: '0000000000000000',
            stortromme: '0000000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        '5/4': {
          sequence: {
            hihatfod: '0000000000',
            sidetamlys: '0000000000',
            gulvtam: '0000000000',
            ride: '0000000000',
            crash: '0000000000',
            hihat: '0000000000',
            lilletromme: '0000000000',
            stortromme: '0000000000'
          },
          fillSequence: {
            hihatfod: '0000000000',
            sidetamlys: '0000000000',
            gulvtam: '0000000000',
            ride: '0000000000',
            crash: '0000000000',
            hihat: '0000000000',
            lilletromme: '0000000000',
            stortromme: '0000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '5/4'
        },
        '6/8': {
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          fillSequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            crash: '000000000000',
            hihat: '000000000000',
            lilletromme: '000000000000',
            stortromme: '000000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '6/8'
        }
      },
      TimeSignatureView = Backbone.View.extend({
        events: { 'click .set-beat': 'onBeatClick' },
        initialize: function () {
          this.listenTo(
            dispatcher,
            dispatcher.EventKeys.BEAT_SELECTED,
            this.onBeatSelected
          )
        },
        render: function () {
          var html = ''
          for (var bi = 0; bi < signatures.length; bi++)
            html += '<li class="set-beat" data-beat="' + signatures[bi] + '">' + signatures[bi] + '</li>'
          this.$el.html(html)
          this.$items = this.$el.find('.set-beat')
          return this
        },
        onBeatClick: function (event) {
          event.preventDefault()
          var beat = $(event.currentTarget).text()
          this.$items.removeClass('beat_active active'),
            $(event.currentTarget).addClass('beat_active active'),
            $('.dropdown ul').removeClass('active'),
            $('.beatTime').text(beat),
            $('.clearBtn').addClass('clearBtn-disabled')
          var tempo = parseInt($('.transport-tempo-display').val(), 10) || 90
          currentPatternForSwing = emptyPatternData[beat] || currentPatternForSwing
          for (var ch in currentPatternForSwing.sequence)
            (currentPatternForSwing.sequence[ch] =
              currentPatternForSwing.sequence[ch].replace(/1/g, '0')),
              (currentPatternForSwing.sequence[ch] =
                currentPatternForSwing.sequence[ch].replace(/2/g, '0'))
          for (var ch in currentPatternForSwing.fillSequence)
            (currentPatternForSwing.fillSequence[ch] =
              currentPatternForSwing.fillSequence[ch].replace(/1/g, '0')),
              (currentPatternForSwing.fillSequence[ch] =
                currentPatternForSwing.fillSequence[ch].replace(/2/g, '0'))
              ; (url_collection.sequence = currentPatternForSwing.sequence),
                (url_collection.fillSequence = currentPatternForSwing.fillSequence),
                (url_collection.fillActive = !1),
                (url_collection.rhythm = beat),
                generateURL()
          var playBtn = $('#play')
          playBtn[0].classList.contains('btn-pause') &&
            (dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP),
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY),
              playBtn.toggleClass('btn-play btn-pause').html(playBtn.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>')),
            dispatcher.trigger(
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN_FROM_TACT,
              currentPatternForSwing
            ),
            dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, tempo),
            dispatcher.trigger(dispatcher.EventKeys.BEAT_SELECTED, beat)
        }
      })
    return { init: init }
  })(),
  SwingRhythm = (function () {
    function init(options) {
      dispatcher.register(eventKeys), new SwingRhythmView(options).render()
    }
    var eventKeys = { SWING_SELECTED: 'swing:selected' },
      SwingRhythmView = Backbone.View.extend({
        events: { 'click .swing-toggle': 'onSwingClick' },
        initialize: function () {
          this.listenTo(
            dispatcher,
            dispatcher.EventKeys.SWING_SELECTED,
            this.onSwingClick
          )
        },
        render: function () {
          return this
        },
        onSwingClick: function () {
          if (url_collection.fillActive) {
            url_collection.fillActive = !1
            $('#fill-in-button').removeClass('fill-active')
            $('#sequencer-panel').removeClass('fill-active')
          }
          swing_toggler = !swing_toggler
          var rows = $('#sequencer-panel').find('.seq-row'),
            muteBtns = $('.sequencer-channels').find('.mute')
          this.$el.find('.swing-toggle').toggleClass('active', swing_toggler),
            rows.each(function (rowIdx) {
              var pattern = '',
                spans = $(this).find('span')
              spans.each(function (spanIdx) {
                if ($(spans[spanIdx]).hasClass('seq-note')) pattern += '1'
                else if ($(spans[spanIdx]).hasClass('seq-note-yellow')) pattern += '2'
                else {
                  if ($(spans[spanIdx]).hasClass('seq-note-empty')) return pattern
                  pattern += '0'
                }
              }),
                (currentPatternForSwing.sequence[
                  Object.keys(currentPatternForSwing.sequence)[rowIdx]
                ] = pattern)
            })
          var tempo = parseInt($('.transport-tempo-display').val(), 10) || 90
          swing_toggler
            ? '5/4' === currentPatternForSwing.rhythm ||
              '6/8' === currentPatternForSwing.rhythm
              ? (newTempo = tempo / 0.66666666666)
              : (newTempo = tempo / 1.33)
            : (newTempo = tempo),
            (currentPatternForSwing.muted = {}),
            muteBtns.each(function (muteIdx) {
              $(this).hasClass('active') ||
                (currentPatternForSwing.muted[muteIdx] = 1)
            }),
            dispatcher.trigger(
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN,
              currentPatternForSwing
            ),
            dispatcher.trigger(
              dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
              newTempo
            )
        }
      })
    return { init: init }
  })(),
  Modal = (function () {
    function init(options) {
      dispatcher.register(eventKeys), new ModalView(options).render()
    }
    var eventKeys = { MODAL_OPEN: 'modal:open', MODAL_CLOSE: 'modal:close' },
      ModalView = Backbone.View.extend({
        events: { 'click .dropdown__select': 'toggleDropdown' },
        initialize: function () {
          this.listenTo(dispatcher, dispatcher.EventKeys.MODAL_OPEN, this.open),
            this.listenTo(
              dispatcher,
              dispatcher.EventKeys.MODAL_CLOSE,
              this.close
            ),
            (this.toggleDropdown = this.toggleDropdown.bind(this))
        },
        render: function () {
          return $('.modal').on('click', this.outsideClick.bind(this)), this
        },
        outsideClick: function (event) {
          0 === $(event.target).closest('.dropdown__select').length &&
            0 === $(event.target).closest('.dropdown__content').length &&
            this.$el.find('.dropdown__content').removeClass('active')
        },
        toggleDropdown: function (event) {
          event.stopPropagation(),
            this.$el
              .find('.dropdown__content')
              .not($(event.currentTarget).find('.dropdown__content'))
              .removeClass('active'),
            $(event.currentTarget).find('.dropdown__content').toggleClass('active')
        },
        open: function () {
          this.$el.show()
        },
        close: function () {
          this.$el.hide()
        }
      })
    return { init: init }
  })(),
  Mixer = (function () {
    function init(options) {
      dispatcher.register(eventKeys), new MixerView(options).render()
    }
    var channelList = ['hihatfod', 'sidetamlys', 'gulvtam', 'ride', 'crash', 'hihat', 'lilletromme', 'stortromme', 'aabenhihat', 'kantslag', 'sidetamdyb'],
      channelNames = TRANSLATION.patternName,
      eventKeys = { MIXER_CHANGE: 'mixer:change' },
      MixerView = Backbone.View.extend({
        initialize: function () {
          var self = this
          this.listenTo(dispatcher, dispatcher.EventKeys.MIXER_CHANGE, this.render)
          $(document).on('input', '.mixer-fader', function (event) { self.onFaderChange(event) })
          $(document).on('input', '.eq-fader', function (event) { self.onEQChange(event) })
          $(document).on('input', '.fx-fader', function (event) { self.onFXChange(event) })
        },
        render: function () {
          var _this = this
          function mapRange(val, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin) }
          function fromSliderValue(val) { val = parseInt(val); if (val <= 50) return val; if (val <= 60) return 50; return val - 10 }
          function toSliderValue(val) { if (val < 50) return val; if (val === 50) return 55; return val + 10 }
          var master = SampleBank.getMasterGain()
          $('.mixer-fader[data-channel="master"]').val(master)
          $('.mixer-value-master').text(Math.round(master * 100) + '%')
          for (var ci in channelList) {
            var ch = channelList[ci], gain = SampleBank.getGain(ch)
            $('.mixer-fader[data-channel="' + ch + '"]').val(gain)
            $('.mixer-fader[data-channel="' + ch + '"]').closest('.mixer-channel').find('.mixer-value').text(Math.round(gain * 100) + '%')
          }
          var bass = AudioFX.getBass(),
            mid = AudioFX.getMid(),
            treble = AudioFX.getTreble()
          _this.$el.find('[data-eq="bass"]').val(toSliderValue(mapRange(bass, -12, 12, 0, 100)))
          _this.$el.find('[data-eq="mid"]').val(toSliderValue(mapRange(mid, -12, 12, 0, 100)))
          _this.$el.find('[data-eq="treble"]').val(toSliderValue(mapRange(treble, -12, 12, 0, 100)))
          _this.$el.find('[data-eq="filter"]').val(toSliderValue(Math.round(AudioFX.getFilterSlider() * 100)))
          var revMix = AudioFX.getReverbMix()
          _this.$el.find('[data-fx="reverbMix"]').val(revMix)
          var chorus = AudioFX.getChorus()
          _this.$el.find('[data-fx="chorus"]').val(chorus)
          var dTime = AudioFX.getDelayTime()
          _this.$el.find('[data-fx="delayTime"]').val(mapRange(dTime, 0.01, 2, 0, 1))
          var dFb = AudioFX.getDelayFeedback()
          _this.$el.find('[data-fx="delayFeedback"]').val(dFb)
          var dMix = AudioFX.getDelayMix()
          _this.$el.find('[data-fx="delayMix"]').val(dMix)
          return this
        },
        onFaderChange: function (event) {
          var channel = $(event.currentTarget).data('channel'),
            gain = parseFloat($(event.currentTarget).val())
          'master' === channel ? (SampleBank.setMasterGain(gain), localStorage.setItem('drum_master_gain', gain)) : (SampleBank.setGain(channel, gain), localStorage.setItem('drum_gain_' + channel, gain))
          $(event.currentTarget).closest('.mixer-channel').find('.mixer-value').text(Math.round(gain * 100) + '%')
        },
        onEQChange: function (event) {
          var param = $(event.currentTarget).data('eq'),
            rawVal = parseInt($(event.currentTarget).val())
          function fromSliderValue(val) { if (val <= 50) return val; if (val <= 60) return 50; return val - 10 }
          function toSliderValue(val) { if (val < 50) return val; if (val === 50) return 55; return val + 10 }
          var val = fromSliderValue(rawVal)
          event.currentTarget.value = toSliderValue(val)
          function mapRange(val, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin) }
          switch (param) {
            case 'bass':
              AudioFX.setBass(mapRange(val, 0, 100, -12, 12))
              break
            case 'mid':
              AudioFX.setMid(mapRange(val, 0, 100, -12, 12))
              break
            case 'treble':
              AudioFX.setTreble(mapRange(val, 0, 100, -12, 12))
              break
            case 'filter':
              AudioFX.setFilterSlider(val / 100)
              break
          }
          localStorage.setItem('drum_eq_' + param, val)
        },
        onFXChange: function (event) {
          var param = $(event.currentTarget).data('fx'),
            val = parseFloat($(event.currentTarget).val())
          function mapRange(val, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin) }
          switch (param) {
            case 'reverbMix':
              AudioFX.setReverbMix(val)
              break
            case 'chorus':
              AudioFX.setChorus(val)
              break
            case 'delayTime':
              AudioFX.setDelayTime(mapRange(val, 0, 1, 0.01, 2))
              break
            case 'delayFeedback':
              AudioFX.setDelayFeedback(val)
              break
            case 'delayMix':
              AudioFX.setDelayMix(val)
              break
          }
          localStorage.setItem('drum_fx_' + param, val)
        }
      })
    return { init: init }
  })(),
  App = {
    _connectModules: function () {
      dispatcher.register({ PRESET_SELECTED: 'preset:selected' }),
      dispatcher.on(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY, function () {
        dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_PLAY)
      }),
        dispatcher.on(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP, function () {
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STOP)
        }),
        dispatcher.on(
          dispatcher.EventKeys.TRANSPORT_REQUEST_MUTE,
          function (pattern) {
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, pattern)
          }
        ),
        dispatcher.on(
          dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
          function (tempo) {
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_TEMPO, tempo)
          }
        ),
        dispatcher.on(dispatcher.EventKeys.PRESET_SELECTED, function (preset) {
          dispatcher.trigger(
            dispatcher.EventKeys.TRANSPORT_CHANGE_TEMPO,
            preset.tempo
          ),
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, preset)
        }),
        dispatcher.on(dispatcher.EventKeys.SOUND_SELECTED, function (sound) {
          var basePath = 'audio/' + sound + '/',
            samples = {
              hihatfod: basePath + 'hihat-foot.mp3',
              sidetamlys: basePath + 'tom1.mp3',
              gulvtam: basePath + 'floor-tom.mp3',
              ride: basePath + 'ride.mp3',
              crash: basePath + 'crash.mp3',
              hihat: basePath + 'hihat.mp3',
              kantslag: basePath + 'snare-stick.mp3',
              stortromme: basePath + 'bass.mp3',
              aabenhihat: basePath + 'hihat-open.mp3',
              lilletromme: basePath + 'snare-drum.mp3',
              sidetamdyb: basePath + 'tom2.mp3'
            }
          SampleBank.loadNew(samples, function () { })
        })
    },
    onLoad: function () {
      var defaultState = {
        sequence: {
          hihatfod: '0000000000000000',
          sidetamlys: '0000000000000000',
          gulvtam: '0000000000000000',
          ride: '0000000000000000',
          crash: '0000000000000000',
          hihat: '1010101010101010',
          lilletromme: '0000100000001000',
          stortromme: '1000000010000000'
        },
        fillSequence: {
          hihatfod: '0000000000000000',
          sidetamlys: '0000000000000000',
          gulvtam: '0000000000000000',
          ride: '0000000000000000',
          crash: '0000000000000000',
          hihat: '1010101010101010',
          lilletromme: '0000100000001000',
          stortromme: '1000000010000000'
        },
        fillActive: !1,
        muted: {},
        swing: !1,
        rhythm: '4/4',
        tempo: 90,
        sound: 'standard'
      },
        urlData = parseURLData(),
        initialState = urlData ? urlData : defaultState
      this._connectModules(),
        (url_collection = initialState),
        numSteps = initialState.steps || 16,
        $('.transport-steps-display').val(numSteps),
        'standard' !== initialState.sound &&
        $('.sound-types-button').text(SOUND_TYPES[initialState.sound]),
        dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, initialState.sound),
        initialState.swing
          ? (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, initialState),
            dispatcher.trigger(dispatcher.EventKeys.SWING_SELECTED))
          : (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, initialState),
            dispatcher.trigger(
              dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
              initialState.tempo
            ))
    },
    init: function () {
      var sampleNames = {
        hihatfod: 'hihat-foot',
        sidetamlys: 'tom1',
        gulvtam: 'floor-tom',
        ride: 'ride',
        crash: 'crash',
        hihat: 'hihat',
        kantslag: 'snare-stick',
        stortromme: 'bass',
        aabenhihat: 'hihat-open',
        lilletromme: 'snare-drum',
        sidetamdyb: 'tom2'
      },
        urls = {},
        keys = Object.keys(sampleNames)
      keys.forEach(function (key) {
        var name = sampleNames[key]
        urls[key] = 'audio/standard/' + name + '.mp3'
      });
      var channels = ['hihatfod', 'sidetamlys', 'gulvtam', 'ride', 'crash', 'hihat', 'lilletromme', 'stortromme', 'aabenhihat', 'kantslag', 'sidetamdyb']
      SampleBank.initGains(channels)
      var masterGainVal = localStorage.getItem('drum_master_gain')
      masterGainVal && SampleBank.setMasterGain(parseFloat(masterGainVal))
      for (var idx in channels) {
        var savedGain = localStorage.getItem('drum_gain_' + channels[idx])
        savedGain && SampleBank.setGain(channels[idx], parseFloat(savedGain))
      }
      Sequencer.init({ el: $('#sequencer-panel') }),
        Transport.init({ el: $('#transport-panel') }),
        Modal.init({ el: $('.modal-container') }),
        SoundTypes.init({ el: $('.sound-types') }),
        TimeSignature.init({ el: $('.time-signature') }),
        SwingRhythm.init({ el: $('.swing-selector') }),
        Mixer.init({ el: $('#mixer-panel') })
      // Restore saved EQ values (after mixer DOM is created)
      var eqKeys = ['bass','mid','treble','filter']
      for (var k in eqKeys) {
        var eqKey = eqKeys[k]
        var v = localStorage.getItem('drum_eq_' + eqKey)
        if (v) {
          var num = parseFloat(v)
          if (num <= 1) num = Math.round(num * 100)
          var el = $('[data-eq="' + eqKey + '"]')
          el.length && el.val(num).trigger('input')
        }
      }
      var fxKeys = ['reverbMix','chorus','delayTime','delayFeedback','delayMix']
      for (var k in fxKeys) {
        var v = localStorage.getItem('drum_fx_' + fxKeys[k])
        if (v) {
          var el = $('[data-fx="' + fxKeys[k] + '"]')
          el.length && el.val(parseFloat(v)).trigger('input')
        }
      }
      SampleBank.init(urls, this.onLoad.bind(this))
    }
  }

var SCALE_TOGGLE_KEY = 'drum_scale_to_fit'

function scaleToFit() {
  if (localStorage.getItem(SCALE_TOGGLE_KEY) !== 'true') return
  var grid = document.querySelector('.grid-container')
  var wrapper = document.querySelector('.wrapper')
  if (!grid || !wrapper) return
  grid.style.transform = 'scale(1)'
  var naturalW = grid.offsetWidth
  var naturalH = grid.offsetHeight
  if (naturalW === 0 || naturalH === 0) return
  var pad = 20
  var availW = window.innerWidth - pad * 2
  var availH = window.innerHeight - pad * 2
  var scale = Math.min(availW / naturalW, availH / naturalH)
  grid.style.transform = 'scale(' + scale + ')'
}

function resetScale() {
  var grid = document.querySelector('.grid-container')
  if (grid) grid.style.transform = ''
}

$(document).on('click', '.scale-toggle', function () {
  var enabled = localStorage.getItem(SCALE_TOGGLE_KEY) !== 'true'
  localStorage.setItem(SCALE_TOGGLE_KEY, enabled)
  $(this).toggleClass('active', enabled)
  if (enabled) { scaleToFit() } else { resetScale() }
})

var resizeTimer
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(scaleToFit, 100)
})

App.onLoad = (function (orig) {
  return function () {
    orig.call(this)
    if (localStorage.getItem(SCALE_TOGGLE_KEY) === 'true') {
      $('.scale-toggle').addClass('active')
      setTimeout(scaleToFit, 50)
    }
  }
})(App.onLoad)

dispatcher.on('sequencer:setsteps', scaleToFit)
dispatcher.on('sequencer:settPatternFromTact', function () { setTimeout(scaleToFit, 50) })

App.init()
