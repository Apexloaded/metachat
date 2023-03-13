import Head from "next/head";
import React from "react";
type Props = {
  title: string;
};
const HeadTag = ({ title }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/icon.png" />
    </Head>
  );
};

export default HeadTag;
