const { default: findPrinters } = require("../lib/printerMatcher");

describe("findPrinters", () => {
  const printers = [
    {
      description: "TEST 1",
      dimensions: [],
    },
    {
      description: "TEST 2",
      dimensions: [
        { length: 100, height: 200 },
        { length: 50, height: 300 },
      ],
    },
  ];

  const pageFormat = { length: 200, width: 200 };
  it("should return any printer without dimensions", () => {
    const matches = findPrinters(printers, pageFormat);
    expect(matches).toHaveLength(1);
    expect(matches[0].description).toEqual("TEST 1");
  });

  it("should find specific printers", () => {
    const matches = findPrinters(printers, { length: 50, height: 300 });
    expect(matches).toHaveLength(2);
    expect(matches[0].description).toEqual("TEST 1");
    expect(matches[1].description).toEqual("TEST 2");
  });

  it("should find no matches if nothing matches", () => {
    const printersWithNoMatches = [
      { dimensions: [{ width: 0, height: 0 }] },
      { dimensions: [{ width: 100, height: 50 }] },
    ];
    const matches = findPrinters(printersWithNoMatches, {
      length: 50,
      height: 300,
    });
    expect(matches).toHaveLength(0);
  });
});
