<pre align="right">
توضیحات کلی:

ConfigModule:

برای مدیریت تنظیمات محیط اجرای برنامه مانند اطلاعات پایگاه داده (DB_HOST، DB_PORT و ...).
TypeOrmModule:

استفاده از این ماژول برای تنظیمات پایگاه داده PostgreSQL و ایجاد اتصال به آن.
استفاده از این ماژول برای تعریف موجودیت‌ها و مدل داده‌ها که در پایگاه داده ذخیره می‌شوند.
synchronize: true در محیط توسعه برای همگام‌سازی خودکار با پایگاه داده استفاده می‌شود.
AttendanceModule و ماژول‌های مرتبط:

این ماژول‌ها به عنوان بخش‌های مختلف برنامه تعریف شده‌اند و از موجودیت‌ها و سرویس‌های مرتبط استفاده می‌کنند.
ProjectModule و ماژول‌های مرتبط:

ماژول‌های مرتبط با پروژه و کارهای مرتبط با آن تعریف شده‌اند.
UserModule و AuthModule:

ماژول مربوط به کاربران و ماژول مربوط به احراز هویت.
HelperModule:

این ماژول برای قرار دادن سرویس‌های کمکی و توابع کمکی استفاده می‌شود.
ShiftModule:

ماژول مربوط به نظام شیفت‌ها.
تعدادی از موجودیت‌ها:

در اینجا موجودیت‌ها مانند Attendance، Project، Shift و ... تعریف شده‌اند که مدل داده‌های برنامه را نشان می‌دهند.
</pre>

</br>
<a align="center" href="https://uupload.ir/view/hrm-api-docs_ano3.mp4/" target="_blank">دانلود ویدیو معرفی پروژه</a>
</br>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# microservice-rollcall
