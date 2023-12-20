/* eslint-disable react/no-unescaped-entities */

import { Github } from "./icons";
import { Row } from "./ui/row";

const Footer = () => {
  return (
    <Row className="justify-between items-center max-w-6xl mx-auto pt-8 md:pb-16 pb-8 px-4">
      <div></div>
      <Row className="items-center">
        <Github color="#fff" />
      </Row>
    </Row>
  );
};

export default Footer;
