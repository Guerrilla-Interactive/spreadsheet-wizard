import React from "react";

import { Container, Card, Heading, Stack, Inline, Button } from "@sanity/ui";

export default function UI({ children }) {
  return (
    <Container
      style={{
        margin: "auto",
        height: "30rem",
        borderRadius: "2rem",
        overflow: "hidden",
        marginTop: "10rem",
      }}
      display="grid"
      width={3}
    >
      <Card
        style={{
          alignContent: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        display="grid"
        padding={4}
      >
        {children}
        <Stack align="center" margin="auto" space={3}>
          <Heading as="h3" style={{ marginBottom: "3rem" }} size={4}>
            What do you want?
          </Heading>

          <Inline space={[3, 3, 4]}>
            <Button text="Import CSV" />
            <Button text="Export CSV" />
          </Inline>
        </Stack>
      </Card>
    </Container>
  );
}
