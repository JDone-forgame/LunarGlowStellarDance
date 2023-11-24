import { AudioClip, AudioSource, Component, Node } from 'cc';
import { ResMgr } from './ResMgr';
import { CocosUtils } from '../Utils/CocosUtils';

export class SoundMgr extends Component {
    public static Instance: SoundMgr = null!;

    private static MAX_SOUNDS: number = 8;

    // 注: LocalStrorage,多个h5 游戏都共用一个, 
    private static MusicMuteKey: string = "MusicMute";
    private static SoundMuteKey: string = "SoundMute";
    private static VolumeKey: string = "GameVolume";
    private static SoundsBundleName: string = "Sounds";
    private static MusicBundleName: string = "Sounds";


    private musicAudioSource: AudioSource = null!;
    
    private soundAudioSources: Array<AudioSource> = null;
    private curIndex: number = 0;

    private isMusicMute: boolean = false;
    private isSoundMute: boolean = false;

    private volume: number = 0;

    protected onLoad(): void {
        if(SoundMgr.Instance !== null) {
            this.destroy();
            return;
        }

        SoundMgr.Instance = this;
    }

    public Init(musicBundleName: string = null, soundsBundleName: string = null): void {
        if(musicBundleName !== null && soundsBundleName === null) {
            SoundMgr.SoundsBundleName = musicBundleName;
            SoundMgr.MusicBundleName = musicBundleName;
        }
        else if(musicBundleName !== null && soundsBundleName !== null) {
            SoundMgr.SoundsBundleName = soundsBundleName;
            SoundMgr.MusicBundleName = musicBundleName;
        }
        

        this.musicAudioSource = this.node.addComponent(AudioSource);
        this.musicAudioSource.playOnAwake = false;

        this.soundAudioSources = new Array<AudioSource>();
        for(var i = 0; i < SoundMgr.MAX_SOUNDS; i ++) {
            var as = this.node.addComponent(AudioSource);
            as.playOnAwake = false;
            this.soundAudioSources.push(as);
        }

        this.curIndex = 0;
        this.isMusicMute = false;
        this.isSoundMute = false;
        this.volume = 1.0; 

        // 从localStroage读取配置
        var value: string = localStorage.getItem(SoundMgr.MusicMuteKey);
        if(value != null) {
            this.isMusicMute = (value == "true")? true: false;
        }

        value = localStorage.getItem(SoundMgr.SoundMuteKey);
        if(value != null) {
            this.isSoundMute = (value == "true")? true: false;
        }

        value = localStorage.getItem(SoundMgr.VolumeKey);
        if(value !== null) {
            this.volume = parseFloat(value);
            this.volume = (this.volume < 0)? 0 : this.volume;
            this.volume = (this.volume > 1)? 1 : this.volume;
        }
        // end
    }

    public StopMusic(): void {
        this.musicAudioSource.stop();
    }

    public async PlayMusic(assetPath: string, isLoop: boolean = true) {
        console.log("^^^PlayMusic");
        if(this.isMusicMute) {
            return;
        }

        var clip = await ResMgr.Instance.IE_GetAsset(SoundMgr.MusicBundleName, assetPath, AudioClip);
        if(clip === null) {
            return;
        }

        this.musicAudioSource.clip = clip as AudioClip;
        this.musicAudioSource.loop = isLoop;

        this.musicAudioSource.stop();
        this.musicAudioSource.play();
    }

    public async PlaySound(assetPath: string, isLoop: boolean = false) {
        if(this.isSoundMute) {
            return;
        }

        var clip = await ResMgr.Instance.IE_GetAsset(SoundMgr.SoundsBundleName, assetPath, AudioClip);
        if(clip === null) {
            return;
        }

        var audioSource: AudioSource = this.soundAudioSources[this.curIndex];
        this.curIndex ++;
        if(this.curIndex >= SoundMgr.MAX_SOUNDS) {
            this.curIndex = 0;
        }


        audioSource.clip = clip as AudioClip;
        audioSource.loop = isLoop;

        audioSource.stop();
        audioSource.play();
    }

    // get, set
    public SetVolume(volume: number): void {
        this.volume = CocosUtils.clamp(volume, 0, 1);
        
        this.musicAudioSource.volume = this.volume;
        for(var i = 0; i < this.soundAudioSources.length; i ++) {
            var audioSource: AudioSource = this.soundAudioSources[i];
            audioSource.volume = this.volume;
        }

        localStorage.setItem(SoundMgr.VolumeKey, this.volume.toString());
    }

    public SetMusicMute(isMute: boolean): void {
        if(this.isMusicMute == isMute) {
            return;
        }

        this.isMusicMute = !this.isMusicMute;
        if(this.isMusicMute) {
            this.musicAudioSource.pause();
        }
        else {
            this.musicAudioSource.play();
        }
        
        localStorage.setItem(SoundMgr.MusicMuteKey, this.isMusicMute.toString());
    }

    public GetMusicMute(isMute: boolean): boolean {
        return this.isMusicMute;
    }

    public SetSoundMute(isMute): void {
        if(this.isSoundMute == isMute) {
            return;
        }

        this.isSoundMute = !this.isSoundMute;
        for(var i = 0; i < this.soundAudioSources.length; i ++) {
            var audioSource: AudioSource = this.soundAudioSources[i];
            if(this.isSoundMute) {
                audioSource.pause();
            }
            else {
                audioSource.play();
            }
        }

        localStorage.setItem(SoundMgr.SoundMuteKey, this.isSoundMute.toString());
    }

    public GetSoundMute(): boolean {
        return this.isSoundMute;
    }
}



