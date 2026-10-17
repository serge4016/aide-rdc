import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";
import { registerCaller } from "./test-utils";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

describe("public reads", () => {
  it("answers empty-state reads instead of trapping", async () => {
    await expect(actor.listPublishedArticles()).resolves.toEqual([]);
    await expect(actor.listProgrammes()).resolves.toEqual([]);
    await expect(actor.listTestimonies()).resolves.toEqual([]);
    await expect(actor.listPhotos()).resolves.toEqual([]);
    await expect(actor.listActiveCampaigns()).resolves.toEqual([]);
  });

  it("returns the payment settings needed by the donation flow", async () => {
    const settings = await actor.getPaymentSettings();
    expect(settings).toHaveProperty("mpesa");
    expect(settings).toHaveProperty("visa");
    expect(settings).toHaveProperty("mastercard");
    expect(settings).toHaveProperty("acceptedCurrencies");
  });
});

describe("contact and donations", () => {
  it("round-trips a contact message through the real canister", async () => {
    const created = await actor.submitContactMessage(
      "Ada",
      "ada@example.com",
      "Bonjour",
      "Un message de test.",
    );
    expect(created.name).toBe("Ada");
    expect(created.email).toBe("ada@example.com");
  });

  it("records a donation and reads it back with a transaction number", async () => {
    const created = await actor.createDonation(
      50n,
      { usd: null },
      { monthly: null },
      [],
      { visa: null },
      { name: "Ada", email: "ada@example.com", phone: [] },
    );
    expect(created.amount).toBe(50n);
    expect(created.transactionNumber.length).toBeGreaterThan(0);

    const read = await actor.getDonation(created.id);
    expect(read).toHaveLength(1);
    expect(read[0]?.transactionNumber).toBe(created.transactionNumber);
  });
});

describe("admin content management", () => {
  it("lets an administrator create, update and delete an article", async () => {
    const admin = await registerCaller(
      pic!.createActor<_SERVICE>(idlFactory, canisterId),
      createIdentity("admin"),
    );

    const article = await admin.createArticle(
      "Titre",
      "Terrain",
      "Auteur",
      "",
      "Contenu",
      true,
    );
    expect(article.title).toBe("Titre");

    const updated = await admin.updateArticle(
      article.id,
      "Titre modifié",
      "Terrain",
      "Auteur",
      "",
      "Contenu",
      true,
    );
    expect(updated[0]?.title).toBe("Titre modifié");

    await expect(admin.deleteArticle(article.id)).resolves.toBe(true);
  });

  it("rejects an anonymous caller on an admin write", async () => {
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(
      guest.createArticle("Titre", "Terrain", "Auteur", "", "Contenu", true),
    ).rejects.toThrow();
  });
});
