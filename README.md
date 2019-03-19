# ra-data-leancloud

A LeanCloud data provider for [react-admin](https://github.com/marmelab/react-admin).

## Features

- 支持内嵌查询

## Installation

```bash
yarn add ra-data-leancloud

# or

npm i ra-data-leancloud --save
```

## Usage

```js
import dataProvider from "ra-data-leancloud"
import AV from "leancloud-storage"

AV.init({
  appId: "appId",
  appKey: "appKey"
})
dataProvider.init({ AV })

export default () => <Admin dataProvider={dataProvider} />
```

内嵌查询：

```js
// SomeList.js

<List filter={{ "todo.folder": targetFolder }} />
```

> Tips:

- 内嵌查询有一定限制，详情查看 [LeanCloud 官方说明](https://leancloud.cn/docs/leanstorage_guide-js.html#hash645521220)
- 内嵌查询要求字段名称和 class 的名称一致，只是首字母变为小写。如 `todo` 字段指向 `Todo` class 中的数据。
- 内嵌查询可以有多个层级，如 `a.b.c.d.e`
