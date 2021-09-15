
class wornedSound
{
  constructor()
  {
    this.audioBuffer = undefined;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createBufferSource();

  }

  noiseGeneration(channel=0)
  {
    const channelData = this.audioBuffer.getChannelData(channel);

    for (let i = 0; i < this.audioBuffer.length; i++) {
      if(Math.random() > 0.99995)
      {
          channelData[i] =  Math.random() * 0.4+channelData[i];
          channelData[i-1] = channelData[i]/2;
          channelData[i-2] = channelData[i]/4;
          channelData[i-3] = channelData[i]/8;
          channelData[i+1] = channelData[i]/2;
          channelData[i+2] = channelData[i]/4;
          channelData[i+3] = channelData[i]/8;
      }
    }
  }

  async fileToFloat32Arr(url="")
  {
    await window.fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      this.audioBuffer = audioBuffer;  
      this.noiseGeneration(0); 
      this.noiseGeneration(1); 
      this.run();
    });
  }

  run()
  {
    this.source.disconnect();
    this.source = this.context.createBufferSource();
    this.source.buffer =  this.audioBuffer;
    this.source.connect(this.context.destination);
    this.source.start();
    this.context.suspend();

  }
  play()
  {
    this.context.resume();
  }

  wait()
  {
    this.context.suspend();
  }

  restart()
  {
    this.source.connect();
    this.source.start();
  }

  stop()
  {
    this.source.disconnect();
  }
 
}
