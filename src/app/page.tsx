'use client'

import { Provider } from "react-redux";
import Map from "./map/page";
import { store } from "../store/store";

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <Map />
      </Provider>
    </>
  );
}
