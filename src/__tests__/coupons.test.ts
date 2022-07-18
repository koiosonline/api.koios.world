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

const coupons: ICouponModel[] = [
  {
    address: "0x1234567890123456789012345678901234567890",
    amount: 2,
  },
  {
    address: "0x1234567890123456789012345678901234567891",
    amount: 1,
  },
  {
    address: "0x1234567890123456789012345678901234567892",
    amount: 1,
  },
];

const expectedResponseCreate: IResponseMessage = {
  success: true,
  message: "Coupon created successfully",
  data: {
    address: "0x1234567890123456789012345678901234567890",
    amount: 1,
  },
};

const expectedResponseCreateMultiple: IResponseMessage = {
  success: true,
  message: "Coupons added successfully",
  data: [
    {
      address: "0x1234567890123456789012345678901234567890",
      amount: 2,
    },
    {
      address: "0x1234567890123456789012345678901234567891",
      amount: 1,
    },
    {
      address: "0x1234567890123456789012345678901234567892",
      amount: 1,
    },
  ],
};

const expectedResponseGet: IResponseMessage = {
  success: true,
  message: "Coupon found successfully",
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

// Whitelisted address: 0x981633bc9a25f1411e869e9E8729EedF68Db397f
const uploadModelMultiple: IUploadModel = {
  saltHash: "oHOIvFGq57QGDimJLlvPFg==",
  signature:
    "0xe7108fd6f181920601fdb2fcf8510a0b3ce3ae83adf57c2a44da4a39eb7cc1e133830cf2beca0418df719fe454fe6c642272fd622d19980a21861824c03bafa71b",
  data: coupons,
};

// Not Whitelisted address: 0x3fA6205530b137769DBb68Bb713C3786b8dAf229
const uploadModelNotWhitelisted: IUploadModel = {
  saltHash: "Wsk9k95u4GahYQJbHzOZ1w==",
  signature:
    "0x0ceb666eb6a5e1e19f6d312dce09fb28abbd294b89e81825c9c1a6b980e242643599b9cb66c7bc0dd6eeac5c4ff87ec66826f0aaaea8bb24577b4084004ed13a1c",
  data: coupon,
};

// Not Whitelisted address: 0x3fA6205530b137769DBb68Bb713C3786b8dAf229
const uploadModelNotWhitelistedMultiple: IUploadModel = {
  saltHash: "Wsk9k95u4GahYQJbHzOZ1w==",
  signature:
    "0x0ceb666eb6a5e1e19f6d312dce09fb28abbd294b89e81825c9c1a6b980e242643599b9cb66c7bc0dd6eeac5c4ff87ec66826f0aaaea8bb24577b4084004ed13a1c",
  data: coupons,
};

describe("coupons", () => {
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

  describe("[---upload multiple coupons route---]", () => {
    describe("given signature verification is correct", () => {
      it("should create/add coupons and return with addition message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadMultiple")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseCreateMultiple);
        const { statusCode, body } = await supertest(app)
          .post("/api/coupon/uploadMultiple")
          .send(uploadModelMultiple);
        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseCreateMultiple);
        expect(createCouponServiceMock).toHaveBeenCalledWith(coupons);
      });
    });

    describe("given incorrect signature data", () => {
      it("should return with bad request message", async () => {
        const createCouponServiceMock = jest
          .spyOn(CouponService, "uploadMultiple")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponse401);
        const { statusCode } = await supertest(app)
          .post("/api/coupon/uploadMultiple")
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
          .spyOn(CouponService, "uploadMultiple")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponse401);
        const { statusCode } = await supertest(app)
          .post("/api/coupon/uploadSingle")
          .send(uploadModelNotWhitelistedMultiple);
        expect(statusCode).toBe(401);
        expect(createCouponServiceMock).not.toHaveBeenCalled();
      });
    });
  });
});
