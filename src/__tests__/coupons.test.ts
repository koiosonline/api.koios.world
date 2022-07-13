import supertest from "supertest";
import { app } from "../index";

describe("coupons", () => {
  describe("get coupon route", () => {
    describe("given the coupon does exist", () => {
      it("should return the coupon", async () => {
        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397f";
        await supertest(app)
          .get(`/api/coupon/getCoupons/${address}`)
          .expect(200);
        expect(true).toBe(true);
      });
    });
  });
});
