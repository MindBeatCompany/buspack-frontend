import { Modal, Button } from "react-bootstrap";

const GenericModal = ({ bodyText, title, subtitle, modalShow, setModalShow }) => {

  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{subtitle}</h4>
        <p>{bodyText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenericModal;
