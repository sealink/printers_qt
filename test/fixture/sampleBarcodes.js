const CONSUMER_SPLIT_BARCODE = {
  id: 9,
  format: 0,
  reference: "22222K",
  reservation: {
    id: 3,
    booking_id: 12,
    trip_id: 1,
    route_id: null,
    service_id: null,
    departure_time: null,
    departure_date: "2017-11-15",
  },
  resource: {
    id: 11,
    name: "Rottnest Island Gift Voucher - Different Day Return",
  },
  vehicles: [
    {
      id: 257194,
      type: {
        id: 10,
        name: "Luggage  (no larger than 800mm x 500mm x 400mm)",
      },
      length: "1.0",
      width: null,
      height: "0.1",
      details: null,
      cargo: null,
      registration: null,
    },
  ],
  passengers: [
    {
      id: 16,
      name: "",
      type: {
        id: 1,
        name: "Adult",
      },
    },
  ],
  requires_review: false,
  todo_items: ["Item 1", "Item 2"],
};

const RESERVATION_BARCODE = {
  id: 172931,
  format: 1,
  reference: "229JGQ",
  resource: {
    id: 2,
    name: "Rottnest Island",
  },
  reservation: {
    id: 172931,
    booking_id: 75688,
    trip_id: 35,
    route_id: 1,
    service_id: 7673,
    departure_time: "0910",
    departure_date: "2018-04-17",
  },
  passenger_first_name: "Homer Simpson",
  passengers: {
    Ad: 2,
    Ch: 3,
  },
  vehicles: {
    Lugg: 2,
  },
  requires_review: false,
  todo_items: ["Item 1", "Item 2"],
};

const CONSUMER_SPLIT_SCAN = {
  barcode: {
    id: 9,
    format: 0,
    reference: "22222K",
    reservation: {
      id: 3,
      booking_id: 12,
      trip_id: 1,
      route_id: null,
      service_id: null,
      departure_time: null,
      departure_date: "2017-11-15",
    },
    resource: {
      id: 11,
      name: "Rottnest Island Gift Voucher - Different Day Return",
    },
    vehicles: [
      {
        id: 257194,
        type: {
          id: 10,
          name: "Luggage  (no larger than 800mm x 500mm x 400mm)",
        },
        length: "1.0",
        width: null,
        height: "0.1",
        details: null,
        cargo: null,
        registration: null,
      },
    ],
    passengers: [
      {
        id: 16,
        name: "",
        type: {
          id: 1,
          name: "Adult",
        },
      },
    ],
    requires_review: false,
    todo_items: ["Item 1", "Item 2"],
  },
  id: "1",
};

const RESERVATION_SCAN = {
  barcode: {
    id: 172931,
    format: 1,
    reference: "229JGQ",
    resource: {
      id: 2,
      name: "Rottnest Island",
    },
    reservation: {
      id: 172931,
      booking_id: 75688,
      trip_id: 35,
      route_id: 1,
      service_id: 7673,
      departure_time: "0910",
      departure_date: "2018-04-17",
    },
    passenger_first_name: "Homer Simpson",
    passengers: {
      Ad: 2,
      Ch: 3,
    },
    vehicles: {
      Lugg: 2,
    },
    requires_review: false,
    todo_items: ["Item 1", "Item 2"],
  },
  id: "1",
};

module.exports = {
  CONSUMER_SPLIT_BARCODE,
  RESERVATION_BARCODE,
  CONSUMER_SPLIT_SCAN,
  RESERVATION_SCAN,
};
