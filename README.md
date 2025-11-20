# Messaging App

A simple group chat application featuring secure authentication and management of groups and members.

Live app: **[messaging.bonefteofil.ro](https://messaging.bonefteofil.ro)**

![Inbox page](/screenshots/Inbox.png)


## Tech Stack

- **Frontend:**
[![React](https://img.shields.io/badge/React-%2320232a?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-%23646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/Typescript-%23007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-%2338B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Mantine](https://img.shields.io/badge/Mantine-ffffff?style=flat&logo=Mantine&logoColor=339af0)](https://mantine.dev)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-%23538DD7.svg?style=flat&logo=fontawesome&logoColor=white)](https://fontawesome.com/icons)

- **Backend:**
[![C#](https://img.shields.io/badge/C%23-%23239120?style=flat&logoColor=white)](https://dotnet.microsoft.com/en-us/languages/csharp)
[![.Net](https://img.shields.io/badge/.NET-5C2D91?style=flat&logoColor=white)](https://dotnet.microsoft.com/en-us/apps/aspnet/apis)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)](https://www.jwt.io)

- **Database:**
[![Postgres](https://img.shields.io/badge/Postgres-%23316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)

- **Deployment:**
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=Cloudflare&logoColor=white)](https://cloudflare.com)
[![Github Pages](https://img.shields.io/badge/Github%20pages-121013?style=flat&logo=github&logoColor=white)](https://docs.github.com/en/pages)
[![Azure](https://img.shields.io/badge/Azure-%230072C6?style=flat&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com)


## Features

- **Account Management** - Register and login from multiple devices
- **Groups** - Create public or private groups and manage members
- **Messaging** - Send, edit, and delete messages on groups


## API Endpoints

- Authentication
```
POST    /api/auth/login                     User login
POST    /api/auth/register                  Create new account
POST    /api/auth/logout                    User logout
POST    /api/auth/refresh                   Refresh access token
POST    /api/auth/revoke/{id}               Revokes a specific session
```
- Users
```
GET     /api/users                          Get all users
GET     /api/users/account                  Get account data
DELETE  /api/users/account                  Delete account
```
- Groups
```
GET     /api/groups                         Get user's groups
POST    /api/groups                         Create new group
GET     /api/groups/{id}                    Get group details
PUT     /api/groups/{id}                    Update group
PATCH   /api/groups/{id}/transfer           Transfer ownership
PATCH   /api/groups/{id}/leave              Leave group
DELETE  /api/groups/{id}                    Delete group
```
- Messages
```
GET     /api/groups/{groupId}/messages      Get group's messages
POST    /api/groups/{groupId}/messages      Send message on a group
PUT     /api/groups/{groupId}/messages/{id} Edit message
DELETE  /api/groups/{groupId}/messages/{id} Delete message
```


## License

MIT License - feel free to use this project - [LICENSE.md](LICENSE.md).