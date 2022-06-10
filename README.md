<div align="center">
  <img src="./packages/view/public/pro_icon.svg" alt="">
  <p align="center">An Ambitious NginxUI for Stream.</p>
  <a href="https://github.com/ZingerLittleBee/x-forward/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://gitter.im/x-forward/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge" target="_blank"><img src="https://badges.gitter.im/x-forward/community.svg" alt="Join the chat at https://gitter.im/x-forward/community" /></a>
</div>

> Coming soon ⚡️
>
> -   New UI base [daisyui](https://github.com/saadeghi/daisyui)
> -   New JavaScript Framework build with `Vue3`、`Pinia`、`Vue-Router`、`Vite`
> -   100% component libary build by my hand (may be come component libary in future)

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

-   [Introduction](#introduction)
    -   [Features](#features)
-   [Table of Contents](#table-of-contents)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [~~Snapshot~~](#snapshot)
    -   [~~Module~~](#module)
    -   [~~Terminal~~](#terminal)
    -   [~~Stream~~](#stream)
    -   [~~Upstream~~](#upstream)
-   [Roadmap](#roadmap)
-   [How to Develop](#how-to-develop)

## Getting Started

### Prerequisites

-   [Docker](https://docs.docker.com/engine/install/) (latest version preferred)

    or

-   [Node.js](https://nodejs.org) (>= 12.10 required, >= 14.17 preferred)
-   [npm](https://www.npmjs.com) (>= 6.x) or [yarn](https://yarnpkg.com) (>= 1.22)
-   [Git](https://git-scm.com) (>= 2.0)

### Installation

TODO

## ~~Snapshot~~

### ~~Module~~

![module](./snapshot/module.png)

### ~~Terminal~~

![local terminal](./snapshot/terminal.png)

### ~~Stream~~

![stream-list](./snapshot/stream.png)
![stream-modify](./snapshot/modify-stream.png)

### ~~Upstream~~

![upstream](./snapshot/upstream.png)
![upstream-modify](./snapshot/modify-upstream.png)

## Roadmap

The following are the features I want to achieve or are under development:

-   [x] use pnpm workspace to manage multiple projects
-   [x] ~~build service use PKG for docker~~
-   [x] unit test
-   [x] support cluster
-   [x] batch operation, such as add, start, stop, restart, delete
-   [ ] config export and import
-   [ ] tcp delay on rule card
-   [ ] x-forward-cli, install uninstall update
-   [ ] client manage page
-   [ ] user system
-   [ ] control traffic
-   [ ] log dashboard
-   [ ] ssh for client
-   [ ] better UI

## How to Develop

1. Build dependencies
   `pnpm install`
2. Run project
   `pnpm start`
