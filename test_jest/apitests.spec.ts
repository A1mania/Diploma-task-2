jest.setTimeout(20000);

import { ApiController } from "../helper/api_controller";
import { apiUrl } from "../config/constants";
import { apiMasterKey } from "../config/key";

describe("Test bin api", () => {
  describe("create bin", () => {
    const bin = new ApiController(apiUrl);
    let id: string | undefined;

    afterEach(async () => {
      if (id) {
        await bin.deleteBin(id).set("X-Master-Key", apiMasterKey);

        id = undefined;
      }
    });

    it("create bin successfully", async () => {
      const res = await bin
        .postBin()
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
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
          .postBin()
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
          .set(
            "X-Bin-Name",
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
        await bin
          .postBin()
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
          .send();

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

  describe("delete bin", () => {
    const bin = new ApiController(apiUrl);

    it("delete bin successfully", async () => {
      const res = await bin
        .postBin()
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
        .send('{"sample": "Hello World"}');

      const id = res.body.metadata.id;

      const deleteRes = await bin
        .deleteBin(id)
        .set("X-Master-Key", apiMasterKey);

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
        const deleteRes = await bin
          .deleteBin("123")
          .set("X-Master-Key", apiMasterKey);

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(400);
        expect(err.message).toBe("Bad Request");
      }
    });

    it("delete bin with no id", async () => {
      try {
        const deleteRes = await bin
          .deleteBin("")
          .set("X-Master-Key", apiMasterKey);

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toBe("Not Found");
      }
    });

    it("delete bin with unexisting id", async () => {
      try {
        const deleteRes = await bin
          .deleteBin("6985b9e043b1c97be969c048")
          .set("X-Master-Key", apiMasterKey);

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

  describe("read bin", () => {
    const bin = new ApiController(apiUrl);
    let id: string | undefined;

    afterEach(async () => {
      if (id) {
        await bin.deleteBin(id).set("X-Master-Key", apiMasterKey);

        id = undefined;
      }
    });

    it("read bin successfully", async () => {
      const res = await bin
        .postBin()
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
        .send('{"sample": "Hello World"}');

      id = res.body.metadata.id;
      if (!id) throw new Error("id was not created");

      const resGet = await bin
        .getSingleBin(id)
        .set("X-Master-Key", apiMasterKey);

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
        .postBin()
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
        .send('{"sample": "Hello World"}');

      id = res.body.metadata.id;

      const resGet = await bin
        .getSingleBinLatest(id as string)
        .set("X-Master-Key", apiMasterKey);

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
          .getSingleBin("123" as string)
          .set("X-Master-Key", apiMasterKey);

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(400);
        expect(err.message).toBe("Bad Request");
      }
    });

    it("read bin with no id", async () => {
      try {
        const resGet = await bin
          .getSingleBin("" as string)
          .set("X-Master-Key", apiMasterKey);

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toBe("Not Found");
      }
    });

    it("read bin with unexisting id", async () => {
      try {
        const resGet = await bin
          .getSingleBin("6985b9e043b1c97be969c048" as string)
          .set("X-Master-Key", apiMasterKey);

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toBe("Not Found");
      }
    });

    it("read bin with wrong master key", async () => {
      try {
        const res = await bin
          .postBin()
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
          .send('{"sample": "Hello World"}');

        id = res.body.metadata.id;
        if (!id) throw new Error("id was not created");

        const resGet = await bin
          .getSingleBin(id)
          .set("X-Master-Key", "123");

        throw new Error("Request should have failed");
      } catch (err: any) {
        expect(err.status).toBe(401);
        expect(err.message).toBe("Unauthorized");
      }
    });
  });

  describe("update bin", () => {
    const bin = new ApiController(apiUrl);
    let id: string | undefined;

    afterEach(async () => {
      if (id) {
        await bin.deleteBin(id).set("X-Master-Key", apiMasterKey);

        id = undefined;
      }
    });

    it("update bin successfully", async () => {
      const res = await bin
        .postBin()
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
        .send('{"sample": "Hello World"}');

      id = res.body.metadata.id;
      if (!id) throw new Error("id was not created");

      const resPut = await bin
        .putBin(id)
        .set("Content-Type", "application/json")
        .set("X-Master-Key", apiMasterKey)
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
          .putBin("123" as string)
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
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
          .putBin("" as string)
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
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
          .putBin("6985b9e043b1c97be969c048" as string)
          .set("Content-Type", "application/json")
          .set("X-Master-Key", apiMasterKey)
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
          .postBin()
          .set("Content-Type", "application/json")
          .set("X-Master-Key", "123")
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
});
