function dimensionsMatch(element) {
  return element.width === this.width && element.height === this.height;
}

export default function findPrinters(printers, pageFormat) {
  return printers.filter(
    printer =>
      printer.dimensions.length === 0 ||
      printer.dimensions.some(dimensionsMatch, pageFormat)
  );
}
