const permissions = {
  architect: [
    "reports:update",
    "reports:delete",
    "reports:summary",

    "pharmcare:create",
    "pharmcare:view",
    "pharmcare:update",
  ],
  observer: ["pharmcare:view"],
  pharmacist: [
    "reports:create",
    "reports:view",
    "reports:update",
    "reports:delete",

    "comments:create",

    "patient:create",
    "patient:view",
    "patient:update",
  ],
  pharmtech: [
    "reports:create",
    "reports:view",
    "reports:update",
    "reports:delete",

    "comments:create",
  ],
  staff: [
    "reports:create",
    "reports:view",
    "reports:update",
    "reports:delete",
    "reports:summary",
  ],
  admin: [
    "reports:create",
    "reports:view",
    "reports:update",
    "reports:delete",
    "reports:summary",
  ],
};

export default permissions;
