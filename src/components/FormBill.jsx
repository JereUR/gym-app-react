import React, { useState } from "react";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  usePDF,
  BlobProvider,
} from "@react-pdf/renderer";

import logo from "../assets/logo.png";
import seal from "../assets/payment-seal.png";
import { Colors } from "../constants/Colors";
import { FontFamily } from "../constants/Fonts";

const { errorInput, primaryRed, primaryBlue, secondaryRed, secondaryBlue } =
  Colors;

export const FormBill = ({ db }) => {
  const [forData, setForData] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [mount, setMount] = useState(null);
  const [monthNext, setMonthNext] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [errors, setErrors] = useState({});
  const [viewPdf, setViewPdf] = useState(false);

  const MyDoc = (
    <Document>
      <Page
        size="A5"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            textAlign: "center",
            backgroundColor: "white",
            padding: 1,
          }}
        >
          <Image
            src={logo}
            alt="random image"
            style={{ maxWidth: "150px", maxHeight: "auto", top: "-10vw" }}
          />
          <Text
            style={{
              color: `${primaryBlue}`,
              fontSize: "36px",
              alignItems: "center",
              margin: "auto auto 10vw auto",
              fontWeight: "bold",
            }}
          >
            Pago {month} - {year}
          </Text>

          <Text style={{ textAlign: "justify", marginTop: "30px" }}>
            Destinatario: {name} {surname}.
          </Text>
          <Text style={{ textAlign: "justify", marginTop: "30px" }}>
            Email: {forData}.
          </Text>
          <Text style={{ textAlign: "justify", marginTop: "30px" }}>
            Fecha: {day} de {month} del {year}.
          </Text>
          <Text style={{ textAlign: "justify", marginTop: "30px" }}>
            Monto: ${mount}.
          </Text>
          <Image
            src={seal}
            alt="random image"
            style={{
              maxWidth: "120px",
              maxHeight: "120px",
              marginLeft: "60%",
            }}
          />
        </View>
      </Page>
    </Document>
  );

  const [instance, updateInstance] = usePDF({ document: MyDoc });

  const generatePdfBlob = () => {
    const pdfBlob = new Blob([MyDoc], { type: "application/pdf" });
    pdfBlob.fileName = `${name} ${surname} - ${month} - ${year}`;
    return pdfBlob;
  };

  const getYearNow = () => {
    return new Date().getFullYear();
  };

  function getDayNow() {
    const now = new Date();
    return now.getDate();
  }

  function getMonthNow() {
    const now = new Date();
    return now.getMonth();
  }

  const getMonth = (month) => {
    return db.months.find((m) => m.month === month).value;
  };

  const clearForm = () => {
    document.getElementById("day").value = null;
    document.getElementById("month").value = null;
    document.getElementById("year").value = null;
    document.getElementById("mount").value = null;

    setForData(null);
    setDay(null);
    setMonth(null);
    setYear(null);
    setMount(null);
    setErrors({});
    setViewPdf(false);
  };

  const onValidate = () => {
    const errorsForm = {};
    const user = db.users.find((u) => u.email === forData);

    if (getYearNow() === year) {
      if (getMonthNow() < getMonth(month)) {
        errorsForm.form = `La fecha determinada todav??a no ha llegado (${day} de ${month} del ${year})`;
      }
      if (getMonthNow() === getMonth(month)) {
        if (getDayNow() < day) {
          errorsForm.form = `La fecha determinada todav??a no ha llegado (${day} de ${month} del ${year})`;
        }
      }
    }
    if (forData !== null) {
      if (
        user.payment.payments.some((p) => p.month === month && p.year === year)
      ) {
        errorsForm.form = `Ya se ha agregado un pago para el mes ${month} del a??o ${year} a ${forData}`;
      }
    }

    if (forData === null) {
      errorsForm.forData = "Debe especificar destinatario.";
    }

    if (day === null) {
      errorsForm.day = "Debe especificar d??a de pago realizado.";
    }

    if (month === null) {
      errorsForm.month = "Debe especificar mes de pago realizado.";
    }

    if (year === null) {
      errorsForm.year = "Debe especificar a??o de pago realizado.";
    }

    if (isNaN(mount)) {
      errorsForm.mount = "Debe ingresar un monto v??lido.";
    }

    if (mount <= 0) {
      errorsForm.mount = "El monto debe ser mayor 0.";
    }

    if (mount === null) {
      errorsForm.mount = "Debe especificar monto de pago realizado.";
    }

    return errorsForm;
  };

  const handleFor = (e) => {
    setForData(e.target.value);

    const user = db.users.find((u) => u.email === e.target.value);

    setName(user.username);
    setSurname(user.surname);
  };

  const handleChangeFor = () => {
    setForData(null);
  };

  const handleDay = (e) => {
    setDay(parseInt(e.target.value));
  };

  const handleMonth = (e) => {
    setMonth(e.target.value);

    if (e.target.value === "Diciembre") {
      setMonthNext(0);
    } else {
      const numberMonth = getMonth(e.target.value);
      setMonthNext(numberMonth + 1);
    }
  };

  const handleYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMount = (e) => {
    setMount(parseFloat(e.target.value.replace(",", ".")));
  };

  const handlePdf = () => {
    const err = onValidate();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      updateInstance({ document: MyDoc });
      setViewPdf(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = onValidate();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      let payment;
      const PDF = (
        <BlobProvider document={generatePdfBlob()}>{MyDoc}</BlobProvider>
      );

      if (monthNext === 0) {
        payment = {
          forData,
          day,
          month,
          year,
          dayNext: day,
          monthNext,
          yearNext: (parseInt(year) + 1).toString(),
          pdf: PDF.props.document,
        };
      } else {
        payment = {
          forData,
          day,
          month,
          year,
          dayNext: day,
          monthNext,
          yearNext: year,
          pdf: PDF.props.document,
        };
      }

      /* console.log(payment); */

      /* try {
          const resp = await fetch("/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payment }),
          });
          console.log(resp);

           toast.success("Pago enviado.", {
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
      clearForm();
    }
  };

  return (
    <FormAddBill onSubmit={handleSubmit}>
      <ForPartContainer>
        {!forData ? (
          <InputContainer>
            <Label>Para:</Label>
            <SelectFirst onChange={handleFor} id="for-data">
              <Option value="null">Seleccione un usuario</Option>
              {db.users.map((el, index) => (
                <Option key={index} value={el.email}>
                  {el.username} {el.surname} - {el.email}
                </Option>
              ))}
            </SelectFirst>
            {errors.forData && <ErrorInput>{errors.forData}</ErrorInput>}
          </InputContainer>
        ) : (
          <ForTextContainer>
            <ForText>Cargar pago para {forData}</ForText>
            <FaEdit size="1.5rem" onClick={handleChangeFor} />
          </ForTextContainer>
        )}
      </ForPartContainer>
      <PaymentContainer>
        <DayContainer>
          <InputContainer>
            <Label>D??a del pago</Label>
            <Select onChange={handleDay} id="day">
              <Option value="null">Seleccione d??a de pago realizado</Option>
              {[...Array(31).keys()].map((d, index) => (
                <Option value={d + 1} key={index}>
                  {d + 1}
                </Option>
              ))}
            </Select>
            {errors.day && <ErrorInput>{errors.day}</ErrorInput>}
          </InputContainer>
        </DayContainer>
        <MonthContainer>
          <InputContainer>
            <Label>Mes del pago</Label>
            <Select onChange={handleMonth} id="month">
              <Option value="null">Seleccione mes de pago realizado</Option>
              <Option value="Enero">Enero</Option>
              <Option value="Febrero">Febrero</Option>
              <Option value="Marzo">Marzo</Option>
              <Option value="Abril">Abril</Option>
              <Option value="Mayo">Mayo</Option>
              <Option value="Junio">Junio</Option>
              <Option value="Julio">Julio</Option>
              <Option value="Agosto">Agosto</Option>
              <Option value="Septiembre">Septiembre</Option>
              <Option value="Octubre">Octubre</Option>
              <Option value="Noviembre">Noviembre</Option>
              <Option value="Diciembre">Diciembre</Option>
            </Select>
            {errors.month && <ErrorInput>{errors.month}</ErrorInput>}
          </InputContainer>
        </MonthContainer>
        <YearContainer>
          <InputContainer>
            <Label>A??o del pago</Label>
            <Select onChange={handleYear} id="year">
              <Option value="null">Seleccione a??o de pago realizado</Option>
              {[...Array(new Date().getFullYear() - 2010).keys()].map(
                (d, index) => (
                  <Option value={d + 2011} key={index}>
                    {d + 2011}
                  </Option>
                )
              )}
            </Select>
            {errors.year && <ErrorInput>{errors.year}</ErrorInput>}
          </InputContainer>
        </YearContainer>
        <MountContainer>
          <InputContainer>
            <Label>Monto del pago</Label>
            <Input
              type="text"
              placeholder="Especifique monto del pago"
              id="mount"
              onChange={handleMount}
            />
            {errors.mount && <ErrorInput>{errors.mount}</ErrorInput>}
          </InputContainer>
        </MountContainer>
        {errors.form && <ErrorInput>{errors.form}</ErrorInput>}
        <ButtonPdf type="button" onClick={handlePdf}>
          Generar PDF
        </ButtonPdf>
        {viewPdf && (
          <PdfContainer>
            <Pdf src={instance.url} type="application/pdf"></Pdf>
          </PdfContainer>
        )}
        <ButtonSend type="submit">Enviar</ButtonSend>
      </PaymentContainer>
      <Toaster />
    </FormAddBill>
  );
};

const ButtonPdf = styled.button`
  font-family: ${FontFamily};
  background-color: ${primaryBlue};
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 2rem;
  padding: 10px 20px;
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;
  transition: all 0.5s ease-in-out;

  @media screen and (max-width: 480px) {
    font-size: 1.5rem;
  }

  :hover {
    cursor: pointer;
    background-color: ${secondaryBlue};
  }
`;

const ButtonSend = styled(ButtonPdf)`
  background-color: ${primaryRed};

  :hover {
    cursor: pointer;
    background-color: ${primaryBlue};
  }
`;

const DayContainer = styled.div`
  display: inline-grid;
  margin: 1rem 1rem 1rem 0;

  @media screen and (max-width: 480px) {
    margin: 0 1rem 0 0;
  }
`;

const ErrorInput = styled.div`
  font-size: 12px;
  color: ${errorInput};
  margin-bottom: 1rem;
  text-align: left;
  margin-left: 2rem;

  @media screen and (max-width: 480px) {
    margin-bottom: 0 !important;
    line-height: 1rem;
    margin-top: 1rem;
  }
`;

const FormAddBill = styled.form`
  padding: 0 5vw 0 5vw;
`;

const ForPartContainer = styled.div``;

const ForText = styled.p`
  margin-left: 1rem;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${primaryRed};
  font-style: italic;
  border: 3px solid rgb(117, 112, 112);
  border-radius: 1rem;

  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ForTextContainer = styled.div`
  display: flex;

  svg {
    color: ${secondaryBlue};
    padding: 1rem;
    transition: all 0.7s ease;
    margin-top: 2.5rem;

    @media screen and (max-width: 480px) {
      margin-top: 3rem;
    }
  }

  svg:hover {
    cursor: pointer;
    transform: scale(1.1);
    color: ${secondaryRed};
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
  width: 15vw;

  @media screen and (max-width: 480px) {
    font-size: 1.1rem;
    width: 55vw;
  }

  :focus {
    border-color: ${primaryRed};
    box-shadow: 0 0 0 3px rgba(65, 157, 199, 0.5);
  }
`;

const InputContainer = styled.div`
  display: inline-grid;
  margin: 1rem;
  line-height: 2.5rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 500;

  @media screen and (max-width: 480px) {
    margin-left: -5vw;
  }
`;

const MonthContainer = styled(DayContainer)``;

const MountContainer = styled(DayContainer)``;

const Option = styled.option`
  @media screen and (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const PaymentContainer = styled.div``;

const Pdf = styled.embed`
  width: 80vw;
  height: 40vw;
`;

const PdfContainer = styled.div`
  text-align: center;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  background-image: none;
  border: none;
  outline: none;
  padding: 0;

  font-family: ${FontFamily};
  background-color: #fff;
  color: #000;
  font-size: 1.2rem;
  width: 22vw;
  padding: 10px;
  border: 2px solid ${primaryBlue};
  border-radius: 4px;

  background-image: url('data:image/svg+xml;utf8,<svg fill="%23000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;

  @media screen and (max-width: 480px) {
    width: 80vw;
    font-size: 1.1rem;
    margin-left: -5vw;
  }

  :focus {
    border-color: 2px solid ${primaryRed};
    box-shadow: 0 0 0 3px rgba(65, 157, 199, 0.5);
  }

  :hover {
    cursor: pointer;
  }

  ::-ms-expand {
    display: none;
  }
`;

const SelectFirst = styled(Select)`
  width: 30vw;

  @media screen and (max-width: 480px) {
    width: 80vw;
  }
`;

const YearContainer = styled(DayContainer)``;
