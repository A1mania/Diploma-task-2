jest.setTimeout(20000);

import { ApiController } from "../helper/api_controller";
import { apiUrl } from "../config/constants";
import { apiMasterKey } from "../config/key";

describe("delete bin", () => {
  const bin = new ApiController(apiUrl);

  it("delete bin successfully", async () => {
    const res = await bin
      .postBinWithHeaders(apiMasterKey)
      .send('{"sample": "Hello World"}');

    const id = res.body.metadata.id;

    const deleteRes = await bin.deleteBinWithMasterKey(id, apiMasterKey);

    expect(deleteRes.status).toEqual(200);
    expect(deleteRes.body).toMatchObject({
      message: "Bin deleted successfully",
      metadata: {
        id: id,
        versionsDeleted: 0,
      },
    });
  });

  it("delete bin with invalid id", async () => {
    try {
      const deleteRes = await bin.deleteBinWithMasterKey("123", apiMasterKey);

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("delete bin with no id", async () => {
    try {
      const deleteRes = await bin.deleteBinWithMasterKey("", apiMasterKey);

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("delete bin with unexisting id", async () => {
    try {
      const deleteRes = await bin.deleteBinWithMasterKey(
        "6985b9e043b1c97be969c048",
        apiMasterKey,
      );

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("delete bin with wrong master key", async () => {
    try {
      const deleteRes = await bin
        .deleteBin("6985b9e043b1c97be969c048")
        .set("X-Master-Key", "123");

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    }
  });
});
