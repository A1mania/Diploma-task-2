jest.setTimeout(20000);

import { ApiController } from "../helper/api_controller";
import { apiUrl } from "../config/constants";
import { apiMasterKey } from "../config/key";

describe("update bin", () => {
  const bin = new ApiController(apiUrl);
  let id: string | undefined;

  afterEach(async () => {
    if (id) {
      try {
        await bin.deleteBin(id).set("X-Master-Key", apiMasterKey);
      } catch (error) {
        console.warn(`Failed to delete bin ${id}:`, error);
      } finally {
        id = undefined;
      }
    }
  });

  it("update bin successfully", async () => {
    const res = await bin
      .postBinWithHeaders(apiMasterKey)
      .send('{"sample": "Hello World"}');

    id = res.body.metadata.id;
    if (!id) throw new Error("id was not created");

    const resPut = await bin
      .putBinWithHeaders(id, apiMasterKey)
      .send('{"sample": "upd"}');

    expect(resPut.status).toEqual(200);
    expect(resPut.body).toMatchObject({
      metadata: {
        parentId: id,
      },
      record: {
        sample: "upd",
      },
    });
  });

  it("update bin with invalid id", async () => {
    try {
      const resPut = await bin
        .putBinWithHeaders("123", apiMasterKey)
        .send('{"sample": "upd"}');
      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("update bin with no id", async () => {
    try {
      const resPut = await bin
        .putBinWithHeaders("", apiMasterKey)
        .send('{"sample": "upd"}');

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("update bin with unexisting id", async () => {
    try {
      const resPut = await bin
        .putBinWithHeaders("6985b9e043b1c97be969c048", apiMasterKey)
        .send('{"sample": "upd"}');

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("update bin with wrong master key", async () => {
    try {
      const res = await bin
        .postBinWithHeaders(apiMasterKey)
        .send('{"sample": "Hello World"}');

      id = res.body.metadata.id;
      if (!id) throw new Error("id was not created");

      const resPut = await bin
        .putBin(id)
        .set("Content-Type", "application/json")
        .set("X-Master-Key", "123")
        .send('{"sample": "upd"}');

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    }
  });
});
