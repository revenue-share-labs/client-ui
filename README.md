**Getting Started**

Clone repository:

`git clone https://gitlab.com/x.la/contracts/client-ui.git`

`cd client-ui`

Next, install the dependencies:

`npm install`

**Clone backend repositories:**

`git clone git@gitlab.com:x.la/contracts/authentication-service.git`

`git clone  git@gitlab.com:x.la/contracts/contract-service.git`

`git clone git@gitlab.com:x.la/contracts/user-service.git`

**Execute commands for each backend service**

`npx prisma generate`

`npm run start:dev`


**Starting the development server**

`npm run dev`  or `yarn dev`

**Building for production**

`npm run build`

Starting EsLint

`npm run lint`


The server should start at http://localhost:3000. 

