'use client'

import { store } from "../../store/store";
import Layout from "./map/layout";
import Map from "./map/page";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <Layout>
        <Map />
      </Layout>
    </Provider>
  );
}
