export type AmbientController = {
  stop: () => void;
};

export const BIRTHDAY_MUSIC_LOOP = {
  src: './assets/audio/ll-cool-j-loungin-instrumental.mp3',
  title: 'LL Cool J - Loungin Who Do Ya Luv Instrumental',
  volume: 0.48,
} as const;

export function createBirthdayMusicElement(documentRef: Pick<Document, 'createElement'> = document) {
  const audio = documentRef.createElement('audio');

  audio.src = BIRTHDAY_MUSIC_LOOP.src;
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = BIRTHDAY_MUSIC_LOOP.volume;
  audio.dataset.backgroundMusic = 'chloe-birthday-loop';

  return audio;
}

export async function unlockAmbientLoop(): Promise<AmbientController> {
  const audio = createBirthdayMusicElement();

  document.body.append(audio);

  try {
    await audio.play();
  } catch (error) {
    audio.remove();
    throw error;
  }

  return {
    stop: () => {
      audio.pause();
      audio.currentTime = 0;
      audio.remove();
    },
  };
}
