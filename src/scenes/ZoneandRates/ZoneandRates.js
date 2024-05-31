import React,{useState, useEffect, useMemo} from "react";
import "../../styles/styles.scss";
import "./styles.scss";
import { Table, NavDropdown, Col, Row, Container } from "react-bootstrap";
import {
  ActionButton,
  CustomCheckbox,
  ScreenNav,
  SearchInput,
  TextInput,
} from "../../components";
import DatePicker from "../../components/DatePicker";
import { EditIcon } from "../../resources/icons";
import DeleteIcon from "../../resources/icons/DeleteIcon";
import CheckRadio from "../../components/CheckRadio";
import { compose } from 'lodash';
import auth from "../../state/ducks/auth";
import actions from "../../state/ducks/auth/actions";
import Dropdown from 'react-bootstrap/Dropdown';


const ZoneandRates = (props) => {


    const [selectedValue, setSelectedValue] = useState('');
    const [accdata, setAccData] = useState([]);
    const [selectCompany, setSelectCompany] = useState('Seleccione Usuario');
    const [rows, setRows] = useState([]);
    const [deletedRows, setDeletedRows] = useState(0);
    const [inputValues, setInputValues] = useState([]);
    const [selectDate, setSelectedDate] = useState(null);
    

      const value = JSON.parse(localStorage.getItem('persist:root'));
      const valuetoken = JSON.parse(value.auth);
      const token = valuetoken.userData.token
      const companyName = props.history.location.state.companyName

      const handleChange = (i,event) => {
        setInputValues(prevValues => {
          const updatedValues = [...prevValues];
          updatedValues[i] = {value: event.target.value, id: i}
          return updatedValues;
        });
      }
      
      const handleChangeDate = (date) => {
        setSelectedDate(date);
      }

      let contador = 0;
      function addFilas(num) {
          setSelectedValue(num)
          const newRows = [];
          for (let i = 0; i < num; i++) {
            newRows.push(
              <tr key={i} index={i} data-index={i} data-key={i} data-id={contador}>
                <td>{i + 1 }</td>
                <td>{<TextInput required={true} name="name" id={inputValues[i]?inputValues[i].id:''} onChange={(e)=>handleChange(i,e)}/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td>{<TextInput/>}</td>
                <td className="text-left text-warning">
                  <EditIcon type="secondaryIcon" width="23" height="20" />
                  <DeleteIcon onClick={e => handleDelete(e)} type="secondaryIcon" width="23" height="20" />
                </td>
              </tr>
            );
            contador++
          }
          setRows(newRows);
        }
      function handleDelete(e) {
        const id = e.currentTarget.parentNode.parentNode.getAttribute('data-id');
        
        setRows(prevRows => {
          const rows = [...prevRows];
          
          const index = rows.findIndex(row => row.props['data-id'] === Number(id));
          console.log('id', id)
          console.log('index', index)
          rows.splice(index, 1);
          return rows;
        });
      }

  console.log(rows)
  useEffect(() => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  
    const config = {
      method: 'GET',
      headers: headers
    };
  
    fetch('https://qa.derservicios.com.ar/v1/api/v1/api/account',config)
      .then(response => response.json())
      .then(accdata => {
        setAccData(accdata.data)
      })
  
    fetch('https://qa.derservicios.com.ar/v1/api/v1/api/enabled-places',config)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
  }, []); 
     /* fetch('http://localhost:4200/v1/api/account',config)
      .then(response => response.json())
      .then(accdata => {
        setAccData(accdata.data)
      })
 */
  return (
    <Container fluid>
      <Row style={{ justifyContent: "flex-start", margin: "5rem 0 5rem 0" }}>
        <Col xs={12} sm={8}>
          <h3 style={{textTransform: "uppercase"}}>Administrar Zonas y Tarifas - {companyName}</h3>
        </Col>
      </Row>
      <Row style={{ justifyContent: "center", margin: "1rem" }}>
        <Col xs={12} md={6}>
          <Row style={{ alignSelf: "center" }}>
            <TextInput
              label="Ingrese nombre del tarifario actual:"
              controlId="name"
              name="name"
              inputType="text"
              placeholder="Nombre del tarifario"
            />
          </Row>
          <Row style={{ alignSelf: "center" }}>
           <Dropdown>
      <Dropdown.Toggle className="clonedrop" id="dropdown-basic">
        {selectCompany}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {accdata.map((option) => (
          <Dropdown.Item key={option.id} onSelect={() => setSelectCompany(option.companyName)}>
            {option.companyName}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
      <ActionButton type="submit">Clonar</ActionButton>
      </Dropdown>
          </Row>



          <Row style={{ alignSelf: "center" }}>
            <NavDropdown
              style={{ width: "fit-content", height: "10%" }}
              className="border border-dark rounded-1 mr-2 mt-4 mb-3"
              title={`Cantidad de Zonas: ${rows.length}`}
              id="nav-dropdown"
            >
              <NavDropdown.Item onClick={()=>addFilas(1)}>1</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(2)}>2</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(3)}>3</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(4)}>4</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(5)}>5</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(6)}>6</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>addFilas(7)}>7</NavDropdown.Item>
            </NavDropdown>
          </Row>
        </Col>

        <Col xs={12} md={6}>
          <Row>
            <NavDropdown
              style={{ width: "fit-content", height: "10%" }}
              className="border border-dark rounded-1 mr-2 mt-4 mb-3"
              title={"Tarifas"}
              id="nav-dropdown"
            >
              <NavDropdown.Item>Tarifas</NavDropdown.Item>
              <NavDropdown.Item>Seguros</NavDropdown.Item>
              <NavDropdown.Item>Envios a domicilio</NavDropdown.Item>
              <NavDropdown.Item>Retiro a domicilio</NavDropdown.Item>
              <NavDropdown.Item>Todos</NavDropdown.Item>
              <NavDropdown.Item>Otros importes</NavDropdown.Item>
            </NavDropdown>
            <CheckRadio
              className="custom-checkradio"
              inline={true}
              disabled
              type="radio"
              label="Monto fijo"
            />
            <CheckRadio
              className="custom-checkradio"
              inline={true}
              type="radio"
              label="Porcentaje"
            />
          </Row>
          <Row style={{ alignSelf: "center" }}>
            <TextInput
              label="Actualizar tarifas: "
              controlId="name"
              name="name"
              inputType="text"
              placeholder="%"
              disabled
            />
            <ActionButton type="submit" disabled>Actualizar</ActionButton>
          </Row>
          <Row>
            <DatePicker
              label="Vigencia Desde:"
              className="picker form-control"
              selected={selectDate}
              onChange={handleChangeDate}
              dateFormat="dd/MM/yyyy"
              readOnly
            />
          </Row>
        </Col>
      </Row>
      <Container fluid>
        <Row style={{ justifyContent: "center", overflowX: "scroll" }}>
          <br />
          <br />
          <div className="">
            <Table style={{ overflow: "hidden" }} bordered hover>
              <thead>
                <tr className="trclass">
                  <th rowSpan={4}>Zona</th>
                  <th rowSpan={4}>Nombre</th>
                  <th colSpan={4}>Flete Base</th>
                  <th colSpan={5}>Adicionales</th>
                  <th rowSpan={4}>Acciones</th>
                </tr>

                <tr className="trclass2">
                  <th>Valor Final(KG)</th>
                  <th>Incremento Peso(KG)</th>
                  <th>Valor Inicial Tarifa($)</th>
                  <th>Incremento Tarifa flete</th>

                  <th>SEGURO</th>
                  <th>Envio Domicilio</th>
                  <th>Retiro Domicilio</th>
                  <th>Otros Importes</th> 
                  <th>Incremento tarifa adicionales</th>
                </tr>
              </thead>

              <tbody id="table1">
                {rows}
              </tbody>
            </Table>
          </div>
        </Row>
      </Container>

      <Row
        style={{
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Col
          style={{
            margin: "2rem",
            justifyContent: "center",
          }}
          xs={11}
          sm={6}
          md={3}
          className="p-0"
        >
          <ActionButton
            type="submit"
            width="90"
            onClick={() => {
              const name = document.getElementById("name").value;
              props.history.push({
                pathname: "/zones-and-rates/location-by-zone",
                state: { companyName, rows: rows.length, inputValues },
                location: props.location,
              });
            }}
          >
            Aceptar
          </ActionButton>
          <ActionButton
                secondary
                width="90"
                onClick={() => {
                 props.history.push({
                    pathname: "/account-modification",
                  });
                }}
              >
                Volver
              </ActionButton>
              
        </Col>
      </Row>
    </Container>
  );
};

export default ZoneandRates;
