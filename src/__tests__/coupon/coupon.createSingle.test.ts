import supertest from "supertest";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IUploadModel from "../../api/interfaces/IUploadModel";
import ICouponModel from "../../api/interfaces/Schemas/ICouponModel";
import * as CouponService from "../../api/services/CouponService";
import * as CouponRepo from "../../api/repositories/CouponRepo";
import { app } from "../../index";

const coupon: ICouponModel = {
  address: "0x1234567890123456789012345678901234567890",
  amount: 1,
};

const expectedResponseCreate: IResponseMessage = {
  success: true,
  message: "Coupon created successfully",
  data: {
    address: "0x1234567890123456789012345678901234567890",
    amount: 1,
  },
};

const expectedResponseAdd: IResponseMessage = {
  success: true,
  message: "Coupon added successfully",
  data: {
    address: "0x1234567890123456789012345678901234567890",
    amount: 2,
  },
};

const expectedCouponModelCreate: ICouponModel = {
  address: "0x1234567890123456789012345678901234567890",
  amount: 1,
};

const expectedCouponModelAdd: ICouponModel = {
  address: "0x1234567890123456789012345678901234567890",
  amount: 2,
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

describe("coupon", () => {
  describe("[---upload single coupon route---]", () => {
    describe("given signature verification is correct", () => {
      it("should return create a coupon and return with creation message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadSingle")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseCreate);
        const { statusCode, body } = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send(uploadModel);
        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseCreate);
        expect(createCouponServiceMock).toHaveBeenCalledWith(coupon);
      });
      it("should return add a coupon and return with addition message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadSingle")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseAdd);

        const add = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send(uploadModel);
        expect(add.statusCode).toBe(200);
        expect(add.body).toEqual(expectedResponseAdd);
        expect(createCouponServiceMock).toHaveBeenCalledWith(coupon);
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

describe("coupon.createSingle", () => {
  describe("given coupon does already exist", () => {
    it("should return create a coupon and return with creation message", async () => {
      const couponRepoMock = jest
        .spyOn(CouponRepo, "findExistingCoupon")
        // @ts-ignore
        .mockReturnValueOnce(true);

      const couponRepoMockAdd = jest
        .spyOn(CouponRepo, "findAndReplaceCoupon")
        // @ts-ignore
        .mockReturnValue(expectedCouponModelAdd);

      const expectedResponse: IResponseMessage = {
        success: true,
        message: "Coupon created successfully",
        data: expectedCouponModelAdd,
      };

      const actualResponse = await CouponService.uploadSingle(coupon);

      expect(expectedResponse).toEqual(actualResponse);
      expect(couponRepoMock).toHaveBeenCalledTimes(1);
      expect(couponRepoMockAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe("given coupon does not exist", () => {
    it("should create a coupon and return with success", async () => {
      const couponRepoMock = jest
        .spyOn(CouponRepo, "findExistingCoupon")
        // @ts-ignore
        .mockReturnValueOnce(false);

      const couponRepoMockAdd = jest
        .spyOn(CouponRepo, "createCoupon")
        // @ts-ignore
        .mockReturnValue(expectedCouponModelCreate);

      const expectedResponse: IResponseMessage = {
        success: true,
        message: "Coupon created successfully",
        data: expectedCouponModelCreate,
      };

      const actualResponse = await CouponService.uploadSingle(coupon);

      expect(expectedResponse).toEqual(actualResponse);
      expect(couponRepoMock).toHaveBeenCalledTimes(1);
      expect(couponRepoMockAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe("given non-coupon model given ", () => {
    it("should return with fail error", async () => {
      const couponRepoMock = jest
        .spyOn(CouponRepo, "createOrAddCoupon")
        // @ts-ignore
        .mockRejectedValue("Error");

      const couponRepoMockCreate = jest
        .spyOn(CouponRepo, "createCoupon")
        // @ts-ignore
        .mockRejectedValue("Should not have been called");

      const couponRepoMockAdd = jest
        .spyOn(CouponRepo, "findAndReplaceCoupon")
        // @ts-ignore
        .mockRejectedValue("Should not have been called");

      const expectedResponseNon: IResponseMessage = {
        success: false,
        error: true,
        message: "Coupon creation/addition failed: \n " + "Error",
      };

      const actualResponseNon = await CouponService.uploadSingle(coupon);

      console.log(expectedResponseNon);
      console.log(actualResponseNon);

      expect(expectedResponseNon).toEqual(actualResponseNon);
      expect(couponRepoMock).toHaveBeenCalledTimes(1);
      expect(couponRepoMockAdd).toHaveBeenCalledTimes(0);
      expect(couponRepoMockCreate).toHaveBeenCalledTimes(0);
    });
  });
});
