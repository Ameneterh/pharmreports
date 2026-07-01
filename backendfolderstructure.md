server/
│
├── config/
│ ├── db.js
│ ├── env.js
│ └── roles.js
│
├── modules/
│ ├── auth/
│ │ ├── auth.controller.js
│ │ ├── auth.routes.js
│ │ ├── auth.service.js
│ │ └── auth.middleware.js
│ │
│ ├── users/
│ │ ├── user.model.js
│ │ ├── user.controller.js
│ │ ├── user.routes.js
│ │ └── user.service.js
│ │
│ ├── academics/
│ │ ├── class.model.js
│ │ ├── subject.model.js
│ │ ├── session.model.js
│ │ ├── term.model.js
│ │ └── academic.routes.js
│ │
│ ├── results/
│ │ ├── result.model.js
│ │ ├── resultApproval.model.js
│ │ ├── result.controller.js
│ │ ├── result.routes.js
│ │ ├── result.service.js
│ │ └── pdf.service.js
│ │
│ ├── analytics/
│ │ ├── analytics.controller.js
│ │ ├── analytics.routes.js
│ │ └── analytics.service.js
│ │
│ ├── logs/
│ │ ├── activityLog.model.js
│ │ ├── log.middleware.js
│ │ └── log.service.js
│
├── middlewares/
│ ├── auth.js
│ ├── roleGuard.js
│ ├── errorHandler.js
│ └── validate.js
│
├── utils/
│ ├── jwt.js
│ ├── hash.js
│ ├── pdf.js
│ └── helpers.js
│
├── app.js
└── server.js

//user roles
student
teacher
parent
admin
headTeacher
formMaster
