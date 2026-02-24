jest.setTimeout(20000);

import { ApiController } from "../helper/api_controller";
import { apiUrl } from "../config/constants";
import { apiMasterKey } from "../config/key";

describe("create bin", () => {
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

  it("create bin successfully", async () => {
    const res = await bin
      .postBinWithHeaders(apiMasterKey)
      .send('{"sample": "Hello World"}');

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject({
      metadata: {
        id: expect.any(String),
      },
      record: {
        sample: "Hello World",
      },
    });

    id = res.body.metadata.id;
  });

  it("create bin with long bin name", async () => {
    try {
      await bin
        .postBinWithHeaders(
          apiMasterKey,
          "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated th",
        )
        .send('{"sample": "Hello World"}');

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("create bin with empty data", async () => {
    try {
      await bin.postBinWithHeaders(apiMasterKey).send();

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("create bin without content-type", async () => {
    try {
      await bin
        .postBin()
        .set("X-Master-Key", apiMasterKey)
        .send('{"sample": "Hello World"}');

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("create bin with no master key", async () => {
    try {
      await bin
        .postBin()
        .set("Content-Type", "application/json")
        .send({ sample: "Hello World" });

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    }
  });

  it("create bin with wrong master key", async () => {
    try {
      await bin
        .postBin()
        .set("X-Master-Key", "123")
        .send({ sample: "Hello World" });

      throw new Error("Request should have failed");
    } catch (err: any) {
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    }
  });
});
