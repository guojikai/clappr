import {Config} from '../../src/base/utils'
import Styler from '../../src/base/styler'
import template from '../../src/base/template'
import UIObject from '../../src/base/ui_object'
import MediaControl from '../../src/plugins/media_control'
import FakePlayback from '../../src/base/playback'
import Container from '../../src/components/container'

describe('MediaControl', function() {
  class FakeCore extends UIObject {
    constructor(options = {}) {
      super(options)
      this.options = options
    }
  }
  beforeEach(function() {
    this.playback = new FakePlayback();
    this.container = new Container({playback: this.playback});
    this.core = new FakeCore()
    this.core.activeContainer = this.container;
    this.mediaControl = new MediaControl(this.core);
  });

  describe('#setVolume', function() {
    // TODO fix. needs to wait for container to be ready because
    // setVolume only called at this point
   // it('sets the volume', function() {
   //   sinon.spy(this.container, 'setVolume');
   //   sinon.spy(this.mediaControl, 'updateVolumeUI');

   //   this.mediaControl.setVolume(42)

   //   expect(this.mediaControl.volume).to.be.equal(42)
   //   expect(this.mediaControl.muted).to.be.equal(false)
   //   expect(this.container.setVolume).called.once;
   //   expect(this.mediaControl.updateVolumeUI).called.once;
   // });

    it('limits volume to an integer between 0 and 100', function() {
      this.mediaControl.setVolume(1000)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(101)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(481)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(-1)
      expect(this.mediaControl.volume).to.be.equal(0)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.volume).to.be.equal(0)
    })

    it('mutes when volume is 0 or less than 0', function() {
      this.mediaControl.setVolume(10)
      expect(this.mediaControl.muted).to.be.equal(false)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.muted).to.be.equal(true)
    });
  });

  describe('custom media control', function() {
    it('can be extend the base mediacontrol with a custom template and stylesheet', function() {
      class MyMediaControl extends MediaControl {
        get template() { return template(`<div>My HTML here</div>`) }
        get stylesheet () { return Styler.getStyleFor(`.my-css-class {}`) }
      }

      this.core.options = {mute: true}
      var mediaControl = new MyMediaControl(this.core)
      mediaControl.render();
      expect(mediaControl.$el.html()).to.be.equal(
        '<div>My HTML here</div><style class="clappr-style">.my-css-class {}</style>'
      );
    });
  });
});