import React from "react";
import { Container, Card } from "@sanity/ui";

export default function Layout({ children, align }) {
  return (
    <Container
      style={{
        margin: "auto",
        minHeight: "30rem",
        borderRadius: "2rem",
        overflow: "hidden",
        marginTop: "3rem",
        marginBottom: "3rem",
      }}
      display="grid"
      width={1}
    >
      <Card
        style={{
          textAlign: "center",
          alignContent: align,
          overflowY: "scroll",
          width: "100%",
        }}
        display="grid"
        padding={4}
      >
        {children}
      </Card>
    </Container>
  );
}
