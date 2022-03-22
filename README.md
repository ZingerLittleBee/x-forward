<div align="center">
  <img src="./packages/view/public/pro_icon.svg" alt="">
  <p align="center">An Ambitious NginxUI for Stream.</p>
  <a href="https://github.com/ZingerLittleBee/x-forward/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://gitter.im/x-forward/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge" target="_blank"><img src="https://badges.gitter.im/x-forward/community.svg" alt="Join the chat at https://gitter.im/x-forward/community" /></a>
</div>

## Introduction

### Features

-   Friendly UI
-   Easier Setup
-   Docker Support
-   Nginx Cluster Support
-   Rich Configuration Tips
-   Flexible Choice of Scenarios
-   Make Set the Stream Module More Easy
-   Local Web Terminal
-   Visual Log

## Table of Contents

- [Introduction](#introduction)
  - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Snapshot](#snapshot)
  - [模块管理](#模块管理)
  - [本地终端](#本地终端)
  - [Stream 模块](#stream-模块)
  - [Upstream 模块](#upstream-模块)
- [Roadmap](#roadmap)
- [How to Develop](#how-to-develop)
- [Thanks](#thanks)
- [Change Logs](#change-logs)

## Getting Started

### Prerequisites

-   [Docker](https://docs.docker.com/engine/install/) (latest version preferred)

    or

-   [Node.js](https://nodejs.org) (>= 12.10 required, >= 14.17 preferred)
-   [npm](https://www.npmjs.com) (>= 6.x) or [yarn](https://yarnpkg.com) (>= 1.22)
-   [Git](https://git-scm.com) (>= 2.0)

### Installation

TODO

## Snapshot

### 模块管理

![module](./snapshot/module.png)

### 本地终端

![local terminal](./snapshot/terminal.png)

### Stream 模块

![stream-list](./snapshot/stream.png)
![stream-modify](./snapshot/modify-stream.png)

### Upstream 模块

![upstream](./snapshot/upstream.png)
![upstream-modify](./snapshot/modify-upstream.png)

## Roadmap

The following are the features I want to achieve or are under development:

- [x] use pnpm workspace to manage multiple projects
- [x] build service use PKG for docker
- [x] unit test
- [x] support cluster
- [ ] x-forward-cli, install uninstall update
- [ ] client manage page
- [ ] user system
- [ ] control traffic
- [ ] log dashboard
- [ ] ssh for client
- [ ] better UI


## How to Develop

1. Build dependencies
   `pnpm install`
2. Run project
   `pnpm start`

## Thanks

-   React
-   Ant Design
-   Nginx
-   Node
-   NestJS
-   SocketIO
-   Xterm
-   Node-pty
-   TailWindCSS

## Change Logs
