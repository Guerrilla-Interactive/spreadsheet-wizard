import React from "react";
import { Container, Card, Grid, Flex, Stack, Inline, Button } from "@sanity/ui";

export default function Layout({ children, align }) {
  return (
    <Flex
      style={{ justifyContent: "start", gridAutoFlow: "column" }}
      gap={[1, 1, 2, 3]}
    >
      {children}
    </Flex>
  );
}
