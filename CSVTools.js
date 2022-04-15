// React is installed in the studio and should be treated as a peer dependency
import React, { useEffect, useState } from "react";
import sanityClient from "part:@sanity/base/client";
import { screenTypes } from "./constants.js";
import Export from "./Export.js";
import Import from "./Import.js";
import Layout from "./Layout.js";
import { Heading, Stack, Inline, Button } from "@sanity/ui";
import { FileArrowDown, Share } from "phosphor-react";
import {DocsDataProvider} from './Context.js'

export const client = sanityClient.withConfig({ apiVersion: "2021-06-07" });

const Screen = () => {
  const screens = [
    { component: <Begin />, type: screenTypes.BEGIN },
    { component: <Import />, type: screenTypes.IMPORT },
    { component: <Export />, type: screenTypes.EXPORT },
  ];

  const [currentScreen, setCurrentScreen] = useState(screens[0]);
  function handleScreenChange(screenType) {
    setCurrentScreen(screens.filter((item) => item.type === screenType)[0]);
  }
  switch (currentScreen.type) {
    case screenTypes.BEGIN:
      return <Begin handleScreenChange={handleScreenChange} />;
      break;
    case screenTypes.IMPORT:
      return <Import handleScreenChange={handleScreenChange} />;
      break;
    case screenTypes.EXPORT:
      return <Export handleScreenChange={handleScreenChange} />;
      break;
  }
};

const Begin = ({ handleScreenChange }) => {
  const handleExport = () => handleScreenChange(screenTypes.EXPORT);
  const handleImport = () => handleScreenChange(screenTypes.IMPORT);
  return (
    <Layout>
      <Stack
        style={{ alignSelf: "center" }}
        align="center"
        margin="auto"
        space={3}
      >
        {/* <Heading
          as="h3"
          style={{ fontWeight: "2 00", marginBottom: "3rem" }}
          size={3}
        ></Heading> */}

        <Inline space={[3, 3, 4]}>
          <Button
            icon={FileArrowDown}
            onClick={handleImport}
            fontSize={2}
            padding={4}
            tone="caution"
            style={{ fontWeight: "100" }}
            text="Import CSV"
            mode="ghost"
          />
          <Button
            icon={Share}
            mode="ghost"
            tone="positive"
            padding={4}
            onClick={handleExport}
            text="Export CSV"
          />
        </Inline>
      </Stack>
    </Layout>
  );
};


export default function ScreenWrapper(){
    return(
        <DocsDataProvider>
            <Screen />
        </DocsDataProvider>
    )
}
