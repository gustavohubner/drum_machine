function generateURL() {
  function e(e) {
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
    for (var a in e) {
      for (var o = e[a], l = '', c = '', d = 0, h = 0; h < o.length; h++) {
        var m = parseInt(o[h])
        1 === m
          ? ((l += i[h]), d++)
          : 2 === m && ((c += h < 10 ? r[h] : r[h]), d++)
      }
      '' !== l && (t += s[a] + l), '' !== c && (n += s[a] + c)
    }
    return t + '-' + n
  }
  function t(e) {
    var t = ''
    for (var n in e) t += n
    return t
  }
  function n(e) {
    var t = {
      standard: 'a',
      powerful: 'b',
      monumental: 'c',
      smooth: 'd',
      minimalistic: 'e',
      energetic: 'f'
    }
    return t[e]
  }
  var i = ''
    ; (i += url_collection.tempo + '-'),
      (i += numSteps + '-'),
      (i += url_collection.swing ? 'y' : 'n'),
      (i += '-' + url_collection.rhythm.replace('/', '')),
      (i += '-' + n(url_collection.sound)),
      (i += '-' + t(url_collection.muted)),
      (i += '-' + e(url_collection.sequence))
  window.history.pushState('', '', '?data=' + i)
}
function decodeURL(e) {
  function t(e, t, n, i, r, s) {
    var a = e.split(/(?=\d)/) || []
    a.forEach(function (e) {
      for (
        var a = e[0], o = e.slice(1), l = Array(i).fill(0), c = 0;
        c < o.length;
        c++
      ) {
        var d = t.indexOf(o[c])
        d >= -1 && (l[d] = n)
      }
      r[s[a]].forEach(function (e, t) {
        r[s[a]][t] += l[t]
      })
    })
  }
  function n(e, n, i) {
    var r = {
      hihatfod: Array(i).fill(0),
      sidetamlys: Array(i).fill(0),
      gulvtam: Array(i).fill(0),
      ride: Array(i).fill(0),
      crash: Array(i).fill(0),
      hihat: Array(i).fill(0),
      lilletromme: Array(i).fill(0),
      stortromme: Array(i).fill(0)
    },
      s = {
        1: 'hihatfod',
        2: 'sidetamlys',
        3: 'gulvtam',
        4: 'ride',
        8: 'crash',
        5: 'hihat',
        6: 'lilletromme',
        7: 'stortromme'
      },
      a = 'abcdefghijklmnop',
      o = 'qrstuvwxyzabcdef'
    e && t(e, a, 1, i, r, s), n && t(n, o, 2, i, r, s)
    for (var l in r) r[l] = r[l].join('')
    return r
  }
  function i(e) {
    for (var t = {}, n = 0; n < e.length; n++) t[e[n]] = !0
    return t
  }
  function r(e) {
    var t = {
      a: 'standard',
      b: 'powerful',
      c: 'monumental',
      d: 'smooth',
      e: 'minimalistic',
      f: 'energetic'
    }
    return t[e]
  }
  function s(e) {
    switch (e) {
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
  var a = e.split('-'),
    o = {}
  if (a[1] === 'y' || a[1] === 'n') {
    o.tempo = parseInt(a[0])
    o.steps = s(a[2])
    o.swing = 'y' === a[1]
    o.rhythm = a[2].split('').join('/')
    o.sound = r(a[3])
    o.muted = i(a[4])
    o.sequence = n(a[5], a[6], s(a[2]))
  } else {
    o.tempo = parseInt(a[0])
    o.steps = parseInt(a[1], 10) || 16
    o.swing = 'y' === a[2]
    o.rhythm = a[3].split('').join('/')
    o.sound = r(a[4])
    o.muted = i(a[5])
    o.sequence = n(a[6], a[7], o.steps)
  }
  return o
}
function parseURLData() {
  var e = new URL(window.location.href),
    t = e.searchParams.get('data')
  if (!t) return null
  var n = decodeURIComponent(t)
  return n.includes('-') && n.includes('"')
    ? decodeOldURL(n)
    : n.includes('"')
      ? null
      : decodeURL(n)
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
    muted: {},
    rhythm: '4/4',
    tempo: 90,
    swing: !1,
    sound: 'standard'
  },
  dispatcher = _.extend(
    {
      EventKeys: {},
      register: function (e) {
        for (var t in e) {
          if (t in this.EventKeys)
            throw 'Dispatcher error: duplicate event key: ' + t
          this.EventKeys[t] = e[t]
        }
      }
    },
    Backbone.Events
  ),
  SampleBank = (function (e) {
    function t(e, t) {
      for (var i in e) c++
      for (var i in e) r(i, e[i])
      n = t
    }
    function n() {
      console.warn('Need to pass a callback to load()')
    }
    function i(e, t) {
      return t
        ? ((o[e] = t), void (++l == c && n()))
        : void console.error('Unable to decode audio data', url)
    }
    function r(t, n) {
      var r = new XMLHttpRequest()
        ; (r.responseType = 'arraybuffer'),
          (r.onload = function () {
            e.decodeAudioData(
              r.response,
              function (e) {
                i(t, e)
              },
              function (e) {
                console.error('Unable to decode audio data', e)
              }
            )
          }),
          (r.onerror = function (e) {
            console.error('Error loading sample data', t, n, e)
          }),
          r.open('GET', n, !0),
          r.send()
    }
    function s(e, n) {
      ; (o = {}), (l = 0), (c = 0), t(e, n)
    }
    function a(t, n) {
      var i = e.createBufferSource()
      i.buffer = o[t]
      var g = gains[t] || masterGain
      i.connect(g)
      i.start(n || 0)
    }
    var masterGain = e.createGain()
    var gains = {}
    function initGains(channels) {
      for (var i in channels) {
        var g = e.createGain()
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
    var o = {},
      l = 0,
      c = 0,
      d = { play: a, init: t, loadNew: s, initGains: initGains, setGain: setGain, setMasterGain: setMasterGain, getGain: getGain, getMasterGain: getMasterGain, getMasterNode: getMasterNode }
    return d
  })(AUDIO),
  AudioFX = (function (e, sb) {
    var m = sb.getMasterNode()

    // EQ chain (on main path)
    var bassF = e.createBiquadFilter()
    bassF.type = 'lowshelf'
    bassF.frequency.value = 200
    bassF.gain.value = 0
    var midF = e.createBiquadFilter()
    midF.type = 'peaking'
    midF.frequency.value = 1000
    midF.gain.value = 0
    midF.Q.value = 1
    var trebleF = e.createBiquadFilter()
    trebleF.type = 'highshelf'
    trebleF.frequency.value = 5000
    trebleF.gain.value = 0
    var lpF = e.createBiquadFilter()
    lpF.type = 'lowpass'
    lpF.frequency.value = 22050
    var hpF = e.createBiquadFilter()
    hpF.type = 'highpass'
    hpF.frequency.value = 20

    // Connect main EQ chain
    m.connect(bassF)
    bassF.connect(midF)
    midF.connect(trebleF)

    // Combined LP/HP filter (LP → HP)
    trebleF.connect(lpF)
    lpF.connect(hpF)

    // Main dry signal (always passes through EQ+filter)
    var mainDry = e.createGain()
    mainDry.gain.value = 1
    hpF.connect(mainDry)
    mainDry.connect(e.destination)

    // Reverb (parallel send from after HP)
    var revG = e.createGain()
    revG.gain.value = 0
    var convolver = e.createConvolver()
    var revLen = e.sampleRate * 2
    var revBuf = e.createBuffer(2, revLen, e.sampleRate)
    for (var ch = 0; ch < 2; ch++) {
      var data = revBuf.getChannelData(ch)
      for (var i = 0; i < revLen; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 3)
    }
    convolver.buffer = revBuf
    hpF.connect(revG)
    revG.connect(convolver)
    convolver.connect(e.destination)

    // Chorus (parallel send from after HP)
    var chG = e.createGain()
    chG.gain.value = 0
    var chDelay = e.createDelay(0.05)
    chDelay.delayTime.value = 0.005
    var chOsc = e.createOscillator()
    chOsc.frequency.value = 1.3
    var chOscG = e.createGain()
    chOscG.gain.value = 0.003
    chOsc.connect(chOscG)
    chOscG.connect(chDelay.delayTime)
    chOsc.start()
    hpF.connect(chDelay)
    chDelay.connect(chG)
    chG.connect(e.destination)

    // Delay (parallel send)
    var dG = e.createGain()
    dG.gain.value = 0
    var dDelay = e.createDelay(3)
    dDelay.delayTime.value = 0.35
    var dFb = e.createGain()
    dFb.gain.value = 0
    hpF.connect(dDelay)
    dDelay.connect(dFb)
    dFb.connect(dDelay)
    dDelay.connect(dG)
    dG.connect(e.destination)

    return {
      getBass: function () { return bassF.gain.value },
      setBass: function (v) { bassF.gain.value = v },
      getMid: function () { return midF.gain.value },
      setMid: function (v) { midF.gain.value = v },
      getTreble: function () { return trebleF.gain.value },
      setTreble: function (v) { trebleF.gain.value = v },
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
      setFilterSlider: function (v) {
        if (v < 0.5) {
          hpF.frequency.value = 20
          var normalized = v / 0.5
          lpF.frequency.value = Math.max(20, 20 * Math.pow(22050 / 20, normalized))
        } else {
          lpF.frequency.value = 22050
          var normalized = (v - 0.5) / 0.5
          hpF.frequency.value = Math.min(22050, 20 * Math.pow(22050 / 20, normalized))
        }
      },
      getReverbMix: function () { return revG.gain.value },
      setReverbMix: function (v) { revG.gain.value = v },
      getChorus: function () { return chG.gain.value },
      setChorus: function (v) { chG.gain.value = v },
      getDelayTime: function () { return dDelay.delayTime.value },
      setDelayTime: function (v) { dDelay.delayTime.value = v },
      getDelayFeedback: function () { return dFb.gain.value },
      setDelayFeedback: function (v) { dFb.gain.value = v },
      getDelayMix: function () { return dG.gain.value },
      setDelayMix: function (v) { dG.gain.value = v }
    }
  })(AUDIO, SampleBank),
  Sequencer = (function (e, t) {
    function n(e) {
      ; (p = e),
        (g = 60 / p / 4),
        currentPatternForSwing &&
        (g =
          '5/4' == currentPatternForSwing.rhythm ||
            '6/8' == currentPatternForSwing.rhythm
            ? 60 / p / 2.000000000000002
            : 60 / p / 4)
    }
    function i() {
      if (!w) return !1
      var t = e.currentTime
      if (((t -= E), 0 === e.currentTime && (v -= E), v < t + 0.2)) {
        var n = v + E
        o(n), r()
      }
      f = setTimeout(i, 0)
    }
    function r() {
      _++
      var e = S.hihat.length
      _ >= e && (_ = 0), (v += g)
    }
    function s(e, n) {
      var i = S[e][_]
      '1' === i
        ? (t.play(e, n),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, e))
        : '2' === i && a(e, n)
    }
    function a(e, n) {
      var i = {
        hihat: 'aabenhihat',
        sidetamlys: 'sidetamdyb',
        lilletromme: 'kantslag'
      }
      i[e] &&
        (t.play(i[e], n),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, e))
    }
    function o(e) {
      function t(e) {
        '4/4' === e || '3/4' === e ? n() : ('5/4' !== e && '6/8' !== e) || i(),
          _ >= a + 1 && (_ = 0)
      }
      function n() {
        _ % 4 === 3 && (_ = 15 === _ ? 0 : _ + 1),
          '3/4' === r && 12 === _ && _++
      }
      function i() {
        _ % 2 === 0 && (v += g / 6)
      }
      var r = currentPatternForSwing.rhythm,
        a = S.hihat.length
      for (var o in S)
        P[o] && swing_toggler && t(r),
          P[o] && s(o, e),
          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, _)
    }
    function l(e, t) {
      if (!y) throw 'Sequencer not initialized'
      null === S && c(e),
        void 0 === t && (t = 1),
        t === -1 && (t = Number.MAX_INT),
        h()
    }
    function c(e) {
      S = {}
      for (var t in e.sequence) {
        var n = d(e.sequence[t])
        S[t] = n
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
        if (!S[ch]) {
          S[ch] = []
          for (var j = 0; j < numSteps; j++) S[ch].push('0')
        }
      }
      for (var ch in S) {
        var cur = S[ch].length
        if (cur < numSteps) {
          for (var j = cur; j < numSteps; j++) S[ch].push('0')
        } else if (cur > numSteps) {
          S[ch].splice(numSteps)
        }
      }
    }
    function d(e) {
      return e.split('')
    }
    function h() {
      ; (w = !0), (v = 0), (E = e.currentTime + 0.005), i()
    }
    function m() {
      ; (w = !1),
        (_ = 0),
        $('#play').removeClass('btn-pause').addClass('btn-play').html('<i class="fas fa-play"></i>'),
        dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, _)
    }
    function u(e) {
      dispatcher.register(T), new A(e).render(), n(90), (y = !0)
    }
var p,
  g,
  v,
  E,
  f,
  numSteps = 16,
  T = {
        SEQUENCER_PLAY: 'sequencer:play',
        SEQUENCER_STOP: 'sequencer:stop',
        SEQUENCER_SET_PATTERN: 'sequencer:setpattern',
        SEQUENCER_SET_PATTERN_FROM_TACT: 'sequencer:settPatternFromTact',
        SEQUENCER_SET_TEMPO: 'sequencer:settempo',
        SEQUENCER_PATTERN_CHANGED: 'sequencer:patternchanged',
        SEQUENCER_STEP: 'sequencer:step',
        SEQUENCER_NOTE_PLAY: 'sequencer:noteplay',
        SEQUENCER_SET_STEPS: 'sequencer:setsteps'
      },
      y = !1,
      _ = 0,
      w = !1,
      S = null,
      P = {},
      R = {},
      N = {},
      A = Backbone.View.extend({
        channelViews: {},
        initialize: function (e) {
          this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_PLAY, l),
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
              n
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
            )
        },
        onSetSteps: function (newSteps) {
          if (newSteps < 1) newSteps = 1
          if (newSteps > 64) newSteps = 64
          numSteps = newSteps
          for (var ch in S) {
            var cur = S[ch].length
            if (cur < numSteps) {
              for (var j = cur; j < numSteps; j++) S[ch].push('0')
            } else if (cur > numSteps) {
              S[ch].splice(numSteps)
            }
          }
          for (var ch in S)
            url_collection.sequence[ch] = S[ch].join('')
          for (var ch in this.channelViews) {
            this.channelViews[ch].model = S[ch]
            this.channelViews[ch].render()
          }
          generateURL()
        },
        settPatternFromTact: function (e) {
          c(e), this.render(), (currentPatternForSwing = e), (R = {})
          for (var t in this.channelViews) {
            this.channelViews[t].undelegateEvents()
            this.channelViews[t].stopListening()
          }
          this.channelViews = {}
          for (var t in S) {
            var n = this.$el.find('.channel[data-inst="' + t + '"]')
            this.channelViews[t] = new O({
              channel: t,
              model: S[t],
              el: n,
              pattern_name: TRANSLATION.patternName[t],
              muted: e.muted[t],
              rhythm: e.rhythm
            })
          }
          this.renderChannels()
        },
        setPattern: function (e) {
          c(e), this.render(), (currentPatternForSwing = e)
          var t = 0
          for (var n in this.channelViews) {
            this.channelViews[n].undelegateEvents()
            this.channelViews[n].stopListening()
          }
          this.channelViews = {}
          for (var n in S) {
            var i = this.$el.find('.channel[data-inst="' + n + '"]')
              ; (this.channelViews[n] = new O({
                channel: n,
                model: S[n],
                el: i,
                pattern_name: TRANSLATION.patternName[n],
                muted: e.muted[t],
                rhythm: e.rhythm
              })),
                t++
          }
          this.renderChannels(), generateURL()
        },
        render: function () {
          return this
        },
        renderChannels: function () {
          this.$channelContainer = this.$el.find('.sequencer-channels')
          for (var e in this.channelViews) this.channelViews[e].render()
          this.$steps = $('.channel span')
        },
        setPlayhead: function (e) {
          for (var t in this.channelViews) this.channelViews[t].setPlayhead(e)
        },
        stop: function () {
          m()
          for (var e in this.channelViews) this.channelViews[e].clearPlayhead()
        }
      }),
      O = Backbone.View.extend({
        events: {
          'click .seq-row span': 'onNoteClick',
          'click .pad': 'onPadClick',
          'click .mute': 'onMuteClick'
        },
        channel: null,
        active: !0,
        initialize: function (e) {
          ; (this.channel = e.channel),
            (this.pattern_name = e.pattern_name),
            (this.muted = e.muted),
            (this.rhythm = e.rhythm)
        },
        render: function () {
          var notesHtml = ''
          for (var ni = 0; ni < this.model.length; ni++)
            notesHtml += '<span data-tic="' + ni + '" class=""></span>'
          this.$el.find('.seq-row.inline').html(notesHtml)
          this.$notes = this.$el.find('.seq-row span'),
            (this.$eq_bar = this.$el.find('.meter span')),
            (this.$active = this.$el.find('.mute'))
          var t = this,
            n = 1
          return (
            this.model.forEach(function (e, i) {
              var r = t.$notes.eq(i)
              '1' === e
                ? (r.addClass('seq-note'),
                  (R[t.el.dataset.count + ':' + i] =
                    t.el.dataset.count + '.' + i + '.' + e))
                : ('2' === e && 'hihat' == t.channel) ||
                  ('2' === e && 'sidetamlys' == t.channel) ||
                  ('2' === e && 'lilletromme' == t.channel)
                  ? (r.addClass('seq-note-yellow'),
                    (R[t.el.dataset.count + ':' + i] =
                      t.el.dataset.count + '.' + i + '.' + e))
                  : '3' === e
                    ? r.addClass('seq-note-empty')
                    : delete R[t.el.dataset.count + ':' + i],
                '4/4' == t.rhythm || '3/4' == t.rhythm
                  ? (i % 4 === 0 &&
                    r.addClass('seq-step-measure').html(i / 4 + 1),
                    swing_toggler && i % 4 === 3 && r.hide())
                  : ('5/4' != t.rhythm && '6/8' != t.rhythm) ||
                  (i % 2 === 0 && r.addClass('seq-step-measure').html(n++))
            }),
            (url_collection.sequence[t.channel] = t.model.join('')),
            this.active
              ? delete N[t.el.dataset.count]
              : (N[t.el.dataset.count] = t.el.dataset.count),
            this.muted
              ? (this.$active.toggleClass('active', !this.active),
                this.$notes.toggleClass('seq-active', !this.active),
                (P[this.channel] = !this.active),
                (N[t.el.dataset.count] = t.el.dataset.count),
                this.active || delete N[t.el.dataset.count])
              : (this.$active.toggleClass('active', this.active),
                this.$notes.toggleClass('seq-active', this.active),
                (P[this.channel] = this.active)),
            (url_collection.muted = N),
            (url_collection.rhythm = t.rhythm),
            (url_collection.swing = swing_toggler),
            this
          )
        },
        clearPlayhead: function () {
          this.$notes.removeClass('seq-playhead')
        },
        setPlayhead: function (e) {
          this.clearPlayhead(),
            this.$notes
              .filter('[data-tic="' + e + '"]')
              .addClass('seq-playhead')
        },
        onNoteClick: function (e) {
          var n = $(e.currentTarget).attr('data-tic'),
            i = S[this.channel][n],
            r = ['hihat', 'sidetamlys', 'lilletromme'],
            s = {
              hihat: 'aabenhihat',
              sidetamlys: 'sidetamdyb',
              lilletromme: 'kantslag'
            }
          r.includes(this.channel)
            ? (S[this.channel][n] =
              '2' === i ? '0' : (parseInt(i) + 1).toString())
            : (S[this.channel][n] = '1' === i ? '0' : '1')
          var a = S[this.channel][n]
          w ||
            '0' === a ||
            ('2' === a && this.channel in s
              ? t.play(s[this.channel])
              : t.play(this.channel)),
            $('.clearBtn').toggleClass(
              'clearBtn-disabled',
              Object.values(S).every(function (e) {
                return e.every(function (e) {
                  return '0' === e
                })
              })
            ),
            this.render(),
            generateURL()
        },
        onMuteClick: function (e) {
          ; (this.active = !this.active),
            (P[this.channel] = this.active),
            this.$active.toggleClass('active', this.active),
            this.$notes.toggleClass('seq-active', this.active),
            this.active || $('.clearBtn').removeClass('clearBtn-disabled'),
            this.render(),
            generateURL()
        },
        spikeEQ: function () {
          var e = this
          this.$eq_bar.removeClass('fade'),
            this.$eq_bar.css('transform', 'scaleX(1)'),
            setTimeout(function () {
              e.$eq_bar.addClass('fade'),
                e.$eq_bar.css('transform', 'scaleX(0)')
            }, 50)
        }
      })
    return { init: u }
  })(AUDIO, SampleBank),
  Transport = (function () {
    function e() {
      dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY)
    }
    function t() {
      dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP)
    }
    function n(e) {
      dispatcher.register(i), new a(e).render()
    }
    var i = {
      TRANSPORT_PLAY: 'transport:play',
      TRANSPORT_STOP: 'transport:stop',
      TRANSPORT_CLEAR: 'transport:clear',
      TRANSPORT_REQUEST_PLAY: 'transport:requestplay',
      TRANSPORT_REQUEST_STOP: 'transport:requeststop',
      TRANSPORT_REQUEST_MUTE: 'transport:requestmute',
      TRANSPORT_TEMPO_CHANGED: 'transport:tempochanged',
      TRANSPORT_CHANGE_TEMPO: 'transport:changetempo'
    },
      r = {
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
          muted: {},
          swing: !1,
          rhythm: '6/8'
        }
      },
      a = Backbone.View.extend({
        events: {
          'click .btn-play, .btn-pause': function (e) {
            var btn = $(e.target).closest('.btn-play, .btn-pause')
            btn.toggleClass('btn-play btn-pause')
            btn.html(btn.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>')
          },
          'click .btn-play': 'onPlayClick',
          'click .btn-pause': 'onStopClick',


          'mouseover .dropdown button': 'showDropdown',
          'mouseleave .dropdown': 'hideDropdown'
        },
        initialize: function (n) {
          var self = this
          this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_PLAY, e),
            this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_STOP, t),
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
            $(document).on('click', '.modal-container', function (e) {
              e.target.classList.contains('modal-container') &&
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
            $(document).on('click', '.clearBtn', function (e) {
              e.preventDefault()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_CLEAR)
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
              var t = parseInt($('.transport-tempo-display').val(), 10)
              url_collection.tempo = t
              url_collection.rhythm = currentPatternForSwing.rhythm
              url_collection.swing = swing_toggler
              generateURL()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, swing_toggler ? t / ('5/4' === currentPatternForSwing.rhythm || '6/8' === currentPatternForSwing.rhythm ? 0.66666666666 : 1.33) : t)
            }),
            $(document).on('click', '.tempo-plus', function () {
              var cur = parseInt($('.transport-tempo-display').val(), 10) || 90
              if (cur < 250) $('.transport-tempo-display').val(cur + 1)
              var t = parseInt($('.transport-tempo-display').val(), 10)
              url_collection.tempo = t
              url_collection.rhythm = currentPatternForSwing.rhythm
              url_collection.swing = swing_toggler
              generateURL()
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, swing_toggler ? t / ('5/4' === currentPatternForSwing.rhythm || '6/8' === currentPatternForSwing.rhythm ? 0.66666666666 : 1.33) : t)
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
        outsideClickDetect: function (e) {
          var t = $(e.target)
          if (t.closest('.dropdown').length) return
          $('.dropdown').find('.dropdown-content').removeClass('active')
        },
        backButtonFunctionalityURL: function () {
          window.location.href = document.referrer
        },
        onPlayClick: e,
        onStopClick: t,
        onIncomingTempoChange: function (e) {
          $('.transport-tempo-display').val(Math.round(e)),
            dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, e)
        },
        keydown: function (n) {
          var i = parseInt($('.transport-tempo-display').val(), 10) || 90,
            r = $('#play')
          switch (n.keyCode) {
            case 32:
              n.preventDefault(),
                this.spacePressed ||
                ((this.spacePressed = !0),
                  r.toggleClass('btn-play btn-pause').html(r.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>'),
                  r.hasClass('btn-pause')
                    ? dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_PLAY, e)
                    : t())
              break
            case 37:
            case 39:
              if (n.target.tagName === 'INPUT') break
              var newVal = 37 === n.keyCode ? Math.max(30, i - 1) : Math.min(250, i + 1)
              $('.transport-tempo-display').val(newVal)
              ;(37 === n.keyCode ? $('.tempo-minus') : $('.tempo-plus')).trigger('click')
          }
        },
        keyup: function (e) {
          32 === e.keyCode && (this.spacePressed = !1)
        },
        onClearBtnClick: function (e) {
          e && e.preventDefault(),
            (currentPatternForSwing =
              r[currentPatternForSwing.rhythm] || currentPatternForSwing),
            $('.clearBtn').addClass('clearBtn-disabled')
          for (var t in currentPatternForSwing.sequence)
            (currentPatternForSwing.sequence[t] =
              currentPatternForSwing.sequence[t].replace(/1/g, '0')),
              (currentPatternForSwing.sequence[t] =
                currentPatternForSwing.sequence[t].replace(/2/g, '0'))
          resetURL(),
            $('.presetsBtn').text(BUTTON_NAMES.presetsButtonName),
            $('.preset_active').removeClass('active'),
            dispatcher.trigger(
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN_FROM_TACT,
              currentPatternForSwing
            )
        },
        hideDropdown: function (e) {
          $(e.currentTarget).find('.dropdown-content').removeClass('active')
        },
        showDropdown: function (e) {
          $(e.currentTarget)
            .parent()
            .find('.dropdown-content')
            .addClass('active')
        },
        onBeatClick: function (e) {
          $(e.currentTarget)
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
          var n = decodeURL(urlData)
          if (!n) return
          url_collection = n
          numSteps = n.steps || 16
          $('.transport-steps-display').val(numSteps)
          'standard' !== n.sound &&
            $('.sound-types-button').text(SOUND_TYPES[n.sound])
          dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, n.sound)
          n.swing
            ? (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, n),
              dispatcher.trigger(dispatcher.EventKeys.SWING_SELECTED))
            : (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, n),
              dispatcher.trigger(
                dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
                n.tempo
              ))
          window.history.replaceState('', '', '?data=' + encodeURIComponent(urlData))
        },
        onSavePreset: function () {
          var e = prompt('Preset name:')
          if (!e) return
          generateURL()
          var t = window.location.search.replace('?data=', '')
          if (!t) return
          var n = JSON.parse(localStorage.getItem('drum_saved_presets') || '{}')
          n[e] = t
          localStorage.setItem('drum_saved_presets', JSON.stringify(n))
          this.populatePresetSelect()
        },
      })
    return { init: n }
  })(),
  PresetList = (function () {
    function e(e) {
      dispatcher.register(t), new s(e).render()
    }
    var t = { PRESET_SELECTED: 'preset:selected' },
      n = {
        'Pop/rock 1': {
          tempo: 90,
          name: 'Pop/rock 1',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1000000010000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock 2': {
          tempo: 90,
          name: 'Pop/rock 2',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1000000010100000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock 3': {
          tempo: 90,
          name: 'Pop/rock 3',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1000001010000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock 4': {
          tempo: 90,
          name: 'Pop/rock 4',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1000001000100000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock 5': {
          tempo: 90,
          name: 'Pop/rock 5',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1000000100100000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock 6': {
          tempo: 90,
          name: 'Pop/rock 6',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100000001000',
            stortromme: '0010000010000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Pop/rock i 3/4': {
          tempo: 110,
          name: 'Pop/rock i 3/4',
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            hihat: '101010101010',
            lilletromme: '000000001000',
            stortromme: '100000100000'
          },
          muted: {},
          swing: !1,
          rhythm: '3/4'
        },
        'Pop/rock i 6/8': {
          tempo: 180,
          name: 'Pop/rock i 6/8',
          sequence: {
            hihatfod: '000000000000',
            sidetamlys: '000000000000',
            gulvtam: '000000000000',
            ride: '000000000000',
            hihat: '101010101010',
            lilletromme: '000000100000',
            stortromme: '100000000000'
          },
          muted: {},
          swing: !1,
          rhythm: '6/8'
        },
        'Jazz 1': {
          tempo: 110,
          name: 'Jazz 1',
          sequence: {
            hihatfod: '0000100000001000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '1000101010001010',
            hihat: '0000000000000000',
            lilletromme: '0000000000000000',
            stortromme: '0000000000000000'
          },
          muted: {},
          swing: !0,
          rhythm: '4/4'
        },
        'Jazz 2': {
          tempo: 110,
          name: 'Jazz 2',
          sequence: {
            hihatfod: '0000100000001000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '1000101010001010',
            hihat: '0000000000000000',
            lilletromme: '0000000000001000',
            stortromme: '1000000000000000'
          },
          muted: {},
          swing: !0,
          rhythm: '4/4'
        },
        'Jazz 3': {
          tempo: 110,
          name: 'Jazz 3',
          sequence: {
            hihatfod: '0000100000001000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '1000101010001010',
            hihat: '0000000000000000',
            lilletromme: '0000000000100000',
            stortromme: '0000001000000000'
          },
          muted: {},
          swing: !0,
          rhythm: '4/4'
        },
        'Jazz 4': {
          tempo: 110,
          name: 'Jazz 4',
          sequence: {
            hihatfod: '0000100000001000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '1010101010101010',
            hihat: '0000000000000000',
            lilletromme: '0020000000002000',
            stortromme: '1000000010000000'
          },
          muted: {},
          swing: !0,
          rhythm: '4/4'
        },
        'Funk 1': {
          tempo: 110,
          name: 'Funk 1',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101010',
            lilletromme: '0000100101001100',
            stortromme: '1000000000100001'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Funk 2': {
          tempo: 90,
          name: 'Funk 2',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1111112111111121',
            lilletromme: '0000100101011000',
            stortromme: '1010000010100100'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Disco 1': {
          tempo: 90,
          name: 'Disco 1',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1020102010201020',
            lilletromme: '0000100000001000',
            stortromme: '1000100010001000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Disco 2': {
          tempo: 110,
          name: 'Disco 2',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1020101110201011',
            lilletromme: '0000100000001000',
            stortromme: '1000100010001000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Rap 1': {
          tempo: 80,
          name: 'Rap 1',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '0110101010101010',
            lilletromme: '0000100000001000',
            stortromme: '1010001001000000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Rap 2': {
          tempo: 90,
          name: 'Rap 2',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '1010101010101020',
            lilletromme: '0000100000001000',
            stortromme: '1011011001100000'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Heavy metal 1': {
          tempo: 90,
          name: 'Heavy metal 1',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '2020202020202020',
            lilletromme: '0000100000001010',
            stortromme: '1011001111000001'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        },
        'Heavy metal 2': {
          tempo: 90,
          name: 'Heavy metal 2',
          sequence: {
            hihatfod: '0000000000000000',
            sidetamlys: '0000000000000000',
            gulvtam: '0000000000000000',
            ride: '0000000000000000',
            hihat: '2020202020202020',
            lilletromme: '0000100000001000',
            stortromme: '1110001110010011'
          },
          muted: {},
          swing: !1,
          rhythm: '4/4'
        }
      },
      i = 0
    _.forOwn(n, function (e) {
      ; (i += 1), (e.name = BUTTON_NAMES.presets[i])
    })
    var s = Backbone.View.extend({
        events: { 'click .preset-item': 'onPresetClick' },
        initialize: function () {
          this.listenTo(
            dispatcher,
            dispatcher.EventKeys.PRESET_SELECTED,
            this.onPresetSelected
          )
        },
        render: function () {
          var html = ''
          for (var key in n) {
            html += '<li data-preset-id="' + key + '" class="preset-item">' + n[key].name + '</li>'
          }
          this.$el.html(html)
          this.$items = this.$el.find('.preset-item')
          return this
        },
        onPresetClick: function (e) {
          e.preventDefault()
          var t = $(e.currentTarget).text(),
            i = $(e.currentTarget).attr('data-preset-id'),
            r = n[i].rhythm,
            s = n[i].swing,
            a = n[i].tempo,
            o = n[i].tempo
          s ? ((o /= 1.33), (swing_toggler = !0)) : (swing_toggler = !1),
            $('.swing-toggle').toggleClass('active', swing_toggler),
            this.$items.removeClass('preset_active active'),
            $('.set-beat').removeClass('active'),
            $('.dropdown ul').removeClass('active'),
            $(e.currentTarget).addClass('preset_active active'),
            $('.presetsBtn').text(t),
            $('.beatTime').text(r),
            $('.clearBtn').removeClass('clearBtn-disabled'),
            (url_collection.tempo = a),
            (url_collection.rhythm = r),
            (url_collection.swing = swing_toggler),
            generateURL(),
            dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, n[i]),
            dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, o)
        }
      })
    return {
      init: e,
      getPresetData: function (name) { return n[name] },
      getAllPresetNames: function () { return Object.keys(n) }
    }
  })(),
  SoundTypes = (function () {
    function e(e) {
      dispatcher.register(t), new r(e).render()
    }
    var t = { SOUND_SELECTED: 'sound:selected' },
      i = {
        standard: 'standard',
        powerful: 'powerful',
        monumental: 'monumental',
        smooth: 'smooth',
        minimalistic: 'minimalistic',
        energetic: 'energetic'
      },
      r = Backbone.View.extend({
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
          for (var key in i) {
            var label = SOUND_TYPES[key] || key
            html += '<li data-sound-id="' + key + '" class="sound-item">' + label + '</li>'
          }
          this.$el.html(html)
          this.$items = this.$el.find('.sound-item')
          return this
        },
        onSoundClick: function (e) {
          e.preventDefault()
          var t = $(e.currentTarget).text(),
            n = $(e.currentTarget).attr('data-sound-id')
          this.$items.removeClass('sound_active active'),
            $(e.currentTarget).addClass('sound_active active'),
            $('.dropdown ul').removeClass('active'),
            $('.sound-types-button').text(t),
            dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, i[n]),
            url_collection.sound !== i[n] &&
            ((url_collection.sound = i[n]), generateURL())
        }
      })
    return { init: e }
  })(),
  TimeSignature = (function () {
    function e(e) {
      dispatcher.register(t), new s(e).render()
    }
    var t = { BEAT_SELECTED: 'beat:selected' },
      i = ['3/4', '4/4', '5/4', '6/8'],
      r = {
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
          muted: {},
          swing: !1,
          rhythm: '6/8'
        }
      },
      s = Backbone.View.extend({
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
          for (var bi = 0; bi < i.length; bi++)
            html += '<li class="set-beat" data-beat="' + i[bi] + '">' + i[bi] + '</li>'
          this.$el.html(html)
          this.$items = this.$el.find('.set-beat')
          return this
        },
        onBeatClick: function (e) {
          e.preventDefault()
          var t = $(e.currentTarget).text()
          this.$items.removeClass('beat_active active'),
            $(e.currentTarget).addClass('beat_active active'),
            $('.dropdown ul').removeClass('active'),
            $('.beatTime').text(t),
            $('.presetsBtn').text(BUTTON_NAMES.presetsButtonName),
            $('.clearBtn').addClass('clearBtn-disabled')
          var n = parseInt($('.transport-tempo-display').val(), 10) || 90
          currentPatternForSwing = r[t] || currentPatternForSwing
          for (var i in currentPatternForSwing.sequence)
            (currentPatternForSwing.sequence[i] =
              currentPatternForSwing.sequence[i].replace(/1/g, '0')),
              (currentPatternForSwing.sequence[i] =
                currentPatternForSwing.sequence[i].replace(/2/g, '0'))
              ; (url_collection.sequence = currentPatternForSwing.sequence),
                (url_collection.rhythm = t),
                generateURL()
          var s = $('#play')
          s[0].classList.contains('btn-pause') &&
            (dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP),
              dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY),
              s.toggleClass('btn-play btn-pause').html(s.hasClass('btn-pause') ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>')),
            dispatcher.trigger(
              dispatcher.EventKeys.SEQUENCER_SET_PATTERN_FROM_TACT,
              currentPatternForSwing
            ),
            dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, n),
            dispatcher.trigger(dispatcher.EventKeys.BEAT_SELECTED, t)
        }
      })
    return { init: e }
  })(),
  SwingRhythm = (function () {
    function e(e) {
      dispatcher.register(t), new i(e).render()
    }
    var t = { SWING_SELECTED: 'swing:selected' },
      i = Backbone.View.extend({
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
        onSwingClick: function (e) {
          swing_toggler = !swing_toggler
          var t = $('#sequencer-panel').find('.seq-row'),
            n = $('.sequencer-channels').find('.mute')
          this.$el.find('.swing-toggle').toggleClass('active', swing_toggler),
            t.each(function (e) {
              var t = '',
                n = $(this).find('span')
              n.each(function (e) {
                if ($(n[e]).hasClass('seq-note')) t += '1'
                else if ($(n[e]).hasClass('seq-note-yellow')) t += '2'
                else {
                  if ($(n[e]).hasClass('seq-note-empty')) return t
                  t += '0'
                }
              }),
                (currentPatternForSwing.sequence[
                  Object.keys(currentPatternForSwing.sequence)[e]
                ] = t)
            })
          var i = parseInt($('.transport-tempo-display').val(), 10) || 90
          swing_toggler
            ? '5/4' === currentPatternForSwing.rhythm ||
              '6/8' === currentPatternForSwing.rhythm
              ? (newTempo = i / 0.66666666666)
              : (newTempo = i / 1.33)
            : (newTempo = i),
            (currentPatternForSwing.muted = {}),
            n.each(function (e) {
              $(this).hasClass('active') ||
                (currentPatternForSwing.muted[e] = 1)
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
    return { init: e }
  })(),
  Modal = (function () {
    function e(e) {
      dispatcher.register(t), new i(e).render()
    }
    var t = { MODAL_OPEN: 'modal:open', MODAL_CLOSE: 'modal:close' },
      i = Backbone.View.extend({
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
        outsideClick: function (e) {
          0 === $(e.target).closest('.dropdown__select').length &&
            0 === $(e.target).closest('.dropdown__content').length &&
            this.$el.find('.dropdown__content').removeClass('active')
        },
        toggleDropdown: function (e) {
          e.stopPropagation(),
            this.$el
              .find('.dropdown__content')
              .not($(e.currentTarget).find('.dropdown__content'))
              .removeClass('active'),
            $(e.currentTarget).find('.dropdown__content').toggleClass('active')
        },
        open: function () {
          this.$el.show()
        },
        close: function () {
          this.$el.hide()
        }
      })
    return { init: e }
  })(),
  Mixer = (function () {
    function e(e) {
      dispatcher.register(i), new s(e).render()
    }
    var t = ['hihatfod', 'sidetamlys', 'gulvtam', 'ride', 'crash', 'hihat', 'lilletromme', 'stortromme', 'aabenhihat', 'kantslag', 'sidetamdyb'],
      n = TRANSLATION.patternName,
      i = { MIXER_CHANGE: 'mixer:change' },
      s = Backbone.View.extend({
        initialize: function () {
          var self = this
          this.listenTo(dispatcher, dispatcher.EventKeys.MIXER_CHANGE, this.render)
          $(document).on('input', '.mixer-fader', function (e) { self.onFaderChange(e) })
          $(document).on('input', '.eq-fader', function (e) { self.onEQChange(e) })
          $(document).on('input', '.fx-fader', function (e) { self.onFXChange(e) })
        },
        render: function () {
          var _this = this
          function mapRange(v, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (v - inMin) / (inMax - inMin) }
          function fromSliderValue(val) { val = parseInt(val); if (val <= 50) return val; if (val <= 60) return 50; return val - 10 }
          function toSliderValue(val) { if (val < 50) return val; if (val === 50) return 55; return val + 10 }
          var master = SampleBank.getMasterGain()
          $('.mixer-fader[data-channel="master"]').val(master)
          $('.mixer-value-master').text(Math.round(master * 100) + '%')
          for (var ci in t) {
            var ch = t[ci], gain = SampleBank.getGain(ch)
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
        onFaderChange: function (e) {
          var t = $(e.currentTarget).data('channel'),
            n = parseFloat($(e.currentTarget).val())
          'master' === t ? (SampleBank.setMasterGain(n), localStorage.setItem('drum_master_gain', n)) : (SampleBank.setGain(t, n), localStorage.setItem('drum_gain_' + t, n))
          $(e.currentTarget).closest('.mixer-channel').find('.mixer-value').text(Math.round(n * 100) + '%')
        },
        onEQChange: function (e) {
          var p = $(e.currentTarget).data('eq'),
            v = parseInt($(e.currentTarget).val())
          function fromSliderValue(val) { if (val <= 50) return val; if (val <= 60) return 50; return val - 10 }
          function toSliderValue(val) { if (val < 50) return val; if (val === 50) return 55; return val + 10 }
          var val = fromSliderValue(v)
          e.currentTarget.value = toSliderValue(val)
          function mapRange(v, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (v - inMin) / (inMax - inMin) }
          switch (p) {
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
          localStorage.setItem('drum_eq_' + p, val)
        },
        onFXChange: function (e) {
          var p = $(e.currentTarget).data('fx'),
            v = parseFloat($(e.currentTarget).val())
          function mapRange(v, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * (v - inMin) / (inMax - inMin) }
          switch (p) {
            case 'reverbMix':
              AudioFX.setReverbMix(v)
              break
            case 'chorus':
              AudioFX.setChorus(v)
              break
            case 'delayTime':
              AudioFX.setDelayTime(mapRange(v, 0, 1, 0.01, 2))
              break
            case 'delayFeedback':
              AudioFX.setDelayFeedback(v)
              break
            case 'delayMix':
              AudioFX.setDelayMix(v)
              break
          }
          localStorage.setItem('drum_fx_' + p, v)
        }
      })
    return { init: e }
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
          function (e) {
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, e)
          }
        ),
        dispatcher.on(
          dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
          function (e) {
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_TEMPO, e)
          }
        ),
        dispatcher.on(dispatcher.EventKeys.PRESET_SELECTED, function (e) {
          dispatcher.trigger(
            dispatcher.EventKeys.TRANSPORT_CHANGE_TEMPO,
            e.tempo
          ),
            dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, e)
        }),
        dispatcher.on(dispatcher.EventKeys.SOUND_SELECTED, function (e) {
          var t = 'audio/' + e + '/',
            n = {
              hihatfod: t + 'hihat-foot.mp3',
              sidetamlys: t + 'tom1.mp3',
              gulvtam: t + 'floor-tom.mp3',
              ride: t + 'ride.mp3',
              crash: t + 'crash.mp3',
              hihat: t + 'hihat.mp3',
              kantslag: t + 'snare-stick.mp3',
              stortromme: t + 'bass.mp3',
              aabenhihat: t + 'hihat-open.mp3',
              lilletromme: t + 'snare-drum.mp3',
              sidetamdyb: t + 'tom2.mp3'
            }
          SampleBank.loadNew(n, function () { })
        })
    },
    onLoad: function () {
      var e = {
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
        muted: {},
        swing: !1,
        rhythm: '4/4',
        tempo: 90,
        sound: 'standard'
      },
        t = parseURLData(),
        n = t ? t : e
      this._connectModules(),
        (url_collection = n),
        numSteps = n.steps || 16,
        $('.transport-steps-display').val(numSteps),
        'standard' !== n.sound &&
        $('.sound-types-button').text(SOUND_TYPES[n.sound]),
        dispatcher.trigger(dispatcher.EventKeys.SOUND_SELECTED, n.sound),
        n.swing
          ? (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, n),
            dispatcher.trigger(dispatcher.EventKeys.SWING_SELECTED))
          : (dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, n),
            dispatcher.trigger(
              dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED,
              n.tempo
            ))
    },
    init: function () {
      var e = {
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
        t = {},
        n = Object.keys(e)
      n.forEach(function (n) {
        var i = e[n]
        t[n] = 'audio/standard/' + i + '.mp3'
      });
      var i = ['hihatfod', 'sidetamlys', 'gulvtam', 'ride', 'crash', 'hihat', 'lilletromme', 'stortromme', 'aabenhihat', 'kantslag', 'sidetamdyb']
      SampleBank.initGains(i)
      var s = localStorage.getItem('drum_master_gain')
      s && SampleBank.setMasterGain(parseFloat(s))
      for (var a in i) {
        var o = localStorage.getItem('drum_gain_' + i[a])
        o && SampleBank.setGain(i[a], parseFloat(o))
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
      SampleBank.init(t, this.onLoad.bind(this))
    }
  }
App.init()
