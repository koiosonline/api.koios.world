import * as LayerService from "../../api/services/LayerService";
import supertest from "supertest";
import { app } from "../../index";
import ILayerClaimModel from "../../api/interfaces/ILayerClaimModel";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import * as CouponRepo from "../../api/repositories/CouponRepo";
import * as SignatureVerificationService from "../../api/services/util/SignatureVerificationService";

const expectedReturnGetSignature: IResponseMessage = {
  success: true,
  message: "Successfully retrieved signature",
  data: {
    signature: "0x123456789",
    saltHash: "0x123456789",
    tokenId: 1,
  },
};

const expectedReturnGetSignatureNoCoupon: IResponseMessage = {
  success: false,
  error: true,
  message: "No coupons left!",
};

describe("layer", () => {
  describe("[---retrieve signature route---]", () => {
    describe("given data is valid and coupon is left", () => {
      it("should deduct a coupon and generate a signature", async () => {
        const LayerServiceMock = jest
          .spyOn(LayerService, "getSignature")
          // @ts-ignore
          .mockReturnValue(expectedReturnGetSignature);

        const CouponRepoMock = jest
          .spyOn(CouponRepo, "findExistingCoupon")
          // @ts-ignore
          .mockReturnValue({ address: "0x123456789", amount: 1 });

        const signatureData: ILayerClaimModel = {
          saltHash: "hi",
          signature:
            "0x8d9b5520a58ebb30f66014d33ce675dc7b7b3a04b658de1009a1d95eb1340425004895cb6a5fae10d093f906c9e7b978ebb86092e3dde0acd5661e3da8c33fb61b",
          tokenId: 1,
        };

        const { statusCode, body } = await supertest(app)
          .post(`/api/layer/signature/`)
          .send(signatureData);

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedReturnGetSignature);
        expect(LayerServiceMock).toBeCalledTimes(1);
        expect(CouponRepoMock).toBeCalledTimes(1);
      });
    });

    describe("given data is valid and coupon no left", () => {
      it("should return with 401", async () => {
        const LayerServiceMock = jest
          .spyOn(LayerService, "getSignature")
          // @ts-ignore
          .mockReturnValue(expectedReturnGetSignatureNoCoupon);

        const SignatureVerificationServiceMock = jest
          .spyOn(SignatureVerificationService, "verifyMessageForLayer")
          // @ts-ignore
          .mockReturnValue({ address: "0x123456789", amount: 0 });

        const signatureData: ILayerClaimModel = {
          saltHash: "hi",
          signature:
            "0x8d9b5520a58ebb30f66014d33ce675dc7b7b3a04b658de1009a1d95eb1340425004895cb6a5fae10d093f906c9e7b978ebb86092e3dde0acd5661e3da8c33fb61b",
          tokenId: 1,
        };

        const { statusCode, body } = await supertest(app)
          .post(`/api/layer/signature/`)
          .send(signatureData);

        expect(statusCode).toBe(401);
        expect(body).toEqual(expectedReturnGetSignatureNoCoupon);
        expect(LayerServiceMock).toBeCalledTimes(0);
        expect(SignatureVerificationServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("layer.getSignature", () => {
  describe("given a coupon has to be removed and successfully generated signature", () => {
    it("should return with success and signature data", async () => {
      const CouponRepoMock = jest
        .spyOn(CouponRepo, "findAndRemoveCoupon")
        // @ts-ignore
        .mockReturnValue(true);

      const actualResponse: IResponseMessage = await LayerService.getSignature(
        "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
        1
      );

      expect(actualResponse.success).toEqual(true);
      expect(actualResponse.message).toEqual(
        "Successfully retrieved signature"
      );
      expect(actualResponse.data).not.toBeNull();
      expect(CouponRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given something went wrong", () => {
    it("should return with error true", async () => {
      const CouponRepoMock = jest
        .spyOn(CouponRepo, "findAndRemoveCoupon")
        // @ts-ignore
        .mockReturnValue(false);

      const actualResponse: IResponseMessage = await LayerService.getSignature(
        "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
        1
      );

      expect(actualResponse.success).toEqual(false);
      expect(actualResponse.error).toEqual(true);
      expect(actualResponse.message).toEqual(
        "Something went wrong: \n " + "false"
      );
      expect(actualResponse.data).toBeUndefined();
      expect(CouponRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given repo rejects request", () => {
    it("should return with error true", async () => {
      const CouponRepoMock = jest
        .spyOn(CouponRepo, "findAndRemoveCoupon")
        // @ts-ignore
        .mockRejectedValue(false);

      const actualResponse: IResponseMessage = await LayerService.getSignature(
        "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
        1
      );

      expect(actualResponse.success).toEqual(false);
      expect(actualResponse.error).toEqual(true);
      expect(actualResponse.message).toEqual(
        "Signature fetch failed: \n " + "false"
      );
      expect(actualResponse.data).toBeUndefined();
      expect(CouponRepoMock).toBeCalledTimes(1);
    });
  });
});
