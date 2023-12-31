export const ERRORS = {
  INTERNAL_ERROR: 'One of our gnomes do something wrong. Sorry for that. Or contact with the gnome, I don\'t know.',
  INVALID_LOGIN: 'Your password are invalid. Take it easy.',
  BAD_PERMISSIONS: 'You need other permissions to check this.',
  BAD_REQUEST: 'No, no, no. Your request are wrong.',
  NOT_FILE_ERROR: 'File error, not found or bad requested, :D',
  NOT_SUPPORTED_FILE: 'Not supported mimetype.',
  NOT_FOUND: (val: string | number) => `${val} not found. Probably it is in another galaxy. Try to launch a message to space.`,
  IN_USE: (val: string | number) => `${val} in use. Use another or try to login.`,
  UNAUTHORIZED: 'Unauthorized: Through a series of highly sophisticated and complex algorithms, this system has determined that you are not presently authorized to use this system function. It could be that you simply mistyped a password, or, it could be that you are some sort of interplanetary alien-being that has no hands and, thus, cannot type. If I were a gambler, I would bet that a cat (an orange tabby named Sierra or Harley) somehow jumped onto your keyboard and forgot some of the more important pointers from those typing lessons you paid for. Based on the actual error encountered, I would guess that the feline in question simply forgot to place one or both paws on the appropriate home keys before starting. Then again, I suppose it could have been a keyboard error caused by some form of cosmic radiation; this would fit nicely with my interplanetary alien-being theory. If you think this might be the cause, perhaps you could create some sort of underground bunker to help shield yourself from it. I don\'t know that it will work, but, you will probably feel better if you try something.',
} as const;
