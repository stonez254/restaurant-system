export const tableStatuses = ["Vacant", "Seated", "Order Placed", "Bill Printed", "Dirty/Needs Cleaning"];

export const initialTables = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: "T" + (index + 1),
  seats: index % 3 === 0 ? 6 : 4,
  status: "Vacant",
  orderId: null
}));