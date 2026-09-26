# Fan Hub Plus — Database Schema

Database: `fanhub` · Engine: MongoDB · ODM: Mongoose

Generated from the live Mongoose models by `npm run schema`, so it cannot
drift out of step with the code. Do not edit by hand.

## Collections at a glance

| Collection | Model | Fields | Indexes | Documents |
| --- | --- | ---: | ---: | ---: |
| `activitylogs` | ActivityLog | 9 | 3 | 13 |
| `bookmarks` | Bookmark | 7 | 2 | 2 |
| `characterprofiles` | CharacterProfile | 14 | 5 | 32 |
| `chatbotqueries` | ChatbotQuery | 8 | 3 | 24 |
| `contents` | Content | 30 | 8 | 57 |
| `events` | Event | 18 | 7 | 16 |
| `fansubmissions` | FanSubmission | 20 | 4 | 1 |
| `faqentries` | FaqEntry | 9 | 2 | 8 |
| `feedbacks` | Feedback | 11 | 3 | 0 |
| `merchandiseitems` | MerchandiseItem | 15 | 6 | 25 |
| `ratebuckets` | RateBucket | 3 | 1 | 2 |
| `ratings` | Rating | 7 | 3 | 1 |
| `tokens` | Token | 8 | 3 | 0 |
| `users` | User | 16 | 2 | 3 |

## `activitylogs`

Mongoose model: **ActivityLog**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId | yes |  | → User |  |
| `action` | String | yes |  | `registered`, `logged-in`, `viewed-content`, `bookmarked`, `unbookmarked`, `rated`, `submitted-feedback`, `submitted-content`, `updated-profile`, `chatbot-message` |  |
| `label` | String |  |  |  | `""` |
| `targetType` | String |  |  |  | `""` |
| `targetId` | ObjectId |  |  |  | `null` |
| `href` | String |  |  |  | `""` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ action: 1 }`
- `{ userId: 1, createdAt: -1 }`

## `bookmarks`

Mongoose model: **Bookmark**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId | yes |  | → User |  |
| `targetType` | String | yes |  | `content`, `character`, `merchandise`, `event` |  |
| `targetId` | ObjectId | yes |  |  |  |
| `note` | String |  |  |  | `""` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ userId: 1, targetType: 1, targetId: 1 }` — {"unique":true}

## `characterprofiles`

Mongoose model: **CharacterProfile**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `name` | String | yes |  |  |  |
| `slug` | String | yes | yes |  |  |
| `category` | String | yes |  | `anime`, `gaming`, `movies`, `tv-shows`, `k-pop`, `comics`, `manga`, `cosplay` |  |
| `franchise` | String |  |  |  | `""` |
| `bio` | String |  |  |  | `""` |
| `imageUrl` | String |  |  |  | `""` |
| `imagePublicId` | String |  |  |  | `""` |
| `traits` | Mixed[] |  |  |  |  |
| `debutYear` | Number |  |  |  | `null` |
| `viewCount` | Number |  |  |  | `0` |
| `popularityScore` | Number |  |  |  | `0` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ slug: 1 }` — {"unique":true}
- `{ category: 1 }`
- `{ franchise: 1 }`
- `{ popularityScore: 1 }`
- `{ name: text, franchise: text, traits: text }`

## `chatbotqueries`

Mongoose model: **ChatbotQuery**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId |  |  | → User | `null` |
| `sessionId` | String | yes |  |  |  |
| `message` | String | yes |  |  |  |
| `response` | String |  |  |  | `""` |
| `matchedFaqId` | ObjectId |  |  | → FaqEntry | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ sessionId: 1 }`
- `{ sessionId: 1, createdAt: 1 }`

## `contents`

Mongoose model: **Content**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `title` | String | yes |  |  |  |
| `slug` | String | yes | yes |  |  |
| `category` | String | yes |  | `anime`, `gaming`, `movies`, `tv-shows`, `k-pop`, `comics`, `manga`, `cosplay` |  |
| `type` | String | yes |  | `article`, `video`, `audio`, `image` |  |
| `summary` | String |  |  |  | `""` |
| `body` | String |  |  |  | `""` |
| `coverImage` | String |  |  |  | `""` |
| `coverPublicId` | String |  |  |  | `""` |
| `mediaUrl` | String |  |  |  | `""` |
| `mediaPoster` | String |  |  |  | `""` |
| `mediaCredit` | String |  |  |  | `""` |
| `mediaRuntime` | String |  |  |  | `""` |
| `mediaTags` | Mixed[] |  |  |  |  |
| `gallery` | Mixed[] |  |  |  | `[]` |
| `embedProvider` | String |  |  | `youtube`, `vimeo`, `spotify`, `soundcloud`, `` | `""` |
| `embedId` | String |  |  |  | `""` |
| `transcript` | String |  |  |  | `""` |
| `genre` | Mixed[] |  |  |  |  |
| `tags` | Mixed[] |  |  |  |  |
| `releaseDate` | Date |  |  |  | `null` |
| `viewCount` | Number |  |  |  | `0` |
| `popularityScore` | Number |  |  |  | `0` |
| `ratingSum` | Number |  |  |  | `0` |
| `ratingCount` | Number |  |  |  | `0` |
| `isFeatured` | Boolean |  |  |  | `false` |
| `status` | String |  |  | `draft`, `published` | `"published"` |
| `authorId` | ObjectId |  |  | → User | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ slug: 1 }` — {"unique":true}
- `{ category: 1 }`
- `{ type: 1 }`
- `{ releaseDate: 1 }`
- `{ popularityScore: 1 }`
- `{ isFeatured: 1 }`
- `{ status: 1 }`
- `{ title: text, summary: text, tags: text }`

## `events`

Mongoose model: **Event**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `title` | String | yes |  |  |  |
| `slug` | String | yes | yes |  |  |
| `category` | String | yes |  | `anime`, `gaming`, `movies`, `tv-shows`, `k-pop`, `comics`, `manga`, `cosplay` |  |
| `type` | String |  |  | `convention`, `meetup`, `screening`, `premiere`, `concert` | `"convention"` |
| `description` | String |  |  |  | `""` |
| `venue` | String |  |  |  | `""` |
| `city` | String | yes |  |  |  |
| `country` | String |  |  |  | `""` |
| `location.type` | String |  |  | `Point` | `"Point"` |
| `location.coordinates` | Mixed[] |  |  |  | `[0,0]` |
| `startsAt` | Date | yes |  |  |  |
| `endsAt` | Date |  |  |  | `null` |
| `ticketUrl` | String |  |  |  | `""` |
| `imageUrl` | String |  |  |  | `""` |
| `isHighlight` | Boolean |  |  |  | `false` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ slug: 1 }` — {"unique":true}
- `{ category: 1 }`
- `{ type: 1 }`
- `{ city: 1 }`
- `{ startsAt: 1 }`
- `{ isHighlight: 1 }`
- `{ location: 2dsphere }`

## `fansubmissions`

Mongoose model: **FanSubmission**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId | yes |  | → User |  |
| `title` | String | yes |  |  |  |
| `category` | String | yes |  | `anime`, `gaming`, `movies`, `tv-shows`, `k-pop`, `comics`, `manga`, `cosplay` |  |
| `body` | String | yes |  |  |  |
| `format` | String | yes |  | `article`, `gallery`, `audio`, `video`, `embed` | `"article"` |
| `media` | Mixed[] |  |  |  | `[]` |
| `embedProvider` | String |  |  | `youtube`, `vimeo`, `spotify`, `soundcloud`, `` | `""` |
| `embedId` | String |  |  |  | `""` |
| `transcript` | String |  |  |  | `""` |
| `ownWorkDeclared` | Boolean |  |  |  | `false` |
| `mediaUrl` | String |  |  |  | `""` |
| `mediaPublicId` | String |  |  |  | `""` |
| `status` | String |  |  | `pending`, `approved`, `rejected` | `"pending"` |
| `reviewedBy` | ObjectId |  |  | → User | `null` |
| `reviewedAt` | Date |  |  |  | `null` |
| `reviewNote` | String |  |  |  | `""` |
| `publishedContentId` | ObjectId |  |  | → Content | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ category: 1 }`
- `{ format: 1 }`
- `{ status: 1 }`

## `faqentries`

Mongoose model: **FaqEntry**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `question` | String | yes |  |  |  |
| `answer` | String | yes |  |  |  |
| `tags` | Mixed[] |  |  |  |  |
| `category` | String |  |  |  | `""` |
| `isPublished` | Boolean |  |  |  | `true` |
| `useCount` | Number |  |  |  | `0` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ isPublished: 1 }`
- `{ question: text, answer: text, tags: text }`

## `feedbacks`

Mongoose model: **Feedback**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId |  |  | → User | `null` |
| `name` | String |  |  |  | `""` |
| `email` | String |  |  |  | `""` |
| `type` | String | yes |  | `bug`, `suggestion`, `query` |  |
| `subject` | String |  |  |  | `""` |
| `message` | String | yes |  |  |  |
| `status` | String |  |  | `open`, `in-review`, `resolved` | `"open"` |
| `adminNote` | String |  |  |  | `""` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ type: 1 }`
- `{ status: 1 }`

## `merchandiseitems`

Mongoose model: **MerchandiseItem**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `name` | String | yes |  |  |  |
| `slug` | String | yes | yes |  |  |
| `category` | String | yes |  | `anime`, `gaming`, `movies`, `tv-shows`, `k-pop`, `comics`, `manga`, `cosplay` |  |
| `description` | String |  |  |  | `""` |
| `imageUrl` | String |  |  |  | `""` |
| `imagePublicId` | String |  |  |  | `""` |
| `gallery` | Mixed[] |  |  |  |  |
| `tag` | String |  |  | `Limited Edition`, `Pre-Order`, `Collectible`, `Exclusive`, `Restock` | `"Collectible"` |
| `isUpcoming` | Boolean |  |  |  | `false` |
| `releaseDate` | Date |  |  |  | `null` |
| `viewCount` | Number |  |  |  | `0` |
| `popularityScore` | Number |  |  |  | `0` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ slug: 1 }` — {"unique":true}
- `{ category: 1 }`
- `{ tag: 1 }`
- `{ isUpcoming: 1 }`
- `{ popularityScore: 1 }`
- `{ name: text, description: text }`

## `ratebuckets`

Mongoose model: **RateBucket**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `_id` | String | yes |  |  |  |
| `count` | Number | yes |  |  | `0` |
| `resetAt` | Date | yes |  |  |  |

**Indexes**

- `{ resetAt: 1 }` — {"expireAfterSeconds":0}

## `ratings`

Mongoose model: **Rating**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId | yes |  | → User |  |
| `contentId` | ObjectId | yes |  | → Content |  |
| `stars` | Number | yes |  |  |  |
| `thumb` | String |  |  | `up`, `down`, `null` | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ contentId: 1 }`
- `{ userId: 1, contentId: 1 }` — {"unique":true}

## `tokens`

Mongoose model: **Token**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `userId` | ObjectId | yes |  | → User |  |
| `tokenHash` | String | yes |  |  |  |
| `purpose` | String | yes |  | `email-verification`, `password-reset` |  |
| `expiresAt` | Date | yes |  |  |  |
| `usedAt` | Date |  |  |  | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ userId: 1 }`
- `{ tokenHash: 1 }`
- `{ expiresAt: 1 }` — {"expireAfterSeconds":0}

## `users`

Mongoose model: **User**

| Field | Type | Required | Unique | Enum / Ref | Default |
| --- | --- | :-: | :-: | --- | --- |
| `name` | String | yes |  |  |  |
| `email` | String | yes | yes |  |  |
| `passwordHash` | String | yes |  |  |  |
| `role` | String |  |  | `visitor`, `user`, `admin` | `"user"` |
| `avatarUrl` | String |  |  |  | `""` |
| `avatarPublicId` | String |  |  |  | `""` |
| `bio` | String |  |  |  | `""` |
| `favoriteCategories` | Mixed[] |  |  |  |  |
| `preferences.theme` | String |  |  | `light`, `dark`, `system` | `"system"` |
| `preferences.fontScale` | Number |  |  |  | `100` |
| `preferences.reducedMotion` | Boolean |  |  |  | `false` |
| `emailVerifiedAt` | Date |  |  |  | `null` |
| `lastLoginAt` | Date |  |  |  | `null` |
| `_id` | ObjectId |  |  |  |  |
| `createdAt` | Date |  |  |  |  |
| `updatedAt` | Date |  |  |  |  |

**Indexes**

- `{ email: 1 }` — {"unique":true}
- `{ role: 1 }`

## Relationships

- **User → Category** — many-to-many, denormalised as `user.favoriteCategories[]`.
- **Category → Content / CharacterProfile / MerchandiseItem / Event** — one-to-many via the `category` enum field.
- **User → Bookmark / Rating / Feedback / FanSubmission / ChatbotQuery / ActivityLog** — one-to-many.
- **Content → Rating** — one-to-many, aggregated onto `content.ratingSum` / `ratingCount`.
- **Bookmark → any of Content / CharacterProfile / MerchandiseItem / Event** — polymorphic,
  addressed by the `(targetType, targetId)` pair rather than a typed foreign key.
- **FanSubmission → Content** — set on approval via `publishedContentId`.
