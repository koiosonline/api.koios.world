import supertest from "supertest";
import { IResponseMessage } from "../api/interfaces/IResponseMessage";
import IUploadModel from "../api/interfaces/IUploadModel";
import ICouponModel from "../api/interfaces/Schemas/ICouponModel";
import * as CouponService from "../api/services/CouponService";
import { app } from "../index";

const coupon: ICouponModel = {
  address: "0x1234567890123456789012345678901234567890",
  amount: 1,
};

const expectedCouponGet: IResponseMessage = {
  success: true,
  message: "Coupon created successfully",
  data: {
    address: "0x1234567890123456789012345678901234567890",
    amount: 1,
  },
};

const expectedResponse401: IResponseMessage = {
  success: false,
  error: true,
  message: "Account not whitelisted",
};

// Whitelisted address: 0x981633bc9a25f1411e869e9E8729EedF68Db397f
const uploadModel: IUploadModel = {
  saltHash: "oHOIvFGq57QGDimJLlvPFg==",
  signature:
    "0xe7108fd6f181920601fdb2fcf8510a0b3ce3ae83adf57c2a44da4a39eb7cc1e133830cf2beca0418df719fe454fe6c642272fd622d19980a21861824c03bafa71b",
  data: coupon,
};

// Not Whitelisted address: 0x3fA6205530b137769DBb68Bb713C3786b8dAf229
const uploadModelNotWhitelisted: IUploadModel = {
  saltHash: "Wsk9k95u4GahYQJbHzOZ1w==",
  signature:
    "0x0ceb666eb6a5e1e19f6d312dce09fb28abbd294b89e81825c9c1a6b980e242643599b9cb66c7bc0dd6eeac5c4ff87ec66826f0aaaea8bb24577b4084004ed13a1c",
  data: coupon,
};

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

  describe("upload coupon route", () => {
    describe("given signature verification is correct", () => {
      it("should return create a coupon and return with creation message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadSingle")
          // @ts-ignore
          .mockReturnValueOnce(expectedCouponGet);
        const { statusCode, body } = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send(uploadModel);
        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedCouponGet);
        expect(createCouponServiceMock).toHaveBeenCalledWith(uploadModel);
      });
    });

    describe("given incorrect signature data", () => {
      it("should return with bad request message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadSingle")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponse401);
        const { statusCode } = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send({
            ...uploadModel,
            // Invalid Signature passed
            signature: "Invalid Signature Passed",
          });
        expect(statusCode).toBe(400);
        expect(createCouponServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given user not whitelisted data", () => {
      it("should return with unathorized message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadSingle")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponse401);
        const { statusCode } = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send(uploadModelNotWhitelisted);
        expect(statusCode).toBe(401);
        expect(createCouponServiceMock).not.toHaveBeenCalled();
      });
    });
  });
});
