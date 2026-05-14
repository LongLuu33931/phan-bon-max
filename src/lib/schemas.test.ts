import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./schemas";

describe("checkoutSchema", () => {
  it("accepts a valid COD order", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Nguyen Van A",
      phone: "0396726429",
      address: "123 duong vuon cay",
      province: "Can Tho",
      items: [{ productId: "prod-fruit", quantity: 2 }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty cart", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Nguyen Van A",
      phone: "0396726429",
      address: "123 duong vuon cay",
      province: "Can Tho",
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
