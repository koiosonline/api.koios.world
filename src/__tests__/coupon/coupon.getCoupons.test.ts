import supertest from "supertest";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import * as CouponService from "../../api/services/CouponService";
import * as CouponRepo from "../../api/repositories/CouponRepo";
import ICouponModel from "../../api/interfaces/Schemas/ICouponModel";
import { app } from "../../index";

const expectedResponseGet: IResponseMessage = {
  success: true,
  message: "Coupon found successfully",
  data: {
    address: "0x1234567890123456789012345678901234567890",
    amount: 1,
  },
};

const repoResponseMock: ICouponModel = {
  address: "0x1234567890123456789012345678901234567890",
  amount: 1,
};

describe("coupon", () => {
  describe("[---get coupon route---]", () => {
    describe("given the coupon does exist", () => {
      it("should return the coupon", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "getCouponsForAddress")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseGet);
        const address = "0x1234567890123456789012345678901234567890";

        const { statusCode, body } = await supertest(app).get(
          `/api/coupon/getCoupons/${address}}`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseGet);
        expect(createCouponServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("coupon.getCouponsForAddress", () => {
  describe("given the coupon does exist", () => {
    it("should return the coupon", async () => {
      const createCouponRepoMock = jest
        .spyOn(CouponRepo, "findExistingCoupon")
        // @ts-ignore
        .mockReturnValueOnce(repoResponseMock);
      const address = "0x1234567890123456789012345678901234567890";

      const expectedResponse: IResponseMessage = {
        success: true,
        message: "Coupon found successfully",
        data: repoResponseMock,
      };

      const actualResponse = await CouponService.getCouponsForAddress(address);

      expect(expectedResponse).toEqual(actualResponse);
      expect(createCouponRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given an error occurs", () => {
    it("should return with a catch statement", async () => {
      const createCouponRepoMock = jest
        .spyOn(CouponRepo, "findExistingCoupon")
        // @ts-ignore
        .mockRejectedValue("error");
      const address = "0x1234567890123456789012345678901234567890";

      const expectedResponse: IResponseMessage = {
        success: false,
        error: true,
        message: "Achievement creation failed: \n " + "error",
      };

      const actualResponse = await CouponService.getCouponsForAddress(address);

      expect(expectedResponse).toEqual(actualResponse);
      expect(createCouponRepoMock).toBeCalledTimes(1);
    });
  });
});
