/* eslint-disable react/no-unescaped-entities */

import { Github } from "./icons";
import { Row } from "./ui/row";
import { Span } from "./ui/text";
import { Column } from "./ui/column";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col justify-between items-center py-6 px-6 sm:py-8 sm:px-24">
      <Row className="items-center">
        <Span className="text-sm font-medium text-gray-400 mb-4 md:mb-0">
          © 2024 Whispered Words - All rights reserved.
        </Span>
      </Row>

      <a className="group" href="https://github.com/okanbilal">
        <Row className="items-center">
          <Span className="group-hover:text-white text-gray-300 text-sm mr-2"> Follow for updates</Span>
          <Github color="#fff" />
        </Row>
      </a>
    </div>
  );
};

export default Footer;
