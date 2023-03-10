import React, { useState } from "react";
import styled from "styled-components";
import { Toaster, toast } from "react-hot-toast";

import { user } from "../App";
import { Colors } from "../constants/Colors";
import { FontFamily } from "../constants/Fonts";

const initialData = {
  newPassword: "",
  confirmPassword: "",
};

const {
  colorText,
  primaryBlue,
  secondaryBlue,
  errorInput,
  primaryRed,
  secondaryRed,
} = Colors;

const handleBack = () => {
  window.location.href = `/usuario/${user.username}`;
};

export const ResetPassword = () => {
  const [dataRecovery, setDataRecovery] = useState(initialData);
  const [errors, setErrors] = useState({});

  const onValidate = () => {
    let errorsForm = {};

    if (dataRecovery.newPassword.length < 8) {
      errorsForm.newPassword = `La contraseña debe tener más de 8 caracteres.`;
    }

    if (dataRecovery.newPassword !== dataRecovery.confirmPassword) {
      errorsForm.newPassword = `La contraseña y su confirmación no coinciden.`;
      errorsForm.confirmPassword = `La contraseña y su confirmación no coinciden.`;
    }

    return errorsForm;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataRecovery({ ...dataRecovery, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = onValidate();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      /* try {
          const resp = await fetch("/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataRecovery }),
          });
          console.log(resp);

           toast.success("Contraseña cambiada con exito.", {
            position: "top-right",
            duration: 6000,
            style: {
              background: "rgba(215, 250, 215)",
              fontSize: "1rem",
              fontWeight: "500",
            },
          });
        } catch (error) {
          toast.error("error.", {
            position: "top-right",
            duration: 6000,
            style: {
              background: "rgba(250, 215, 215)",
              fontSize: "1rem",
              fontWeight: "500",
            },
          });
        } */

      setDataRecovery(initialData);

      setTimeout(() => {
        window.location.replace(`/usuario/:${user.username}`);
      }, 2000);
    }
  };

  return (
    <FormContainer>
      <TitleReset>Recuperar Contraseña</TitleReset>
      <Form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Nueva contraseña"
          name="newPassword"
          value={dataRecovery.newPassword}
          onChange={handleChange}
        />
        {errors.newPassword && <ErrorInput>{errors.newPassword}</ErrorInput>}
        <Input
          type="password"
          placeholder="Confirma nueva contraseña"
          name="confirmPassword"
          value={dataRecovery.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <ErrorInput>{errors.confirmPassword}</ErrorInput>
        )}
        <ButtonSend type="submit">Enviar</ButtonSend>
        <ButtonBack type="button" onClick={handleBack}>
          Volver
        </ButtonBack>
      </Form>
      <Toaster />
    </FormContainer>
  );
};

const ButtonSend = styled.button`
  font-family: ${FontFamily};
  background-color: ${primaryBlue};
  color: ${colorText};
  padding: 10px;
  margin: 10px;
  margin-top: 2rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.7s ease-in-out;

  @media screen and (max-width: 480px) {
    margin-top: 0;
    font-size: 1.3rem;
  }

  :hover {
    cursor: pointer;
    background-color: ${secondaryBlue};
  }
`;

const ButtonBack = styled(ButtonSend)`
  background-color: ${primaryRed};
  margin-top: 1.5rem;

  :hover {
    background-color: ${secondaryRed};
  }
`;

const ErrorInput = styled.div`
  font-size: 12px;
  color: ${errorInput};
  margin-top: 5px;
  text-align: left;
  margin-left: 0.5rem;
`;

const Form = styled.form`
  display: grid;
`;

const FormContainer = styled.div`
  border-radius: 5px;
  padding: 12vw 15vw 12vw 15vw;

  @media screen and (max-width: 480px) {
    padding: 20vw 8vw 20vw 8vw;
  }
`;

const Input = styled.input`
  font-family: ${FontFamily};
  background-color: #fff;
  border: 2px solid ${primaryBlue};
  border-radius: 4px;
  color: #000;
  font-size: 1.2rem;
  padding: 10px;
  margin-bottom: 1rem;

  @media screen and (max-width: 480px) {
    margin-bottom: 8vw;
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(65, 157, 199, 0.5);
  }
`;

const TitleReset = styled.h1`
  font-family: ${FontFamily};
  text-align: left;
  color: ${primaryBlue};

  @media screen and (max-width: 480px) {
    margin-bottom: 10vw;
  }
`;
