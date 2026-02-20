jest.setTimeout(20000);

import { ApiController } from "../helper/api_controller";
import { apiUrl } from "../config/constants";
import { apiMasterKey } from "../config/key";

describe("read bin", () => {
  const bin = new ApiController(apiUrl);
  let id: string | undefined;

  afterEach(async () => {
    if (id) {
      try {
        await bin.deleteBinWithMasterKey(id, apiMasterKey);
      } catch (error) {
        console.warn(`Failed to delete bin ${id}:`, error);
      } finally {
        id = undefined;
      }
    }
  });

  it("read bin successfully", async () => {
    const res = await bin
      .postBinWithHeaders(apiMasterKey)
      .send('{"sample": "Hello World"}');

    id = res.body.metadata.id;
    if (!id) throw new Error("id was not created");

    const resGet = await bin.getBinWithMasterKey(id, apiMasterKey);

    expect(resGet.status).toEqual(200);
    expect(resGet.body).toMatchObject({
      metadata: {
        id: expect.any(String),
      },
      record: {
        sample: "Hello World",
      },
    });
  });

  it("read latest bin successfully", async () => {
    const res = await bin
      .postBinWithHeaders(apiMasterKey)
      .send('{"sample": "Hello World"}');

    id = res.body.metadata.id;

    const resGet = await bin
      .getBinWithMasterKey(id as string, apiMasterKey, true);
      

    expect(resGet.status).toEqual(200);
    expect(resGet.body).toMatchObject({
      metadata: {
        id: expect.any(String),
      },
      record: {
        sample: "Hello World",
      },
    });
  });

  it("read bin with invalid id", async () => {
    try {
      const resGet = await bin
        .getBinWithMasterKey("123", apiMasterKey);

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("read bin with no id", async () => {
    try {
      const resGet = await bin
        .getBinWithMasterKey("", apiMasterKey);
      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("read bin with unexisting id", async () => {
    try {
      const resGet = await bin
        .getBinWithMasterKey("6985b9e043b1c97be969c048", apiMasterKey);
      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Not Found");
    }
  });

  it("read bin with wrong master key", async () => {
    try {
      const res = await bin
        .postBinWithHeaders(apiMasterKey)
        .send('{"sample": "Hello World"}');

      id = res.body.metadata.id;
      if (!id) throw new Error("id was not created");

      const resGet = await bin.getSingleBin(id).set("X-Master-Key", "123");

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    }
  });
});
