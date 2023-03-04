export class SoundEffect {
    public path: string;
    private m_Player: HTMLAudioElement;

    constructor(path: string, loop: boolean) {
        this.m_Player = new Audio(path);
        this.m_Player.loop = loop;
    }

    public get loop(): boolean {
        return this.m_Player.loop
    }

    public set loop(v: boolean) {
        this.m_Player.loop = v;
    }

    public destroy(): void{
        this.m_Player = undefined;
    }
    
    public play(): void{
        if(!this.m_Player.paused) {
            this.stop();
        }
        this.m_Player.play();
    }

    public pause(): void{
        this.m_Player.pause();
    }

    public stop(): void{
        this.m_Player.pause();
        this.m_Player.currentTime = 0;
    }


}

export default class AudioManager {
    private static m_SoundEffects: {[name: string]: SoundEffect} = {};

    public static loadSoundFile(name:string, path: string, loop: boolean): void {
        AudioManager.m_SoundEffects[name] = new SoundEffect(path, loop);
    }

    public static playSound(name: string): void {
        if(AudioManager.m_SoundEffects[name] !== undefined) {
            AudioManager.m_SoundEffects[name].play();
        }
    }

    public static pauseSound(name: string): void {
        if(AudioManager.m_SoundEffects[name] !== undefined) {
            AudioManager.m_SoundEffects[name].pause();
        }
    }

    public static pauseAll(): void {
        for (let sfx in AudioManager.m_SoundEffects) {
            AudioManager.m_SoundEffects[sfx].pause();
        }
    }

    public static stopSound(name: string): void {
        if(AudioManager.m_SoundEffects[name] !== undefined) {
            AudioManager.m_SoundEffects[name].stop();
        }
    }

    public static stopAll(): void {
        for (let sfx in AudioManager.m_SoundEffects) {
            AudioManager.m_SoundEffects[sfx].stop();
        }
    }
}