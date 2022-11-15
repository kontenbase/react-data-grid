# Kontenbase Data Grid

[![npm-badge]][npm-url]
[![type-badge]][npm-url]
[![size-badge]][size-url]

[npm-badge]: https://img.shields.io/npm/v/@kontenbase/data-grid
[npm-url]: https://www.npmjs.com/package/@kontenbase/data-grid
[size-badge]: https://img.shields.io/bundlephobia/minzip/@kontenbase/data-grid
[size-url]: https://bundlephobia.com/result?p=@kontenbase/data-grid
[type-badge]: https://img.shields.io/npm/types/@kontenbase/data-grid

## Install

```sh
npm install @kontenbase/data-grid
```

## Usage

```jsx
import DataGrid from '@kontenbase/data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];

function App() {
  return <DataGrid columns={columns} rows={rows} />;
}
```
