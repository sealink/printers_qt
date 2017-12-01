var expect = require('chai').expect
var findPrinters = require('../dist/printers_qt').findPrinters;

describe('findPrinters', () => {
  const printers = [
    {
      description: 'TEST 1',
      dimensions: [],
    },
    {
      description: 'TEST 2',
      dimensions: [
        { length: 100, height: 200 },
        { length: 50, height: 300 },
      ]
    }
  ];

  const pageFormat = { length: 200, width: 200 };
  it ('should return any printer without dimensions', () => {
    const matches = findPrinters(printers, pageFormat);
    expect(matches).to.have.lengthOf(1);
    expect(matches[0].description).to.eq('TEST 1');
  });

  it ('should find specific printers', () => {
    const matches = findPrinters(printers, { length: 50, height: 300 });
    expect(matches).to.have.lengthOf(2);
    expect(matches[0].description).to.eq('TEST 1');
    expect(matches[1].description).to.eq('TEST 2');
  });

  it ('should find no matches if nothing matches', () => {
    const printers = [
      { dimensions: [{ width:0, height:0 }] },
      { dimensions: [{ width:100, height:50 }] },
    ];
    const matches = findPrinters(printers, { length: 50, height: 300 });
    expect(matches).to.have.lengthOf(0);
  });

});
