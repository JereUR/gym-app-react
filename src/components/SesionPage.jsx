import React from "react";
import styled from "styled-components";

import frontPage from "../assets/gym-front-page.jpg";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export const SesionPage = () => {
  return (
    <Container>
      <LogoSection>
        <LogoContainer>
          <LogoImg src={frontPage} />
        </LogoContainer>
        <TextContainer>
          <TextContent>Vive energía, vive Milenium!!</TextContent>
        </TextContainer>
      </LogoSection>
      <FormData>
        <SignIn />
        <Hr />
        <SignUp />
      </FormData>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5vw;
  margin-left: 2vw;

  @media screen and (max-width: 480px) {
    display: block;
    height: auto;
  }

  @media screen and (max-width: 1380px) {
    margin-top: 15vw;
    margin-left: 5vw;
  }
`;

const FormData = styled.div`
  flex: 1;
  margin: 7vw 30vw auto 1vw;

  @media screen and (max-width: 480px) {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 350px;
    height: 500px;
    text-align: center;
    margin: 35% 2vw;
    height: 70vh;
  }

  @media screen and (max-width: 400px) {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 350px;
    height: 500px;
    text-align: center;
    margin: 30% -1vw;
  }
`;

const Hr = styled.hr`
  @media screen and (max-width: 480px) {
    width: 80%;
    margin-top: 3vh;
    margin-bottom: 3vh;
  }

  @media screen and (max-width: 480px) {
    margin-top: 1vh;
    margin-bottom: 1vh;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LogoImg = styled.img`
  width: 20vw;
  height: auto;
  border-radius: 1.5rem;

  @media screen and (max-width: 1380px) {
    width: 25vw;
  }
`;

const LogoSection = styled.div`
  flex: 1;
  margin: 5vw 1vw auto 20vw;
  width: 100%;
  height: 50%;
  padding: 4vw;
  border-radius: 10px;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const TextContainer = styled.div`
  width: 20vw;
`;

const TextContent = styled.p`
  display: block;
  text-align: center;
  font-size: 20px;
  font-style: oblique;

  @media screen and (max-width: 1380px) {
    margin-left: 5vw;
  }
`;
