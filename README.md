# ra-data-leancloud

[![npm version](https://img.shields.io/npm/v/ra-data-leancloud.svg?style=flat)](https://www.npmjs.com/package/ra-data-leancloud)
[![GitHub license](https://img.shields.io/github/license/cheese-git/ra-data-leancloud.svg)](https://github.com/cheese-git/ra-data-leancloud/blob/master/LICENSE)

A [LeanCloud](https://leancloud.cn) data provider for [react-admin](https://github.com/marmelab/react-admin).

## Features

- 支持 JavaScript 和 TypeScript
- 支持内嵌查询

## Installation

```bash
yarn add ra-data-leancloud

# or

npm i ra-data-leancloud --save
```

## Usage

```tsx
// App.jsx or App.tsx

import dataProvider from "ra-data-leancloud"
import AV from "leancloud-storage"

// init leancloud storage before use the data provider
AV.init({
  appId: "appId",
  appKey: "appKey"
})

dataProvider.init({ AV })

export default () => (
  <Admin dataProvider={dataProvider}>
    {/* name should be the class name in your leancloud storage service */}
    <Resource name="Todo" />
  </Admin>
)
```

内嵌查询：

```tsx
// SomeList.jsx or SomeList.tsx

<List filter={{ "todo.folder": targetFolder }} />
```

> Tips:
>
> - 内嵌查询有一定限制，详情查看 [LeanCloud 官方说明](https://leancloud.cn/docs/leanstorage_guide-js.html#hash645521220)
> - 内嵌查询可以有多个层级，如 `a.b.c.d.e`

## Limitation

若要完整使用此 data provider 的功能，需要遵循以下命名习惯：

- class 的名称为大驼峰式，如：`TodoFolder`
- `Pointer` 类型的字段名称为小驼峰式，且拼写与指向的 class 名称相同，例如：字段 `todoFolder` -> class `TodoFolder`

如果不遵循此习惯，那么当请求中有对 `Pointer` 类型字段的操作时，可能会抛出错误。

## Change Log

Please refer to [CHANGELOG.md](https://github.com/cheese-git/ra-data-leancloud/blob/master/CHANGELOG.md).

## License

MIT.
