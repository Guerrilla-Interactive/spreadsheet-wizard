import React from "react";
import { Container, Card, Grid, Flex, Stack, Inline, Button } from "@sanity/ui";

export default function Layout({ children, align }) {
  return (
    <Flex
      style={{
        justifyContent: "start",
        height: "100%",
        gridAutoFlow: "column",
      }}
      gap={0}
    >
      {children}
    </Flex>
  );
}
