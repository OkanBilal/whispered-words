import React from "react";
import { Row } from "./ui/row";
import { H2, P } from "./ui/text";

type FeatureListProps = {
  icon: string;
  title: string;
  description: string;
};

export const FeatureList = (props: FeatureListProps) => {
  return (
    <div className=" mb-8">
      <Row>
        <H2 className="text-3xl mr-3 text-gradient">{props.icon}</H2>
        <div>
          <P className="text-gray-300 text-lg mb-1 ">{props.title}</P>
          <P className="text-white text-sm ">{props.description}</P>
        </div>
      </Row>
    </div>
  );
};
