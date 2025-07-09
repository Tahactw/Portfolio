export const SOUND_URLS = {
  'dock-hover': '/sounds/dock-hover.mp3',
  'dock-click': '/sounds/dock-click.mp3',
  'robot-footstep': '/sounds/robot-footstep.mp3',
  'ambient-city': '/sounds/ambient-city.mp3',
  'building-enter': '/sounds/building-enter.mp3',
  'ui-toggle': '/sounds/ui-toggle.mp3',
};

export type SoundName = keyof typeof SOUND_URLS;