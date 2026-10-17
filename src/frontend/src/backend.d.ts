import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    id: Id;
    title: string;
    content: string;
    published: boolean;
    publishedAt: Timestamp;
    author: string;
    imageUrl: string;
    category: string;
}
export interface Campaign {
    id: Id;
    title: string;
    goalAmount: bigint;
    active: boolean;
    description: string;
    raisedAmount: bigint;
    currency: Currency;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface ContactMessage {
    id: Id;
    subject: string;
    name: string;
    email: string;
    receivedAt: Timestamp;
    message: string;
}
export interface Donation {
    id: Id;
    status: DonationStatus;
    method: PaymentMethod;
    createdAt: Timestamp;
    transactionNumber: string;
    currency: Currency;
    frequency: Frequency;
    programmeId?: Id;
    amount: bigint;
    donor: DonorInfo;
}
export interface DonorInfo {
    name: string;
    email: string;
    phone?: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Id = bigint;
export interface MethodSettings {
    enabled: boolean;
    apiKey: string;
    apiSecret: string;
}
export interface PaymentSettings {
    mpesa: MethodSettings;
    acceptedCurrencies: Array<Currency>;
    afrimoney: MethodSettings;
    testMode: boolean;
    visa: MethodSettings;
    mastercard: MethodSettings;
    orangeMoney: MethodSettings;
    airtelMoney: MethodSettings;
    webhookUrl: string;
}
export interface Photo {
    id: Id;
    displayOrder: bigint;
    imageUrl: string;
    caption: string;
}
export interface Programme {
    id: Id;
    title: string;
    displayOrder: bigint;
    description: string;
    actions: Array<string>;
    imageUrl: string;
    objectives: Array<string>;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Testimony {
    id: Id;
    name: string;
    origin: string;
    story: string;
    imageUrl?: string;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum Currency {
    cdf = "cdf",
    usd = "usd"
}
export enum DonationStatus {
    pending = "pending",
    confirmed = "confirmed",
    failed = "failed"
}
export enum Frequency {
    oneTime = "oneTime",
    monthly = "monthly"
}
export enum PaymentMethod {
    mpesa = "mpesa",
    afrimoney = "afrimoney",
    visa = "visa",
    mastercard = "mastercard",
    orangeMoney = "orangeMoney",
    airtelMoney = "airtelMoney"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, category: string, author: string, imageUrl: string, content: string, published: boolean): Promise<Article>;
    createCampaign(title: string, description: string, goalAmount: bigint, currency: Currency, active: boolean): Promise<Campaign>;
    /**
     * / Public: record a donation (no sign-in required).
     */
    createDonation(amount: bigint, currency: Currency, frequency: Frequency, programmeId: Id | null, method: PaymentMethod, donor: DonorInfo): Promise<Donation>;
    createPhoto(imageUrl: string, caption: string, displayOrder: bigint): Promise<Photo>;
    createProgramme(title: string, description: string, objectives: Array<string>, actions: Array<string>, imageUrl: string, displayOrder: bigint): Promise<Programme>;
    createTestimony(name: string, origin: string, story: string, imageUrl: string | null): Promise<Testimony>;
    deleteArticle(id: Id): Promise<boolean>;
    deleteCampaign(id: Id): Promise<boolean>;
    deleteContactMessage(id: Id): Promise<boolean>;
    deletePhoto(id: Id): Promise<boolean>;
    deleteProgramme(id: Id): Promise<boolean>;
    deleteTestimony(id: Id): Promise<boolean>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getArticle(id: Id): Promise<Article | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaign(id: Id): Promise<Campaign | null>;
    /**
     * / Public: read a donation by id (for the confirmation page).
     */
    getDonation(id: Id): Promise<Donation | null>;
    /**
     * / Public: payment settings needed by the donation flow.
     */
    getPaymentSettings(): Promise<PaymentSettings>;
    getProgramme(id: Id): Promise<Programme | null>;
    isCallerAdmin(): Promise<boolean>;
    listActiveCampaigns(): Promise<Array<Campaign>>;
    listAllArticles(): Promise<Array<Article>>;
    listAllCampaigns(): Promise<Array<Campaign>>;
    listContactMessages(): Promise<Array<ContactMessage>>;
    /**
     * / Admin: list all donations.
     */
    listDonations(): Promise<Array<Donation>>;
    listPhotos(): Promise<Array<Photo>>;
    listProgrammes(): Promise<Array<Programme>>;
    listPublishedArticles(): Promise<Array<Article>>;
    listTestimonies(): Promise<Array<Testimony>>;
    schema(): Promise<string>;
    /**
     * / Public contact form submission.
     */
    submitContactMessage(name: string, email: string, subject: string, message: string): Promise<ContactMessage>;
    updateArticle(id: Id, title: string, category: string, author: string, imageUrl: string, content: string, published: boolean): Promise<Article | null>;
    updateCampaign(id: Id, title: string, description: string, goalAmount: bigint, currency: Currency, active: boolean): Promise<Campaign | null>;
    /**
     * / Admin: update a donation's status.
     */
    updateDonationStatus(id: Id, status: DonationStatus): Promise<Donation | null>;
    /**
     * / Admin: replace payment settings.
     */
    updatePaymentSettings(next: PaymentSettings): Promise<PaymentSettings>;
    updatePhoto(id: Id, imageUrl: string, caption: string, displayOrder: bigint): Promise<Photo | null>;
    updateProgramme(id: Id, title: string, description: string, objectives: Array<string>, actions: Array<string>, imageUrl: string, displayOrder: bigint): Promise<Programme | null>;
    updateTestimony(id: Id, name: string, origin: string, story: string, imageUrl: string | null): Promise<Testimony | null>;
}
