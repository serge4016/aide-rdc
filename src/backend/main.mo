import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import IntValue "mo:caffeineai-oql/IntValue";
import CurrencyValue "types/CurrencyValue";
import ContentTypes "types/content";
import DonationTypes "types/donations";
import ContentApi "mixins/content-api";
import DonationsApi "mixins/donations-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  // --- Content state ---
  let articles : Map.Map<ContentTypes.Id, ContentTypes.Article>;
  let programmes : Map.Map<ContentTypes.Id, ContentTypes.Programme>;
  let testimonies : Map.Map<ContentTypes.Id, ContentTypes.Testimony>;
  let photos : Map.Map<ContentTypes.Id, ContentTypes.Photo>;
  let campaigns : Map.Map<ContentTypes.Id, ContentTypes.Campaign>;
  let contactMessages : Map.Map<ContentTypes.Id, ContentTypes.ContactMessage>;
  let contentState : {
    var nextArticleId : Nat;
    var nextProgrammeId : Nat;
    var nextTestimonyId : Nat;
    var nextPhotoId : Nat;
    var nextCampaignId : Nat;
    var nextContactMessageId : Nat;
  };

  // --- Donation state ---
  let donations : Map.Map<DonationTypes.Id, DonationTypes.Donation>;
  let paymentSettings : { var current : DonationTypes.PaymentSettings };
  let donationState : { var nextDonationId : Nat };

  include ContentApi(
    accessControlState,
    articles,
    programmes,
    testimonies,
    photos,
    campaigns,
    contactMessages,
    contentState,
  );

  include DonationsApi(accessControlState, donations, paymentSettings, donationState);

  include ApiDocMixin();

  // --- OQL: queryable entities ---
  // Public content is world-readable; contact messages and donations are
  // private to the platform (controllerOnly) because they carry personal data.
  include Expose({
    entities = [
      // Published articles only — drafts stay out of the public query surface.
      OQL.Entity.new<ContentTypes.Article>(
        "article",
        func () = articles.values().filter(func article = article.published),
        "Article",
        "id",
      )
        .sample({
          id = 0;
          title = "";
          category = "";
          author = "";
          publishedAt = 0;
          imageUrl = "";
          content = "";
          published = true;
        })
        .public_()
        .build(),
      // Programmes carry list fields, so they are declared manually.
      programmes.toEntityManual("programme", "Programme", "id")
        .sample({
          id = 0;
          title = "";
          description = "";
          objectives = [];
          actions = [];
          imageUrl = "";
          displayOrder = 0;
        })
        .payload("id", func p = p.id)
        .payload("title", func p = p.title)
        .payload("description", func p = p.description)
        .payload("objectives", func p = p.objectives.values().join(" | "))
        .payload("actions", func p = p.actions.values().join(" | "))
        .payload("imageUrl", func p = p.imageUrl)
        .payload("displayOrder", func p = p.displayOrder)
        .public_()
        .build(),
      // Testimonies carry an optional image URL, so they are declared manually.
      testimonies.toEntityManual("testimony", "Testimony", "id")
        .sample({ id = 0; name = ""; origin = ""; story = ""; imageUrl = ?"" })
        .payload("id", func t = t.id)
        .payload("name", func t = t.name)
        .payload("origin", func t = t.origin)
        .payload("story", func t = t.story)
        .payload("imageUrl", func t = t.imageUrl ?? "")
        .public_()
        .build(),
      photos.toEntity("photo", "Photo", "id")
        .sample({ id = 0; imageUrl = ""; caption = ""; displayOrder = 0 })
        .public_()
        .build(),
      campaigns.toEntity("campaign", "Campaign", "id")
        .sample({
          id = 0;
          title = "";
          description = "";
          goalAmount = 0;
          raisedAmount = 0;
          currency = #usd;
          active = true;
        })
        .public_()
        .build(),
      // Contact messages contain personal data — platform-only.
      contactMessages.toEntity("contactMessage", "ContactMessage", "id")
        .sample({ id = 0; name = ""; email = ""; subject = ""; message = ""; receivedAt = 0 })
        .controllerOnly()
        .build(),
      // Donations carry donor personal data — declared manually, platform-only.
      OQL.Entity.manual<DonationTypes.Donation>(
        "donation",
        func () = donations.values(),
        "Donation",
        "id",
      )
        .sample({
          id = 0;
          amount = 0;
          currency = #usd;
          frequency = #oneTime;
          programmeId = null;
          method = #mpesa;
          donor = { name = ""; email = ""; phone = ?"" };
          transactionNumber = "";
          createdAt = 0;
          status = #pending;
        })
        .payload("id", func d = d.id)
        .payload("amount", func d = d.amount)
        .payload(
          "currency",
          func d = switch (d.currency) { case (#usd) "usd"; case (#cdf) "cdf" },
        )
        .payload(
          "frequency",
          func d = switch (d.frequency) { case (#oneTime) "oneTime"; case (#monthly) "monthly" },
        )
        .payload(
          "programmeId",
          func d = switch (d.programmeId) { case (?id) id.toText(); case null "general" },
        )
        .payload(
          "method",
          func d = switch (d.method) {
            case (#mpesa) "mpesa";
            case (#orangeMoney) "orangeMoney";
            case (#airtelMoney) "airtelMoney";
            case (#afrimoney) "afrimoney";
            case (#visa) "visa";
            case (#mastercard) "mastercard";
          },
        )
        .payload("donorName", func d = d.donor.name)
        .payload("donorEmail", func d = d.donor.email)
        .payload("donorPhone", func d = d.donor.phone ?? "")
        .payload("transactionNumber", func d = d.transactionNumber)
        .payload("createdAt", func d = d.createdAt)
        .payload(
          "status",
          func d = switch (d.status) {
            case (#pending) "pending";
            case (#confirmed) "confirmed";
            case (#failed) "failed";
          },
        )
        .controllerOnly()
        .build(),
    ];
  });
};
