function getW3CDate(date) {
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  let year = date.getFullYear() + "";
  let month = date.getMonth() + 1 + "";
  let day = date.getDate() + "";
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return `${year}-${month}-${day}`;
}

function modifySvgAttributes(svgString, { size, fill, strokeWidth } = {}) {
  // Create a working copy of the string
  let modifiedSvg = svgString;

  // Modify size (both width and height)
  if (size !== undefined) {
    modifiedSvg = modifiedSvg
      .replace(/width="([^"]*)"/, `width="${size}"`)
      .replace(/height="([^"]*)"/, `height="${size}"`);
  }

  // Modify fill
  if (fill !== undefined) {
    modifiedSvg = modifiedSvg.replace(/fill="([^"]*)"/, `fill="${fill}"`);
  }

  // Modify stroke-width
  if (strokeWidth !== undefined) {
    modifiedSvg = modifiedSvg.replace(
      /stroke-width="([^"]*)"/,
      `stroke-width="${strokeWidth}"`
    );
  }

  return modifiedSvg;
}

export { getW3CDate, modifySvgAttributes };
