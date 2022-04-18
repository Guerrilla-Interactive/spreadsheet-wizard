// React is installed in the studio and should be treated as a peer dependency
import React, { useEffect, useState } from "react";
import sanityClient from "part:@sanity/base/client";
import { screenTypes } from "./constants.js";
import Export from "./Export";
import Import from "./Import.js";
import Layout from "./Layout.js";
import {
  ThemeProvider,
  Heading,
  Stack,
  Inline,
  Button,
  Card,
  align,
  studioTheme,
} from "@sanity/ui";
import { FileArrowDown, Share } from "phosphor-react";
import { DocsDataProvider } from "./Context.js";

export const client = sanityClient.withConfig({ apiVersion: "2021-06-07" });

const Screen = () => {
  const screens = [
    { component: <Export />, type: screenTypes.EXPORT },
    { component: <Begin />, type: screenTypes.BEGIN },
    { component: <Import />, type: screenTypes.IMPORT },
  ];

  const [currentScreen, setCurrentScreen] = useState(screens[0]);

  function handleScreenChange(screenType) {
    setCurrentScreen(screens.filter((item) => item.type === screenType)[0]);
  }

  function renderSwitch(currentScreen) {
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
  }

  return (
    <>
      <LeftPanel
        handleScreenChange={handleScreenChange}
        currentScreen={currentScreen.type}
      >
        {renderSwitch(currentScreen)}
      </LeftPanel>
      <SpreadsheetView handleScreenChange={handleScreenChange}>
        {renderSwitch(currentScreen)}
      </SpreadsheetView>
    </>
  );
};

const Begin = ({ handleScreenChange }) => {
  const handleExport = () => handleScreenChange(screenTypes.EXPORT);
  const handleImport = () => handleScreenChange(screenTypes.IMPORT);
  return (
    <>
      <Card
        style={{
          overflowY: "scroll",
          width: "100%",
        }}
        display="grid"
        padding={4}
      >
        <h1>Hello</h1>
      </Card>
    </>
  );
};

const Navigation = ({ handleScreenChange, currentScreen }) => {
  const handleExport = () => handleScreenChange(screenTypes.EXPORT);
  const handleImport = () => handleScreenChange(screenTypes.IMPORT);

  return (
    <>
      <Stack style={{ marginBottom: "2rem" }} space={3}>
        <Inline
          style={{
            display: "grid",
            gridAutoFlow: "column",
          }}
          space={[3, 3, 4]}
        >
          {currentScreen === screenTypes.IMPORT ? (
            <Button
              icon={FileArrowDown}
              onClick={handleImport}
              fontSize={2}
              padding={4}
              selected
              style={{
                fontWeight: "100",
                width: "100%",
              }}
              text="Import TSV"
              mode="bleed"
            />
          ) : (
            <Button
              icon={FileArrowDown}
              onClick={handleImport}
              fontSize={2}
              padding={4}
              style={{
                fontWeight: "100",
                width: "100%",
              }}
              text="Import TSV"
              mode="ghost"
            />
          )}

          {currentScreen === screenTypes.EXPORT ? (
            <Button
              icon={Share}
              mode="bleed"
              selected
              style={{
                fontWeight: "100",
                width: "100%",
              }}
              padding={4}
              onClick={handleExport}
              text="Export TSV"
            />
          ) : (
            <Button
              icon={Share}
              mode="ghost"
              style={{
                fontWeight: "100",
                width: "100%",
              }}
              padding={4}
              onClick={handleExport}
              text="Export TSV"
            />
          )}
        </Inline>
      </Stack>
    </>
  );
};

const LeftPanel = ({ handleScreenChange, children, currentScreen }) => {
  return (
    <>
      <Card
        style={{
          alignContent: "start",
          overflowY: "scroll",
          width: "500px",
          background: "#fff",

          overflowX: "hidden",
          zIndex: "10",
          boxShadow: "-8px 1px 17px 7px #8888884f",
        }}
        display="grid"
        padding={4}
      >
        <Navigation
          handleScreenChange={handleScreenChange}
          currentScreen={currentScreen}
        />

        {children}
      </Card>
    </>
  );
};

const SpreadsheetView = ({ handleScreenChange, children }) => {
  return (
    <>
      <Card
        id="spreadsheet"
        style={{
          width: "100%",
          overflowX: "scroll",
          background:
            "linear-gradient(to right, rgb(251 251 251 / 54%), rgb(226, 226, 226))",
        }}
        display="grid"
        padding={4}
      ></Card>
    </>
  );
};

export default function ScreenWrapper() {
  return (
    <ThemeProvider theme={studioTheme}>
      <DocsDataProvider>
        <Layout>
          <Screen />
        </Layout>
      </DocsDataProvider>
    </ThemeProvider>
  );
}
