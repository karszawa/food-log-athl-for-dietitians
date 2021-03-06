# FoodLog Athl for Dietitians

## Technology

* ReactNative / Expo
* TypeScript
* ESLint / Prettier
* Redux / Redux Saga / Redux Starter Kit
* React Navigation
* styled-components
* NativeBase / React Native Elements

## Architecture

```
src
├── App.tsx: root component
├── components: Common components
├── constants: constants
├── hooks: hooks
├── lib: libraries including api client
├── main.ts: entry point
├── navigation: navigation
├── screens: screens
├── store
│   ├── auth: auth store
│   │   ├── actions.ts
│   │   ├── reducer.ts
│   │   └── saga.ts
│   ├── index.ts: create store
│   ├── reducer.ts: reducer root
│   └── saga.ts: saga root
└── styles: style files
```

## TODO

- [ ] 体組成値のグラフ
- [ ] 未読バッチ
- [ ] 既読処理
- [ ] CI/CD https://github.com/expo/expo-github-action
