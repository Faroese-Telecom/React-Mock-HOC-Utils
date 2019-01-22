export const GetFileName = file => {
  const withExt = file.split(/(\\|\/)/g).pop();
  return withExt.split(".")[0]; // ? without the extension
};

export const SetFirstCase = (text, firstCase) => {
  if (text.length < 1) return text;

  switch (firstCase) {
    case "#uc":
      text = text.charAt(0).toUpperCase() + text.slice(1);
      break;
    case "#lc":
      text = text.charAt(0).toLowerCase() + text.slice(1);
      break;
  }

  return text;
};
